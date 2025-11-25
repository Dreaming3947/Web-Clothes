<?php
/**
 * Database Configuration
 * Cấu hình kết nối database
 */

class Database {
    private $host = "localhost";
    private $db_name = "secondhand_marketplace";
    private $username = "root";
    private $password = "longlol260305";
    private $charset = "utf8mb4";
    public $conn;

    /**
     * Kết nối đến database
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch(PDOException $e) {
            error_log("Connection Error: " . $e->getMessage());
            throw new Exception("Không thể kết nối đến database");
        }

        return $this->conn;
    }

    /**
     * Đóng kết nối
     */
    public function closeConnection() {
        $this->conn = null;
    }
}
