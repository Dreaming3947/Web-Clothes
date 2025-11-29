<?php
require_once __DIR__ . '/../config/database.php';

class Category {
    private $conn;
    private $table = 'categories';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all active categories
     * @param bool $includeChildren - Whether to include child categories
     * @return array
     */
    public function getAll($includeChildren = true) {
        try {
            if ($includeChildren) {
                // Get all active categories (both parent and child)
                $query = "SELECT id, name, slug, description, icon, parent_id, display_order 
                         FROM {$this->table} 
                         WHERE status = 'active' 
                         ORDER BY display_order ASC, name ASC";
            } else {
                // Get only parent categories
                $query = "SELECT id, name, slug, description, icon, parent_id, display_order 
                         FROM {$this->table} 
                         WHERE status = 'active' AND parent_id IS NULL 
                         ORDER BY display_order ASC, name ASC";
            }

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in Category::getAll - " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get categories organized in hierarchical structure
     * @return array
     */
    public function getHierarchical() {
        try {
            $allCategories = $this->getAll(true);
            $parents = [];
            $children = [];

            // Separate parents and children
            foreach ($allCategories as $category) {
                if ($category['parent_id'] === null) {
                    $parents[$category['id']] = $category;
                    $parents[$category['id']]['children'] = [];
                } else {
                    $children[] = $category;
                }
            }

            // Attach children to parents
            foreach ($children as $child) {
                $parentId = $child['parent_id'];
                if (isset($parents[$parentId])) {
                    $parents[$parentId]['children'][] = $child;
                }
            }

            return array_values($parents);
        } catch (Exception $e) {
            error_log("Error in Category::getHierarchical - " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get category by ID
     * @param int $id
     * @return array|null
     */
    public function getById($id) {
        try {
            $query = "SELECT id, name, slug, description, icon, parent_id, display_order 
                     FROM {$this->table} 
                     WHERE id = :id AND status = 'active'";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error in Category::getById - " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get category by slug
     * @param string $slug
     * @return array|null
     */
    public function getBySlug($slug) {
        try {
            $query = "SELECT id, name, slug, description, icon, parent_id, display_order 
                     FROM {$this->table} 
                     WHERE slug = :slug AND status = 'active'";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':slug', $slug, PDO::PARAM_STR);
            $stmt->execute();
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error in Category::getBySlug - " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get children of a parent category
     * @param int $parentId
     * @return array
     */
    public function getChildren($parentId) {
        try {
            $query = "SELECT id, name, slug, description, icon, parent_id, display_order 
                     FROM {$this->table} 
                     WHERE parent_id = :parent_id AND status = 'active' 
                     ORDER BY display_order ASC, name ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':parent_id', $parentId, PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in Category::getChildren - " . $e->getMessage());
            return [];
        }
    }
}
