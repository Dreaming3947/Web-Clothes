<?php
/**
 * Admin API Endpoint
 * Handles admin operations: users, products, orders management and statistics
 */

header('Access-Control-Allow-Origin: http://localhost:3000'); // Để nguyên cho local frontend
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../utils/Auth.php';
require_once __DIR__ . '/../utils/Response.php';

// Verify admin authentication
$currentUser = Auth::requireAuth();
if (!$currentUser || $currentUser['role'] !== 'admin') {
    Response::error('Access denied. Admin only.', null, 403);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'stats':
            handleGetStats($db);
            break;
        
        case 'users':
            handleGetUsers($db);
            break;
        
        case 'products':
            handleGetProducts($db);
            break;
        
        case 'orders':
            handleGetOrders($db);
            break;
        
        case 'user-action':
            handleUserAction($db);
            break;
        
        case 'product-action':
            handleProductAction($db);
            break;
        
        default:
            Response::error('Invalid action', null, 400);
    }
} catch (Exception $e) {
    Response::error('Server error: ' . $e->getMessage(), null, 500);
}

function handleGetStats($db) {
    try {
        // Total users
        $stmt = $db->prepare("SELECT COUNT(*) as total FROM users WHERE status != 'deleted'");
        $stmt->execute();
        $totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total products
        $stmt = $db->prepare("SELECT COUNT(*) as total FROM products WHERE status != 'deleted'");
        $stmt->execute();
        $totalProducts = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total orders
        $stmt = $db->prepare("SELECT COUNT(*) as total FROM orders");
        $stmt->execute();
        $totalOrders = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Monthly revenue (current month)
        $stmt = $db->prepare("
            SELECT COALESCE(SUM(final_amount), 0) as revenue 
            FROM orders 
            WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
            AND payment_status = 'paid'
        ");
        $stmt->execute();
        $monthlyRevenue = $stmt->fetch(PDO::FETCH_ASSOC)['revenue'];
        
        // Total revenue (all time)
        $stmt = $db->prepare("
            SELECT COALESCE(SUM(final_amount), 0) as revenue 
            FROM orders 
            WHERE payment_status = 'paid'
        ");
        $stmt->execute();
        $totalRevenue = $stmt->fetch(PDO::FETCH_ASSOC)['revenue'];
        
        Response::success('Stats retrieved successfully', [
            'total_users' => (int)$totalUsers,
            'total_products' => (int)$totalProducts,
            'total_orders' => (int)$totalOrders,
            'monthly_revenue' => (float)$monthlyRevenue,
            'total_revenue' => (float)$totalRevenue
        ]);
    } catch (Exception $e) {
        Response::error('Failed to fetch stats: ' . $e->getMessage(), null, 500);
    }
}

function handleGetUsers($db) {
    try {
        $query = "
            SELECT 
                u.id,
                u.email,
                u.full_name,
                u.avatar,
                u.role,
                u.status,
                u.created_at,
                COUNT(DISTINCT p.id) as total_sales
            FROM users u
            LEFT JOIN products p ON u.id = p.seller_id AND p.status = 'sold'
            WHERE u.status != 'deleted'
            GROUP BY u.id, u.email, u.full_name, u.avatar, u.role, u.status, u.created_at
            ORDER BY u.created_at DESC
            LIMIT 50
        ";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Cast numeric fields
        foreach ($users as &$user) {
            $user['total_sales'] = (int)$user['total_sales'];
        }
        
        Response::success('Users retrieved successfully', $users);
    } catch (Exception $e) {
        error_log('Admin users error: ' . $e->getMessage());
        Response::error('Failed to fetch users: ' . $e->getMessage(), null, 500);
    }
}

function handleGetProducts($db) {
    try {
        $query = "
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.price,
                p.status,
                p.views_count as views,
                p.created_at,
                u.full_name as seller_name,
                GROUP_CONCAT(pi.image_url ORDER BY pi.display_order) as images
            FROM products p
            LEFT JOIN users u ON p.seller_id = u.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.status != 'deleted'
            GROUP BY p.id, p.title, p.slug, p.price, p.status, p.views_count, p.created_at, u.full_name
            ORDER BY p.created_at DESC
            LIMIT 50
        ";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Parse images array
        foreach ($products as &$product) {
            $product['images'] = $product['images'] ? explode(',', $product['images']) : [];
            $product['views'] = (int)$product['views'];
            $product['price'] = (float)$product['price'];
        }
        
        Response::success('Products retrieved successfully', $products);
    } catch (Exception $e) {
        error_log('Admin products error: ' . $e->getMessage());
        Response::error('Failed to fetch products: ' . $e->getMessage(), null, 500);
    }
}

function handleGetOrders($db) {
    try {
        // Check if orders table exists
        $checkTable = $db->query("SHOW TABLES LIKE 'orders'");
        if ($checkTable->rowCount() == 0) {
            // Table doesn't exist, return empty array
            Response::success('No orders found', []);
            return;
        }
        
        $query = "
            SELECT 
                o.id,
                o.order_code,
                o.total_amount,
                o.status,
                o.created_at,
                buyer.full_name as buyer_name,
                seller.full_name as seller_name,
                GROUP_CONCAT(DISTINCT p.title SEPARATOR ', ') as product_title
            FROM orders o
            LEFT JOIN users buyer ON o.buyer_id = buyer.id
            LEFT JOIN users seller ON o.seller_id = seller.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            GROUP BY o.id, o.order_code, o.total_amount, o.status, o.created_at, buyer.full_name, seller.full_name
            ORDER BY o.created_at DESC
            LIMIT 50
        ";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Cast numeric fields
        foreach ($orders as &$order) {
            $order['total_amount'] = (float)$order['total_amount'];
        }
        
        Response::success('Orders retrieved successfully', $orders);
    } catch (Exception $e) {
        error_log('Admin orders error: ' . $e->getMessage());
        // Return empty array instead of error to avoid blocking UI
        Response::success([]);
    }
}

function handleUserAction($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        Response::error('Method not allowed', null, 405);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['user_id'] ?? null;
    $action = $data['action'] ?? null;
    
    if (!$userId || !$action) {
        Response::error('Missing required fields', null, 400);
        return;
    }
    
    try {
        switch ($action) {
            case 'ban':
                $stmt = $db->prepare("UPDATE users SET status = 'suspended' WHERE id = ?");
                $stmt->execute([$userId]);
                Response::success(['message' => 'User banned successfully']);
                break;
            
            case 'unban':
                $stmt = $db->prepare("UPDATE users SET status = 'active' WHERE id = ?");
                $stmt->execute([$userId]);
                Response::success(['message' => 'User unbanned successfully']);
                break;
            
            case 'delete':
                $stmt = $db->prepare("UPDATE users SET status = 'deleted' WHERE id = ?");
                $stmt->execute([$userId]);
                Response::success(['message' => 'User deleted successfully']);
                break;
            
            default:
                Response::error('Invalid action', null, 400);
        }
    } catch (Exception $e) {
        Response::error('Failed to update user: ' . $e->getMessage(), null, 500);
    }
}

function handleProductAction($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        Response::error('Method not allowed', null, 405);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data['product_id'] ?? null;
    $action = $data['action'] ?? null;
    
    if (!$productId || !$action) {
        Response::error('Missing required fields', null, 400);
        return;
    }
    
    try {
        switch ($action) {
            case 'approve':
                $stmt = $db->prepare("UPDATE products SET status = 'approved' WHERE id = ?");
                $stmt->execute([$productId]);
                Response::success(['message' => 'Product approved successfully']);
                break;
            
            case 'reject':
                $stmt = $db->prepare("UPDATE products SET status = 'rejected' WHERE id = ?");
                $stmt->execute([$productId]);
                Response::success(['message' => 'Product rejected successfully']);
                break;
            
            case 'delete':
                $stmt = $db->prepare("UPDATE products SET status = 'deleted' WHERE id = ?");
                $stmt->execute([$productId]);
                Response::success(['message' => 'Product deleted successfully']);
                break;
            
            default:
                Response::error('Invalid action', null, 400);
        }
    } catch (Exception $e) {
        Response::error('Failed to update product: ' . $e->getMessage(), null, 500);
    }
}
