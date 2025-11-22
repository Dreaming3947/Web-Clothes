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
                  (seller_id, category_id, title, slug, description, price, `condition`, 
                   size, brand, color, material, location_city, location_district, status, 
                   shipping_methods, payment_methods) 
                  VALUES 
                  (:seller_id, :category_id, :title, :slug, :description, :price, :condition, 
                   :size, :brand, :color, :material, :location_city, :location_district, :status,
                   :shipping_methods, :payment_methods)";

        $stmt = $this->conn->prepare($query);

        // Generate slug
        $slug = $this->generateSlug($data['title']);

        $stmt->bindParam(':seller_id', $data['seller_id']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':condition', $data['condition']);
        $stmt->bindParam(':size', $data['size']);
        $stmt->bindParam(':brand', $data['brand']);
        $stmt->bindParam(':color', $data['color']);
        $stmt->bindParam(':material', $data['material']);
        $stmt->bindParam(':location_city', $data['location_city']);
        $stmt->bindParam(':location_district', $data['location_district']);
        $stmt->bindParam(':status', $data['status']);
        
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
    public function getById($id, $incrementView = false) {
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
            
            // Parse JSON fields
            $product['shipping_methods'] = json_decode($product['shipping_methods'], true);
            $product['payment_methods'] = json_decode($product['payment_methods'], true);
            $product['tags'] = $product['tags'] ? explode(',', $product['tags']) : [];
        }

        return $product;
    }

    /**
     * Get all products với filters và pagination
     */
    public function getAll($page = 1, $limit = PRODUCTS_PER_PAGE, $filters = []) {
        $offset = ($page - 1) * $limit;
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
            $where[] = "p.brand = :brand";
            $params[':brand'] = $filters['brand'];
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

        // Get total count
        $countQuery = "SELECT COUNT(*) as total 
                       FROM " . $this->table . " p 
                       WHERE $whereClause";
        $countStmt = $this->conn->prepare($countQuery);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        // Get data
        $query = "SELECT p.*, 
                         u.full_name as seller_name,
                         c.name as category_name,
                         (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                  FROM " . $this->table . " p
                  LEFT JOIN users u ON p.seller_id = u.id
                  LEFT JOIN categories c ON p.category_id = c.id
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

        // Get images for each product
        foreach ($products as &$product) {
            $product['images'] = $this->getImages($product['id'], 1); // Get only first image for listing
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
        $allowedFields = ['title', 'description', 'price', 'category_id', 'condition', 
                          'size', 'brand', 'color', 'material', 'location_city', 
                          'location_district', 'status'];
        
        $fields = [];
        $params = [':id' => $id];

        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                $fields[] = "$key = :$key";
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

        $countQuery = "SELECT COUNT(*) as total FROM favorites WHERE user_id = :user_id";
        $countStmt = $this->conn->prepare($countQuery);
        $countStmt->bindParam(':user_id', $userId);
        $countStmt->execute();
        $total = $countStmt->fetch()['total'];

        $query = "SELECT p.*, 
                         (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                  FROM favorites f
                  INNER JOIN products p ON f.product_id = p.id
                  WHERE f.user_id = :user_id AND p.status = 'approved'
                  ORDER BY f.created_at DESC
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();

        return [
            'data' => $stmt->fetchAll(),
            'total' => $total
        ];
    }

    /**
     * Generate unique slug
     */
    private function generateSlug($title) {
        // Convert to lowercase and remove accents
        $slug = mb_strtolower($title);
        
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
}
