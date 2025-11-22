<?php
/**
 * User Model
 * Model cho bảng users
 */

class User {
    private $conn;
    private $table = 'users';

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Tạo user mới
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (email, password_hash, full_name, phone, role, verification_token) 
                  VALUES (:email, :password_hash, :full_name, :phone, :role, :verification_token)";

        $stmt = $this->conn->prepare($query);

        // Hash password
        $passwordHash = Auth::hashPassword($data['password']);
        $verificationToken = Auth::generateRandomToken();

        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':password_hash', $passwordHash);
        $stmt->bindParam(':full_name', $data['full_name']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':role', $data['role']);
        $stmt->bindParam(':verification_token', $verificationToken);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }

        return false;
    }

    /**
     * Lấy user theo email
     */
    public function getByEmail($email) {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Lấy user theo ID
     */
    public function getById($id) {
        $query = "SELECT id, email, full_name, phone, avatar, address, city, district, role, status, 
                         email_verified, phone_verified, created_at 
                  FROM " . $this->table . " 
                  WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Update user
     */
    public function update($id, $data) {
        $fields = [];
        $params = [':id' => $id];

        foreach ($data as $key => $value) {
            if ($key !== 'id' && $key !== 'password') {
                $fields[] = "$key = :$key";
                $params[":$key"] = $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $query = "UPDATE " . $this->table . " 
                  SET " . implode(', ', $fields) . " 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($params);
    }

    /**
     * Update password
     */
    public function updatePassword($id, $newPassword) {
        $query = "UPDATE " . $this->table . " 
                  SET password_hash = :password_hash 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $passwordHash = Auth::hashPassword($newPassword);
        
        $stmt->bindParam(':password_hash', $passwordHash);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    /**
     * Update last login
     */
    public function updateLastLogin($id) {
        $query = "UPDATE " . $this->table . " 
                  SET last_login = NOW() 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    /**
     * Kiểm tra email đã tồn tại
     */
    public function emailExists($email, $excludeId = null) {
        $query = "SELECT id FROM " . $this->table . " WHERE email = :email";
        
        if ($excludeId) {
            $query .= " AND id != :exclude_id";
        }
        
        $query .= " LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        
        if ($excludeId) {
            $stmt->bindParam(':exclude_id', $excludeId);
        }

        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    /**
     * Get all users với pagination
     */
    public function getAll($page = 1, $limit = 20, $filters = []) {
        $offset = ($page - 1) * $limit;
        $where = ['1=1'];
        $params = [];

        // Apply filters
        if (!empty($filters['search'])) {
            $where[] = "(full_name LIKE :search OR email LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['role'])) {
            $where[] = "role = :role";
            $params[':role'] = $filters['role'];
        }

        if (!empty($filters['status'])) {
            $where[] = "status = :status";
            $params[':status'] = $filters['status'];
        }

        $whereClause = implode(' AND ', $where);

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM " . $this->table . " WHERE $whereClause";
        $countStmt = $this->conn->prepare($countQuery);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        // Get data
        $query = "SELECT id, email, full_name, phone, avatar, role, status, email_verified, created_at 
                  FROM " . $this->table . " 
                  WHERE $whereClause 
                  ORDER BY created_at DESC 
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        
        $stmt->execute();

        return [
            'data' => $stmt->fetchAll(),
            'total' => $total
        ];
    }

    /**
     * Update user status
     */
    public function updateStatus($id, $status) {
        $query = "UPDATE " . $this->table . " 
                  SET status = :status 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    /**
     * Verify email
     */
    public function verifyEmail($token) {
        $query = "UPDATE " . $this->table . " 
                  SET email_verified = 1, verification_token = NULL 
                  WHERE verification_token = :token";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);

        return $stmt->execute() && $stmt->rowCount() > 0;
    }

    /**
     * Set password reset token
     */
    public function setPasswordResetToken($email) {
        $token = Auth::generateRandomToken();
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $query = "UPDATE " . $this->table . " 
                  SET reset_password_token = :token, 
                      reset_password_expires = :expires 
                  WHERE email = :email";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expires', $expires);
        $stmt->bindParam(':email', $email);

        if ($stmt->execute() && $stmt->rowCount() > 0) {
            return $token;
        }

        return false;
    }

    /**
     * Reset password với token
     */
    public function resetPassword($token, $newPassword) {
        // Check token validity
        $query = "SELECT id FROM " . $this->table . " 
                  WHERE reset_password_token = :token 
                  AND reset_password_expires > NOW() 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        $user = $stmt->fetch();

        if (!$user) {
            return false;
        }

        // Update password
        $passwordHash = Auth::hashPassword($newPassword);

        $updateQuery = "UPDATE " . $this->table . " 
                        SET password_hash = :password_hash, 
                            reset_password_token = NULL, 
                            reset_password_expires = NULL 
                        WHERE id = :id";

        $updateStmt = $this->conn->prepare($updateQuery);
        $updateStmt->bindParam(':password_hash', $passwordHash);
        $updateStmt->bindParam(':id', $user['id']);

        return $updateStmt->execute();
    }

    /**
     * Get user statistics
     */
    public function getStatistics($userId) {
        $query = "SELECT 
                    (SELECT COUNT(*) FROM products WHERE seller_id = :user_id) as total_products,
                    (SELECT COUNT(*) FROM products WHERE seller_id = :user_id AND status = 'sold') as sold_products,
                    (SELECT COUNT(*) FROM orders WHERE buyer_id = :user_id) as total_purchases,
                    (SELECT COUNT(*) FROM favorites WHERE user_id = :user_id) as total_favorites,
                    (SELECT AVG(rating) FROM reviews WHERE reviewed_user_id = :user_id) as avg_rating,
                    (SELECT COUNT(*) FROM reviews WHERE reviewed_user_id = :user_id) as total_reviews";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();

        return $stmt->fetch();
    }
}
