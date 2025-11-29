<?php
/**
 * Database Configuration for Production (InfinityFree)
 * 
 * HƯỚNG DẪN:
 * 1. Đổi tên file này thành database.php khi deploy lên hosting
 * 2. Thay thế các thông tin database bằng thông tin từ InfinityFree Control Panel
 * 3. KHÔNG commit file database.php có thông tin thật lên Git
 */

class Database {
    // Thông tin database local (XAMPP/MAMP/WAMP)
    private $host = "localhost";  // Hostname database
    private $db_name = "secondhand_marketplace";     // Tên database local
    private $username = "root";                // Username database mặc định
    private $password = "password";        // Password database mặc định (rỗng)
    private $conn;

    /**
     * Kết nối database
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch(PDOException $e) {
            // Log error (nếu có file log)
            error_log("Database Connection Error: " . $e->getMessage());
            
            // Hiển thị thông báo user-friendly
            die("Lỗi kết nối database. Vui lòng thử lại sau.");
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
