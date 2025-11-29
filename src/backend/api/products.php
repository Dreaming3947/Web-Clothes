<?php
/**
 * Products API
 * Xử lý các API liên quan đến sản phẩm
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validation.php';
require_once __DIR__ . '/../utils/Auth.php';
require_once __DIR__ . '/../utils/Upload.php';
require_once __DIR__ . '/../models/Product.php';

$database = new Database();
$db = $database->getConnection();
$productModel = new Product($db);
$validator = new Validation();

$method = $_SERVER['REQUEST_METHOD'];

// ============================================
// GET - Get user favorites
// ============================================
if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'favorites') {
    $currentUser = Auth::requireAuth();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : PRODUCTS_PER_PAGE;

    error_log("Fetching favorites for user_id: " . $currentUser['user_id']);
    $result = $productModel->getUserFavorites($currentUser['user_id'], $page, $limit);
    error_log("Favorites count: " . count($result['data']) . ", Total: " . $result['total']);

    Response::paginated(
        $result['data'],
        $result['total'],
        $page,
        $limit,
        'Lấy danh sách yêu thích thành công'
    );
}

// ============================================
// GET - Get distinct brands
// ============================================
else if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'brands') {
    $brands = $productModel->getDistinctBrands();
    Response::success('Brands retrieved successfully', $brands);
}

// ============================================
// GET - Get product count by category
// ============================================
else if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'category-counts') {
    $categorySlugs = ['quan-ao-nu', 'quan-ao-nam', 'phu-kien', 'giay-dep'];
    $counts = [];
    
    foreach ($categorySlugs as $slug) {
        $counts[$slug] = $productModel->getCountByCategory($slug);
    }
    
    Response::success('Category counts retrieved successfully', $counts);
}

// ============================================
// GET - Lấy danh sách sản phẩm
// ============================================
else if ($method === 'GET' && !isset($_GET['id'])) {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : PRODUCTS_PER_PAGE;

    // Build filters
    $filters = [];
    
    if (isset($_GET['search'])) {
        $filters['search'] = Validation::sanitizeString($_GET['search']);
    }
    
    if (isset($_GET['category_id'])) {
        $filters['category_id'] = (int)$_GET['category_id'];
    }
    
    if (isset($_GET['min_price'])) {
        $filters['min_price'] = (float)$_GET['min_price'];
    }
    
    if (isset($_GET['max_price'])) {
        $filters['max_price'] = (float)$_GET['max_price'];
    }
    
    if (isset($_GET['condition'])) {
        $filters['condition'] = is_array($_GET['condition']) 
            ? $_GET['condition'] 
            : [$_GET['condition']];
    }
    
    if (isset($_GET['size'])) {
        $filters['size'] = is_array($_GET['size']) 
            ? $_GET['size'] 
            : [$_GET['size']];
    }
    
    if (isset($_GET['brand'])) {
        $filters['brand'] = is_array($_GET['brand']) 
            ? $_GET['brand'] 
            : [Validation::sanitizeString($_GET['brand'])];
    }
    
    if (isset($_GET['category'])) {
        $filters['category'] = is_array($_GET['category']) 
            ? $_GET['category'] 
            : [$_GET['category']];
    }
    
    if (isset($_GET['category_id'])) {
        $filters['category_id'] = (int)$_GET['category_id'];
    }
    
    if (isset($_GET['location_city'])) {
        $filters['location_city'] = Validation::sanitizeString($_GET['location_city']);
    }
    
    if (isset($_GET['seller_id'])) {
        $filters['seller_id'] = (int)$_GET['seller_id'];
    }
    
    if (isset($_GET['is_featured'])) {
        $filters['is_featured'] = true;
    }
    
    if (isset($_GET['sort'])) {
        $filters['sort'] = $_GET['sort'];
    }

    // Get current user if authenticated (optional)
    $currentUser = null;
    try {
        $currentUser = Auth::getCurrentUser($db);
    } catch (Exception $e) {
        // User not authenticated, continue without user context
    }
    $userId = $currentUser ? $currentUser['user_id'] : null;

    $result = $productModel->getAll($page, $limit, $filters, $userId);

    Response::paginated(
        $result['data'],
        $result['total'],
        $page,
        $limit,
        'Lấy danh sách sản phẩm thành công'
    );
}

// ============================================
// GET - Lấy chi tiết sản phẩm theo ID
// ============================================
else if ($method === 'GET' && isset($_GET['id'])) {
    $productId = (int)$_GET['id'];
    $incrementView = isset($_GET['increment_view']) && $_GET['increment_view'] === 'true';

    // Get current user if authenticated (optional)
    $currentUser = null;
    try {
        $currentUser = Auth::getCurrentUser($db);
    } catch (Exception $e) {
        // User not authenticated, continue without user context
    }
    $userId = $currentUser ? $currentUser['user_id'] : null;

    $product = $productModel->getById($productId, $incrementView, $userId);

    if (!$product) {
        Response::notFound('Không tìm thấy sản phẩm');
    }

    Response::success('Lấy thông tin sản phẩm thành công', $product);
}

// ============================================
// POST - Tạo sản phẩm mới
// ============================================
else if ($method === 'POST' && !isset($_GET['id'])) {
    $currentUser = Auth::requireAuth();

    // Get JSON data
    $request = json_decode(file_get_contents('php://input'), true);

    // Validate
    $validator->required($request['title'] ?? '', 'title');
    $validator->required($request['description'] ?? '', 'description');
    $validator->required($request['price'] ?? '', 'price');
    $validator->numeric($request['price'] ?? '', 'price');
    $validator->positive($request['price'] ?? 0, 'price');
    $validator->required($request['category_id'] ?? '', 'category_id');
    $validator->required($request['condition'] ?? '', 'condition');
    $validator->inArray($request['condition'] ?? '', ['new', 'like-new', 'good', 'fair', 'used', 'damaged', 'repaired'], 'condition');

    if ($validator->hasErrors()) {
        Response::validationError($validator->getErrors());
    }

    // Prepare data
    $productData = [
        'seller_id' => $currentUser['user_id'],
        'category_id' => (int)$request['category_id'],
        'title' => Validation::sanitizeString($request['title']),
        'description' => Validation::sanitizeString($request['description']),
        'price' => (float)$request['price'],
        'original_price' => isset($request['original_price']) ? (float)$request['original_price'] : (float)$request['price'],
        'condition' => $request['condition'],
        'condition_detail' => Validation::sanitizeString($request['condition_detail'] ?? ''),
        'size' => Validation::sanitizeString($request['size'] ?? ''),
        'brand' => Validation::sanitizeString($request['brand'] ?? ''),
        'color' => Validation::sanitizeString($request['color'] ?? ''),
        'material' => Validation::sanitizeString($request['material'] ?? ''),
        'location_city' => Validation::sanitizeString($request['location_city'] ?? 'TP.HCM'),
        'location_district' => Validation::sanitizeString($request['location_district'] ?? ''),
        'allow_negotiation' => isset($request['allow_negotiation']) ? (bool)$request['allow_negotiation'] : true,
        'min_acceptable_price' => isset($request['min_acceptable_price']) ? (float)$request['min_acceptable_price'] : null,
        'specifications' => $request['specifications'] ?? [],
        'status' => 'pending', // Pending approval
        'shipping_methods' => $request['shipping_methods'] ?? [],
        'payment_methods' => $request['payment_methods'] ?? []
    ];

    // Create product
    $productId = $productModel->create($productData);

    if ($productId) {
        // Add images if provided
        if (!empty($request['images']) && is_array($request['images'])) {
            $productModel->addImages($productId, $request['images'], 0);
        }

        // Add tags if provided
        if (!empty($request['tags']) && is_array($request['tags'])) {
            $productModel->addTags($productId, $request['tags']);
        }

        Response::success(SUCCESS_MESSAGES['CREATED'], [
            'id' => $productId
        ], 201);
    } else {
        Response::serverError();
    }
}

// ============================================
// POST - Upload images
// ============================================
else if ($method === 'POST' && isset($_GET['id']) && isset($_GET['action']) && $_GET['action'] === 'upload-images') {
    $currentUser = Auth::requireAuth();
    $productId = (int)$_GET['id'];

    // Check if product exists and belongs to user
    $product = $productModel->getById($productId);
    
    if (!$product) {
        Response::notFound('Không tìm thấy sản phẩm');
    }

    if ($product['seller_id'] != $currentUser['user_id']) {
        Response::forbidden('Bạn không có quyền upload ảnh cho sản phẩm này');
    }

    if (!isset($_FILES['images'])) {
        Response::error('Vui lòng chọn ít nhất 1 hình ảnh', null, 400);
    }

    try {
        $uploadedImages = Upload::uploadMultipleImages(
            $_FILES['images'],
            PRODUCT_IMAGES_PATH,
            'product_'
        );

        // Add images to database
        $imageUrls = array_map(function($filename) {
            return UPLOAD_URL . '/products/' . $filename;
        }, $uploadedImages);

        $productModel->addImages($productId, $imageUrls);

        Response::success('Upload hình ảnh thành công', [
            'images' => $imageUrls
        ]);

    } catch (Exception $e) {
        Response::error($e->getMessage(), null, 400);
    }
}

// ============================================
// PUT - Cập nhật sản phẩm
// ============================================
else if ($method === 'PUT' && isset($_GET['id'])) {
    $currentUser = Auth::requireAuth();
    $productId = (int)$_GET['id'];

    // Get JSON data
    $request = json_decode(file_get_contents('php://input'), true);

    // Check if product exists and belongs to user
    $product = $productModel->getById($productId);
    
    if (!$product) {
        Response::notFound('Không tìm thấy sản phẩm');
    }

    if ($product['seller_id'] != $currentUser['user_id'] && $currentUser['role'] !== 'admin') {
        Response::forbidden('Bạn không có quyền chỉnh sửa sản phẩm này');
    }

    // Prepare update data
    $updateData = [
        'title' => Validation::sanitizeString($request['title']),
        'description' => Validation::sanitizeString($request['description']),
        'price' => (float)$request['price'],
        'original_price' => isset($request['original_price']) ? (float)$request['original_price'] : (float)$request['price'],
        'category_id' => (int)$request['category_id'],
        'condition' => $request['condition'],
        'condition_detail' => Validation::sanitizeString($request['condition_detail'] ?? ''),
        'size' => Validation::sanitizeString($request['size'] ?? ''),
        'brand' => Validation::sanitizeString($request['brand'] ?? ''),
        'color' => Validation::sanitizeString($request['color'] ?? ''),
        'material' => Validation::sanitizeString($request['material'] ?? ''),
        'allow_negotiation' => isset($request['allow_negotiation']) ? (bool)$request['allow_negotiation'] : true,
        'min_acceptable_price' => isset($request['min_acceptable_price']) ? (float)$request['min_acceptable_price'] : null,
        'specifications' => $request['specifications'] ?? [],
        'shipping_methods' => $request['shipping_methods'] ?? [],
        'payment_methods' => $request['payment_methods'] ?? []
    ];

    // Update product
    if ($productModel->update($productId, $updateData)) {
        // Update images if provided
        if (!empty($request['images']) && is_array($request['images'])) {
            // Delete old images
            $productModel->deleteImages($productId);
            // Add new images
            $productModel->addImages($productId, $request['images'], 0);
        }

        Response::success(SUCCESS_MESSAGES['UPDATED']);
    } else {
        Response::serverError();
    }
}

// ============================================
// DELETE - Xóa sản phẩm
// ============================================
else if ($method === 'DELETE' && isset($_GET['id'])) {
    $currentUser = Auth::requireAuth();
    $productId = (int)$_GET['id'];

    // Check if product exists and belongs to user
    $product = $productModel->getById($productId);
    
    if (!$product) {
        Response::notFound('Không tìm thấy sản phẩm');
    }

    if ($product['seller_id'] != $currentUser['user_id'] && $currentUser['role'] !== 'admin') {
        Response::forbidden('Bạn không có quyền xóa sản phẩm này');
    }

    if ($productModel->delete($productId)) {
        Response::success(SUCCESS_MESSAGES['DELETED']);
    } else {
        Response::serverError();
    }
}

// ============================================
// POST - Toggle favorite
// ============================================
else if ($method === 'POST' && isset($_GET['id']) && isset($_GET['action']) && $_GET['action'] === 'favorite') {
    $currentUser = Auth::requireAuth();
    $productId = (int)$_GET['id'];

    $result = $productModel->toggleFavorite($currentUser['user_id'], $productId);

    Response::success(
        $result['favorited'] ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích',
        $result
    );
}

// ============================================
// POST - Approve product (Admin only)
// ============================================
else if ($method === 'POST' && isset($_GET['id']) && isset($_GET['action']) && $_GET['action'] === 'approve') {
    $currentUser = Auth::requireRole(['admin', 'moderator']);
    $productId = (int)$_GET['id'];

    if ($productModel->approve($productId, $currentUser['user_id'])) {
        Response::success('Duyệt sản phẩm thành công');
    } else {
        Response::serverError();
    }
}

// ============================================
// POST - Reject product (Admin only)
// ============================================
else if ($method === 'POST' && isset($_GET['id']) && isset($_GET['action']) && $_GET['action'] === 'reject') {
    $currentUser = Auth::requireRole(['admin', 'moderator']);
    $productId = (int)$_GET['id'];
    
    $request = json_decode(file_get_contents('php://input'), true);
    $reason = Validation::sanitizeString($request['reason'] ?? '');

    if ($productModel->reject($productId, $reason)) {
        Response::success('Từ chối sản phẩm thành công');
    } else {
        Response::serverError();
    }
}

else {
    Response::error('Invalid request', null, 400);
}
