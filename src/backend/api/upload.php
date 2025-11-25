<?php
/**
 * Upload API
 * Xử lý upload ảnh avatar và product images
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

$method = $_SERVER['REQUEST_METHOD'];

// ============================================
// POST - Upload Avatar
// ============================================
if ($method === 'POST' && isset($_GET['type']) && $_GET['type'] === 'avatar') {
    $currentUser = Auth::requireAuth();

    if (!isset($_FILES['avatar'])) {
        Response::error('Vui lòng chọn ảnh', null, 400);
    }

    try {
        // Upload directory (relative to public folder)
        $uploadDir = __DIR__ . '/../../../public/uploads/avatars/';
        
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $file = $_FILES['avatar'];
        $fileName = Upload::uploadSingleImage($file, $uploadDir, 'avatar_' . $currentUser['user_id'] . '_');

        // Return URL relative to public
        $avatarUrl = '/uploads/avatars/' . $fileName;

        Response::success('Upload ảnh thành công', [
            'url' => $avatarUrl,
            'filename' => $fileName
        ]);

    } catch (Exception $e) {
        Response::error($e->getMessage(), null, 400);
    }
}

// ============================================
// POST - Upload Product Images
// ============================================
else if ($method === 'POST' && isset($_GET['type']) && $_GET['type'] === 'product') {
    $currentUser = Auth::requireAuth();

    if (!isset($_FILES['images'])) {
        Response::error('Vui lòng chọn ít nhất 1 ảnh', null, 400);
    }

    try {
        // Upload directory
        $uploadDir = __DIR__ . '/../../../public/uploads/products/';
        
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Handle multiple files
        $uploadedFiles = Upload::uploadMultipleImages(
            $_FILES['images'], 
            $uploadDir, 
            'product_' . time() . '_'
        );

        // Convert to URLs
        $imageUrls = array_map(function($filename) {
            return '/uploads/products/' . $filename;
        }, $uploadedFiles);

        Response::success('Upload ảnh thành công', [
            'urls' => $imageUrls,
            'count' => count($imageUrls)
        ]);

    } catch (Exception $e) {
        Response::error($e->getMessage(), null, 400);
    }
}

else {
    Response::error('Invalid request', null, 400);
}
