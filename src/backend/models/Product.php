<?php
/**
 * Product Model
 * Model cho bảng products
 */

class Product {
    private $conn;
    private $table = 'products';

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Tạo sản phẩm mới
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (seller_id, category_id, title, slug, description, specifications, price, original_price,
                   `condition`, condition_detail, size, brand, color, material, 
                   location_city, location_district, status, allow_negotiation, min_acceptable_price,
                   shipping_methods, payment_methods) 
                  VALUES 
                  (:seller_id, :category_id, :title, :slug, :description, :specifications, :price, :original_price,
                   :condition, :condition_detail, :size, :brand, :color, :material, 
                   :location_city, :location_district, :status, :allow_negotiation, :min_acceptable_price,
                   :shipping_methods, :payment_methods)";

        $stmt = $this->conn->prepare($query);

        // Generate slug
        $slug = $this->generateSlug($data['title']);

        $stmt->bindParam(':seller_id', $data['seller_id']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':description', $data['description']);
        
        // JSON encode specifications
        $specifications = isset($data['specifications']) ? json_encode($data['specifications'], JSON_UNESCAPED_UNICODE) : null;
        $stmt->bindParam(':specifications', $specifications);
        
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':original_price', $data['original_price']);
        $stmt->bindParam(':condition', $data['condition']);
        
        $conditionDetail = $data['condition_detail'] ?? '';
        $stmt->bindParam(':condition_detail', $conditionDetail);
        
        $size = $data['size'] ?? '';
        $stmt->bindParam(':size', $size);
        
        $brand = $data['brand'] ?? '';
        $stmt->bindParam(':brand', $brand);
        
        $color = $data['color'] ?? '';
        $stmt->bindParam(':color', $color);
        
        $material = $data['material'] ?? '';
        $stmt->bindParam(':material', $material);
        
        $stmt->bindParam(':location_city', $data['location_city']);
        
        $locationDistrict = $data['location_district'] ?? '';
        $stmt->bindParam(':location_district', $locationDistrict);
        
        $stmt->bindParam(':status', $data['status']);
        
        $allowNegotiation = isset($data['allow_negotiation']) ? (int)$data['allow_negotiation'] : 1;
        $stmt->bindParam(':allow_negotiation', $allowNegotiation);
        
        $minPrice = $data['min_acceptable_price'] ?? null;
        $stmt->bindParam(':min_acceptable_price', $minPrice);
        
        $shippingMethods = isset($data['shipping_methods']) ? json_encode($data['shipping_methods']) : null;
        $paymentMethods = isset($data['payment_methods']) ? json_encode($data['payment_methods']) : null;
        
        $stmt->bindParam(':shipping_methods', $shippingMethods);
        $stmt->bindParam(':payment_methods', $paymentMethods);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }

        return false;
    }

    /**
     * Lấy sản phẩm theo ID
     */
    public function getById($id, $incrementView = false, $userId = null) {
        if ($incrementView) {
            $this->incrementViews($id);
        }

        $query = "SELECT p.*, 
                         u.full_name as seller_name, u.avatar as seller_avatar, u.phone as seller_phone,
                         c.name as category_name,
                         (SELECT COUNT(*) FROM favorites WHERE product_id = p.id) as favorites_count,
                         (SELECT GROUP_CONCAT(tag) FROM product_tags WHERE product_id = p.id) as tags
                  FROM " . $this->table . " p
                  LEFT JOIN users u ON p.seller_id = u.id
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.id = :id
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $product = $stmt->fetch();

        if ($product) {
            // Get images
            $product['images'] = $this->getImages($id);
            
            // Check if favorited by current user
            if ($userId) {
                $favQuery = "SELECT COUNT(*) as is_fav FROM favorites WHERE product_id = :product_id AND user_id = :user_id";
                $favStmt = $this->conn->prepare($favQuery);
                $favStmt->bindValue(':product_id', $id, PDO::PARAM_INT);
                $favStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
                $favStmt->execute();
                $product['is_favorited'] = (int)$favStmt->fetch()['is_fav'] > 0;
            } else {
                $product['is_favorited'] = false;
            }
            
            // Parse JSON fields
            $product['specifications'] = json_decode($product['specifications'], true);
            $product['shipping_methods'] = json_decode($product['shipping_methods'], true);
            $product['payment_methods'] = json_decode($product['payment_methods'], true);
            $product['tags'] = $product['tags'] ? explode(',', $product['tags']) : [];
        }

        return $product;
    }

    /**
     * Get all products với filters và pagination
     */
    public function getAll($page = 1, $limit = PRODUCTS_PER_PAGE, $filters = [], $userId = null) {
        $offset = ($page - 1) * $limit;
        // Chỉ lấy sản phẩm approved và chưa bán (loại bỏ sold, deleted, rejected)
        $where = ['p.status = "approved"'];
        $params = [];
        $joins = [];

        // Search
        if (!empty($filters['search'])) {
            $where[] = "MATCH(p.title, p.description) AGAINST(:search IN NATURAL LANGUAGE MODE)";
            $params[':search'] = $filters['search'];
        }

        // Category
        if (!empty($filters['category_id'])) {
            $where[] = "p.category_id = :category_id";
            $params[':category_id'] = $filters['category_id'];
        }

        // Price range
        if (!empty($filters['min_price'])) {
            $where[] = "p.price >= :min_price";
            $params[':min_price'] = $filters['min_price'];
        }
        if (!empty($filters['max_price'])) {
            $where[] = "p.price <= :max_price";
            $params[':max_price'] = $filters['max_price'];
        }

        // Condition
        if (!empty($filters['condition'])) {
            if (is_array($filters['condition'])) {
                $placeholders = [];
                foreach ($filters['condition'] as $idx => $cond) {
                    $key = ":condition$idx";
                    $placeholders[] = $key;
                    $params[$key] = $cond;
                }
                $where[] = "p.condition IN (" . implode(',', $placeholders) . ")";
            } else {
                $where[] = "p.condition = :condition";
                $params[':condition'] = $filters['condition'];
            }
        }

        // Size
        if (!empty($filters['size'])) {
            if (is_array($filters['size'])) {
                $placeholders = [];
                foreach ($filters['size'] as $idx => $size) {
                    $key = ":size$idx";
                    $placeholders[] = $key;
                    $params[$key] = $size;
                }
                $where[] = "p.size IN (" . implode(',', $placeholders) . ")";
            } else {
                $where[] = "p.size = :size";
                $params[':size'] = $filters['size'];
            }
        }

        // Brand
        if (!empty($filters['brand'])) {
            if (is_array($filters['brand'])) {
                $placeholders = [];
                foreach ($filters['brand'] as $idx => $brand) {
                    $key = ":brand$idx";
                    $placeholders[] = $key;
                    $params[$key] = $brand;
                }
                $where[] = "p.brand IN (" . implode(',', $placeholders) . ")";
            } else {
                $where[] = "p.brand = :brand";
                $params[':brand'] = $filters['brand'];
            }
        }
        
        // Category by name (for frontend filters)
        // This includes both parent and child categories
        if (!empty($filters['category'])) {
            $joins[] = "LEFT JOIN categories cat ON p.category_id = cat.id";
            $joins[] = "LEFT JOIN categories parent_cat ON cat.parent_id = parent_cat.id";
            
            if (is_array($filters['category'])) {
                $catPlaceholders = [];
                $parentPlaceholders = [];
                foreach ($filters['category'] as $idx => $cat) {
                    // For cat.slug
                    $catKey = ":category_cat$idx";
                    $catPlaceholders[] = $catKey;
                    $params[$catKey] = $cat;
                    
                    // For parent_cat.slug
                    $parentKey = ":category_parent$idx";
                    $parentPlaceholders[] = $parentKey;
                    $params[$parentKey] = $cat;
                }
                $catList = implode(',', $catPlaceholders);
                $parentList = implode(',', $parentPlaceholders);
                // Match either the category itself OR its parent category
                $where[] = "(cat.slug IN ($catList) OR parent_cat.slug IN ($parentList))";
            } else {
                $where[] = "(cat.slug = :category_cat OR parent_cat.slug = :category_parent)";
                $params[':category_cat'] = $filters['category'];
                $params[':category_parent'] = $filters['category'];
            }
        }

        // Location
        if (!empty($filters['location_city'])) {
            $where[] = "p.location_city = :location_city";
            $params[':location_city'] = $filters['location_city'];
        }

        // Seller
        if (!empty($filters['seller_id'])) {
            $where[] = "p.seller_id = :seller_id";
            $params[':seller_id'] = $filters['seller_id'];
        }

        // Featured
        if (!empty($filters['is_featured'])) {
            $where[] = "p.is_featured = 1";
        }

        $whereClause = implode(' AND ', $where);

        // Order by
        $orderBy = 'p.created_at DESC';
        if (!empty($filters['sort'])) {
            switch ($filters['sort']) {
                case 'price_asc':
                    $orderBy = 'p.price ASC';
                    break;
                case 'price_desc':
                    $orderBy = 'p.price DESC';
                    break;
                case 'popular':
                    $orderBy = 'p.views_count DESC';
                    break;
                case 'newest':
                default:
                    $orderBy = 'p.created_at DESC';
                    break;
            }
        }

        $joinsClause = !empty($joins) ? implode(' ', $joins) : '';

        // Get total count
        $countQuery = "SELECT COUNT(DISTINCT p.id) as total 
                       FROM " . $this->table . " p 
                       $joinsClause
                       WHERE $whereClause";
        
        $countStmt = $this->conn->prepare($countQuery);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        // Get data
        $query = "SELECT DISTINCT p.*, 
                         u.full_name as seller_name,
                         c.name as category_name,
                         (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                  FROM " . $this->table . " p
                  LEFT JOIN users u ON p.seller_id = u.id
                  LEFT JOIN categories c ON p.category_id = c.id
                  $joinsClause
                  WHERE $whereClause 
                  ORDER BY $orderBy 
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        
        $stmt->execute();
        $products = $stmt->fetchAll();

        // Get images for each product and check if favorited
        foreach ($products as &$product) {
            $product['images'] = $this->getImages($product['id'], 1); // Get only first image for listing
            
            // Check if product is favorited by current user
            if ($userId) {
                $favQuery = "SELECT COUNT(*) as is_fav FROM favorites WHERE product_id = :product_id AND user_id = :user_id";
                $favStmt = $this->conn->prepare($favQuery);
                $favStmt->bindValue(':product_id', $product['id'], PDO::PARAM_INT);
                $favStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
                $favStmt->execute();
                $product['is_favorited'] = (int)$favStmt->fetch()['is_fav'] > 0;
            } else {
                $product['is_favorited'] = false;
            }
        }

        return [
            'data' => $products,
            'total' => $total
        ];
    }

    /**
     * Update sản phẩm
     */
    public function update($id, $data) {
        $allowedFields = ['title', 'description', 'specifications', 'price', 'original_price', 
                          'category_id', 'condition', 'condition_detail', 'size', 'brand', 
                          'color', 'material', 'location_city', 'location_district', 
                          'allow_negotiation', 'min_acceptable_price', 'status',
                          'shipping_methods', 'payment_methods'];
        
        $fields = [];
        $params = [':id' => $id];

        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                // Handle JSON fields
                if (in_array($key, ['specifications', 'shipping_methods', 'payment_methods']) && is_array($value)) {
                    $value = json_encode($value, JSON_UNESCAPED_UNICODE);
                }
                
                // Use backticks for reserved keywords
                if ($key === 'condition') {
                    $fields[] = "`$key` = :$key";
                } else {
                    $fields[] = "$key = :$key";
                }
                $params[":$key"] = $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $query = "UPDATE " . $this->table . " 
                  SET " . implode(', ', $fields) . ", updated_at = NOW() 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($params);
    }

    /**
     * Xóa sản phẩm (soft delete)
     */
    public function delete($id) {
        $query = "UPDATE " . $this->table . " 
                  SET status = 'deleted' 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    /**
     * Add images to product
     */
    public function addImages($productId, $images, $primaryIndex = 0) {
        $query = "INSERT INTO product_images (product_id, image_url, display_order, is_primary) 
                  VALUES (:product_id, :image_url, :display_order, :is_primary)";

        $stmt = $this->conn->prepare($query);

        foreach ($images as $index => $image) {
            $isPrimary = ($index === $primaryIndex) ? 1 : 0;
            
            $stmt->bindParam(':product_id', $productId);
            $stmt->bindParam(':image_url', $image);
            $stmt->bindParam(':display_order', $index);
            $stmt->bindParam(':is_primary', $isPrimary);
            
            $stmt->execute();
        }

        return true;
    }

    /**
     * Get product images
     */
    public function getImages($productId, $limit = null) {
        $query = "SELECT image_url, thumbnail_url, is_primary 
                  FROM product_images 
                  WHERE product_id = :product_id 
                  ORDER BY is_primary DESC, display_order ASC";

        if ($limit) {
            $query .= " LIMIT " . (int)$limit;
        }

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':product_id', $productId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    /**
     * Delete product images
     */
    public function deleteImages($productId) {
        $query = "DELETE FROM product_images WHERE product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':product_id', $productId);
        return $stmt->execute();
    }

    /**
     * Add tags to product
     */
    public function addTags($productId, $tags) {
        if (empty($tags)) {
            return true;
        }

        $query = "INSERT INTO product_tags (product_id, tag) VALUES (:product_id, :tag)";
        $stmt = $this->conn->prepare($query);

        foreach ($tags as $tag) {
            $tag = trim($tag);
            if (!empty($tag)) {
                $stmt->bindParam(':product_id', $productId);
                $stmt->bindParam(':tag', $tag);
                $stmt->execute();
            }
        }

        return true;
    }

    /**
     * Increment views count
     */
    private function incrementViews($id) {
        $query = "UPDATE " . $this->table . " 
                  SET views_count = views_count + 1 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Toggle favorite
     */
    public function toggleFavorite($userId, $productId) {
        // Check if already favorited
        $checkQuery = "SELECT id FROM favorites 
                       WHERE user_id = :user_id AND product_id = :product_id";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(':user_id', $userId);
        $checkStmt->bindParam(':product_id', $productId);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            // Remove favorite
            $deleteQuery = "DELETE FROM favorites 
                           WHERE user_id = :user_id AND product_id = :product_id";
            $deleteStmt = $this->conn->prepare($deleteQuery);
            $deleteStmt->bindParam(':user_id', $userId);
            $deleteStmt->bindParam(':product_id', $productId);
            $deleteStmt->execute();
            return ['favorited' => false];
        } else {
            // Add favorite
            $insertQuery = "INSERT INTO favorites (user_id, product_id) 
                           VALUES (:user_id, :product_id)";
            $insertStmt = $this->conn->prepare($insertQuery);
            $insertStmt->bindParam(':user_id', $userId);
            $insertStmt->bindParam(':product_id', $productId);
            $insertStmt->execute();
            return ['favorited' => true];
        }
    }

    /**
     * Get user favorites
     */
    public function getUserFavorites($userId, $page = 1, $limit = 20) {
        $offset = ($page - 1) * $limit;

        error_log("getUserFavorites called with userId: $userId, page: $page, limit: $limit");

        $countQuery = "SELECT COUNT(*) as total FROM favorites WHERE user_id = :user_id";
        $countStmt = $this->conn->prepare($countQuery);
        $countStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $countStmt->execute();
        $total = $countStmt->fetch()['total'];
        
        error_log("Total favorites in DB for user $userId: $total");

        $query = "SELECT p.*, 
                         (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                  FROM favorites f
                  INNER JOIN products p ON f.product_id = p.id
                  WHERE f.user_id = :user_id AND p.status = 'approved'
                  ORDER BY f.created_at DESC
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();

        $products = $stmt->fetchAll();
        
        error_log("Products fetched from favorites: " . count($products));
        
        // Get all images for each product
        foreach ($products as &$product) {
            $product['images'] = $this->getImages($product['id']);
        }

        return [
            'data' => $products,
            'total' => $total
        ];
    }

    /**
     * Generate unique slug
     */
    private function generateSlug($title) {
        // Convert to lowercase
        $slug = strtolower($title);
        
        // Vietnamese accents removal
        $slug = preg_replace('/[àáạảãâầấậẩẫăằắặẳẵ]/u', 'a', $slug);
        $slug = preg_replace('/[èéẹẻẽêềếệểễ]/u', 'e', $slug);
        $slug = preg_replace('/[ìíịỉĩ]/u', 'i', $slug);
        $slug = preg_replace('/[òóọỏõôồốộổỗơờớợởỡ]/u', 'o', $slug);
        $slug = preg_replace('/[ùúụủũưừứựửữ]/u', 'u', $slug);
        $slug = preg_replace('/[ỳýỵỷỹ]/u', 'y', $slug);
        $slug = preg_replace('/đ/u', 'd', $slug);
        
        // Remove special characters
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        $slug = trim($slug, '-');

        // Make unique
        $originalSlug = $slug;
        $counter = 1;
        
        while ($this->slugExists($slug)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Check if slug exists
     */
    private function slugExists($slug) {
        $query = "SELECT id FROM " . $this->table . " WHERE slug = :slug LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    /**
     * Mark as sold
     */
    public function markAsSold($id) {
        $query = "UPDATE " . $this->table . " 
                  SET status = 'sold', sold_at = NOW() 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    /**
     * Approve product
     */
    public function approve($id, $approvedBy) {
        $query = "UPDATE " . $this->table . " 
                  SET status = 'approved', 
                      approved_at = NOW(), 
                      approved_by = :approved_by 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':approved_by', $approvedBy);

        return $stmt->execute();
    }

    /**
     * Reject product
     */
    public function reject($id, $reason) {
        $query = "UPDATE " . $this->table . " 
                  SET status = 'rejected', 
                      rejection_reason = :reason 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':reason', $reason);

        return $stmt->execute();
    }

    /**
     * Get distinct brands from products
     */
    public function getDistinctBrands() {
        try {
            $query = "SELECT DISTINCT brand 
                     FROM {$this->table} 
                     WHERE brand IS NOT NULL 
                       AND brand != '' 
                       AND status = 'approved'
                     ORDER BY brand ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $brands = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $brands[] = $row['brand'];
            }
            
            return $brands;
        } catch (PDOException $e) {
            error_log("Error in Product::getDistinctBrands - " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get product count by category slug (including children)
     */
    public function getCountByCategory($categorySlug = null) {
        try {
            if ($categorySlug) {
                // Count products in this category or its children
                $query = "SELECT COUNT(DISTINCT p.id) as count
                         FROM {$this->table} p
                         INNER JOIN categories cat ON p.category_id = cat.id
                         LEFT JOIN categories parent_cat ON cat.parent_id = parent_cat.id
                         WHERE p.status = 'approved'
                           AND (cat.slug = :slug OR parent_cat.slug = :slug2)";
                
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':slug', $categorySlug);
                $stmt->bindParam(':slug2', $categorySlug);
            } else {
                // Count all approved products
                $query = "SELECT COUNT(*) as count
                         FROM {$this->table}
                         WHERE status = 'approved'";
                
                $stmt = $this->conn->prepare($query);
            }
            
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return (int)($result['count'] ?? 0);
        } catch (PDOException $e) {
            error_log("Error in Product::getCountByCategory - " . $e->getMessage());
            return 0;
        }
    }
}
