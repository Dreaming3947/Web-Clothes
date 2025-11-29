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

        $uploadDir = USER_AVATARS_PATH;
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $file = $_FILES['avatar'];
        $fileName = Upload::uploadSingleImage($file, $uploadDir, 'avatar_' . $currentUser['user_id'] . '_');
        // Return absolute URL
        $avatarUrl = UPLOAD_URL . '/avatars/' . $fileName;

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

    // Debug: Check what's in $_FILES
    error_log('FILES: ' . print_r($_FILES, true));

    if (empty($_FILES)) {
        Response::error('Không có file nào được gửi', null, 400);
    }

    // Check both 'images' and 'images[]' keys
    $filesKey = isset($_FILES['images']) ? 'images' : (isset($_FILES['images_']) ? 'images_' : null);
    
    if (!$filesKey) {
        Response::error('Vui lòng chọn ít nhất 1 ảnh. Keys available: ' . implode(', ', array_keys($_FILES)), null, 400);
    }


    try {
        $uploadDir = PRODUCT_IMAGES_PATH;
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $uploadedFiles = Upload::uploadMultipleImages(
            $_FILES[$filesKey],
            $uploadDir,
            'product_' . time() . '_'
        );
        $imageUrls = array_map(function($filename) {
            return UPLOAD_URL . '/products/' . $filename;
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
