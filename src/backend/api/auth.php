<?php
/**
 * Authentication API
 * Xử lý đăng ký, đăng nhập, đăng xuất
 */

// CORS Headers - must be first
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validation.php';
require_once __DIR__ . '/../utils/Auth.php';
require_once __DIR__ . '/../models/User.php';

$database = new Database();
$db = $database->getConnection();
$userModel = new User($db);
$validator = new Validation();

$method = $_SERVER['REQUEST_METHOD'];
$request = json_decode(file_get_contents('php://input'), true);

// ============================================
// ĐĂNG KÝ
// ============================================
if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'register') {
    // Validate input
    $validator->required($request['email'] ?? '', 'email');
    $validator->email($request['email'] ?? '', 'email');
    $validator->required($request['password'] ?? '', 'password');
    $validator->minLength($request['password'] ?? '', PASSWORD_MIN_LENGTH, 'password');
    $validator->required($request['full_name'] ?? '', 'full_name');

    if ($validator->hasErrors()) {
        Response::validationError($validator->getErrors());
    }

    // Sanitize input
    $email = Validation::sanitizeEmail($request['email']);
    $fullName = Validation::sanitizeString($request['full_name']);
    $phone = Validation::sanitizeString($request['phone'] ?? '');
    $password = $request['password'];
    $role = isset($request['role']) && in_array($request['role'], ['buyer', 'seller']) 
            ? $request['role'] 
            : 'buyer';

    // Check if email exists
    if ($userModel->emailExists($email)) {
        Response::error(ERROR_MESSAGES['EMAIL_EXISTS'], null, 400);
    }

    // Create user
    $userId = $userModel->create([
        'email' => $email,
        'password' => $password,
        'full_name' => $fullName,
        'phone' => $phone,
        'role' => $role
    ]);

    if ($userId) {
        // Generate tokens
        $token = Auth::generateToken($userId, $email, $role, false);
        $refreshToken = Auth::generateRefreshToken($userId);

        Response::success(SUCCESS_MESSAGES['REGISTER_SUCCESS'], [
            'token' => $token,
            'refreshToken' => $refreshToken,
            'user' => [
                'id' => $userId,
                'email' => $email,
                'full_name' => $fullName,
                'role' => $role
            ]
        ], 201);
    } else {
        Response::serverError();
    }
}

// ============================================
// ĐĂNG NHẬP
// ============================================
else if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'login') {
    // Validate input
    $validator->required($request['email'] ?? '', 'email');
    $validator->email($request['email'] ?? '', 'email');
    $validator->required($request['password'] ?? '', 'password');

    if ($validator->hasErrors()) {
        Response::validationError($validator->getErrors());
    }

    $email = Validation::sanitizeEmail($request['email']);
    $password = $request['password'];

    // Get user
    $user = $userModel->getByEmail($email);

    if (!$user || !Auth::verifyPassword($password, $user['password_hash'])) {
        Response::error(ERROR_MESSAGES['INVALID_CREDENTIALS'], null, 401);
    }

    // Check if user is active
    if ($user['status'] !== 'active') {
        Response::error('Tài khoản đã bị khóa', null, 403);
    }

    // Update last login
    $userModel->updateLastLogin($user['id']);

    // Check if remember me
    $rememberMe = isset($request['rememberMe']) && $request['rememberMe'] === true;

    // Generate tokens
    $token = Auth::generateToken($user['id'], $user['email'], $user['role'], $rememberMe);
    $refreshToken = Auth::generateRefreshToken($user['id']);

    Response::success(SUCCESS_MESSAGES['LOGIN_SUCCESS'], [
        'token' => $token,
        'refreshToken' => $refreshToken,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'phone' => $user['phone'],
            'avatar' => $user['avatar'],
            'role' => $user['role']
        ]
    ]);
}

// ============================================
// LẤY THÔNG TIN USER HIỆN TẠI
// ============================================
else if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'me') {
    $currentUser = Auth::requireAuth();
    
    $user = $userModel->getById($currentUser['user_id']);
    
    if (!$user) {
        Response::notFound('Không tìm thấy người dùng');
    }

    // Get statistics
    $stats = $userModel->getStatistics($user['id']);

    Response::success('Success', [
        'user' => $user,
        'statistics' => $stats
    ]);
}

// ============================================
// FORGOT PASSWORD
// ============================================
else if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'forgot-password') {
    $validator->required($request['email'] ?? '', 'email');
    $validator->email($request['email'] ?? '', 'email');

    if ($validator->hasErrors()) {
        Response::validationError($validator->getErrors());
    }

    $email = Validation::sanitizeEmail($request['email']);

    $token = $userModel->setPasswordResetToken($email);

    if ($token) {
        // TODO: Send email with reset link
        // For now, just return success
        Response::success('Email khôi phục mật khẩu đã được gửi', [
            'reset_token' => $token // In production, this should be sent via email only
        ]);
    } else {
        Response::error('Email không tồn tại trong hệ thống', null, 404);
    }
}

// ============================================
// RESET PASSWORD
// ============================================
else if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'reset-password') {
    $validator->required($request['token'] ?? '', 'token');
    $validator->required($request['password'] ?? '', 'password');
    $validator->minLength($request['password'] ?? '', PASSWORD_MIN_LENGTH, 'password');

    if ($validator->hasErrors()) {
        Response::validationError($validator->getErrors());
    }

    $token = $request['token'];
    $newPassword = $request['password'];

    if ($userModel->resetPassword($token, $newPassword)) {
        Response::success('Đặt lại mật khẩu thành công');
    } else {
        Response::error('Token không hợp lệ hoặc đã hết hạn', null, 400);
    }
}

// ============================================
// CHANGE PASSWORD
// ============================================
else if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'change-password') {
    $currentUser = Auth::requireAuth();

    $validator->required($request['current_password'] ?? '', 'current_password');
    $validator->required($request['new_password'] ?? '', 'new_password');
    $validator->minLength($request['new_password'] ?? '', PASSWORD_MIN_LENGTH, 'new_password');

    if ($validator->hasErrors()) {
        Response::validationError($validator->getErrors());
    }

    // Verify current password
    $user = $userModel->getByEmail($currentUser['email']);
    
    if (!Auth::verifyPassword($request['current_password'], $user['password_hash'])) {
        Response::error('Mật khẩu hiện tại không đúng', null, 400);
    }

    if ($userModel->updatePassword($currentUser['user_id'], $request['new_password'])) {
        Response::success('Đổi mật khẩu thành công');
    } else {
        Response::serverError();
    }
}

// ============================================
// VERIFY EMAIL
// ============================================
else if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'verify-email') {
    $validator->required($request['token'] ?? '', 'token');

    if ($validator->hasErrors()) {
        Response::validationError($validator->getErrors());
    }

    if ($userModel->verifyEmail($request['token'])) {
        Response::success('Xác thực email thành công');
    } else {
        Response::error('Token không hợp lệ', null, 400);
    }
}

// ============================================
// UPDATE PROFILE
// ============================================
else if ($method === 'PUT' && isset($_GET['action']) && $_GET['action'] === 'update-profile') {
    $currentUser = Auth::requireAuth();

    // Prepare update data
    $updateData = [];

    if (isset($request['full_name'])) {
        $validator->required($request['full_name'], 'full_name');
        if (!$validator->hasErrors()) {
            $updateData['full_name'] = Validation::sanitizeString($request['full_name']);
        }
    }

    if (isset($request['phone'])) {
        $updateData['phone'] = Validation::sanitizeString($request['phone']);
    }

    if (isset($request['avatar'])) {
        $updateData['avatar'] = Validation::sanitizeString($request['avatar']);
    }

    if (isset($request['bio'])) {
        $updateData['bio'] = Validation::sanitizeString($request['bio']);
    }

    if ($validator->hasErrors()) {
        Response::validationError($validator->getErrors());
    }

    if (empty($updateData)) {
        Response::error('Không có dữ liệu để cập nhật', null, 400);
    }

    if ($userModel->update($currentUser['user_id'], $updateData)) {
        // Get updated user
        $updatedUser = $userModel->getById($currentUser['user_id']);
        
        Response::success('Cập nhật thông tin thành công', [
            'user' => [
                'id' => $updatedUser['id'],
                'email' => $updatedUser['email'],
                'full_name' => $updatedUser['full_name'],
                'phone' => $updatedUser['phone'],
                'avatar' => $updatedUser['avatar'],
                'role' => $updatedUser['role']
            ]
        ]);
    } else {
        Response::serverError('Cập nhật thất bại');
    }
}

// ============================================
// REFRESH TOKEN
// ============================================
else if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'refresh-token') {
    // Can use either refresh token or current token
    $refreshTokenValue = $request['refreshToken'] ?? null;
    
    if ($refreshTokenValue) {
        // Verify refresh token
        $tokenData = Auth::verifyRefreshToken($refreshTokenValue);
        
        if (!$tokenData) {
            Response::error('Refresh token không hợp lệ hoặc đã hết hạn', null, 401);
        }
        
        // Get user info
        $user = $userModel->getById($tokenData['user_id']);
        
        if (!$user || $user['status'] !== 'active') {
            Response::error('Người dùng không tồn tại hoặc đã bị khóa', null, 401);
        }
        
        // Generate new tokens
        $newToken = Auth::generateToken($user['id'], $user['email'], $user['role'], true);
        $newRefreshToken = Auth::generateRefreshToken($user['id']);
        
        Response::success('Token đã được làm mới', [
            'token' => $newToken,
            'refreshToken' => $newRefreshToken
        ]);
    } else {
        // Try to use current token
        $currentUser = Auth::requireAuth();
        
        if (!$currentUser) {
            Response::unauthorized('Token không hợp lệ');
        }
        
        // Get user info
        $user = $userModel->getById($currentUser['user_id']);
        
        if (!$user || $user['status'] !== 'active') {
            Response::error('Người dùng không tồn tại hoặc đã bị khóa', null, 401);
        }
        
        // Generate new tokens
        $newToken = Auth::generateToken($user['id'], $user['email'], $user['role'], true);
        $newRefreshToken = Auth::generateRefreshToken($user['id']);
        
        Response::success('Token đã được làm mới', [
            'token' => $newToken,
            'refreshToken' => $newRefreshToken
        ]);
    }
}

// ============================================
// LOGOUT
// ============================================
else if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'logout') {
    $currentUser = Auth::requireAuth();
    
    // In a production app, you would:
    // 1. Invalidate the refresh token in database
    // 2. Add token to blacklist
    // 3. Clear any server-side sessions
    
    // For now, we just return success
    // The client will remove tokens from localStorage
    
    Response::success('Đăng xuất thành công', [
        'message' => 'Phiên đăng nhập đã được kết thúc'
    ]);
}

else {
    Response::error('Invalid request', null, 400);
}
