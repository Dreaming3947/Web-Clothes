<?php
// Test database connection
try {
    $dsn = "mysql:host=localhost;dbname=secondhand_marketplace;charset=utf8mb4";
    $username = "root";
    $password = "longlol260305";
    
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Kết nối database thành công!\n";
    
    // Test query
    $stmt = $conn->query("SELECT COUNT(*) as total FROM users");
    $result = $stmt->fetch();
    echo "Số lượng users: " . $result['total'] . "\n";
    
} catch(PDOException $e) {
    echo "❌ Lỗi kết nối: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getCode() . "\n";
}
