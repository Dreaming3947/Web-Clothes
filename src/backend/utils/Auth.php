<?php
/**
 * Authentication Utility
 * Xử lý xác thực và JWT
 */

require_once __DIR__ . '/../config/constants.php';

class Auth {
    /**
     * Generate JWT token
     */
    public static function generateToken($userId, $email, $role, $rememberMe = false) {
        $expiration = $rememberMe ? (30 * 24 * 60 * 60) : JWT_EXPIRATION; // 30 days or 7 days
        
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => JWT_ALGORITHM
        ]);

        $payload = json_encode([
            'user_id' => $userId,
            'email' => $email,
            'role' => $role,
            'iat' => time(),
            'exp' => time() + $expiration
        ]);

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payload);

        $signature = hash_hmac(
            'sha256',
            $base64UrlHeader . "." . $base64UrlPayload,
            JWT_SECRET,
            true
        );
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Generate refresh token
     */
    public static function generateRefreshToken($userId) {
        $token = self::generateRandomToken(64);
        $expiry = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        // Store refresh token in database (you need to create this table)
        // For now, we'll encode it in a JWT-like format for simplicity
        $data = json_encode([
            'user_id' => $userId,
            'token' => $token,
            'exp' => strtotime('+30 days')
        ]);
        
        return self::base64UrlEncode($data);
    }

    /**
     * Verify refresh token
     */
    public static function verifyRefreshToken($refreshToken) {
        try {
            $data = json_decode(self::base64UrlDecode($refreshToken), true);
            
            if (!$data || !isset($data['user_id']) || !isset($data['exp'])) {
                return false;
            }
            
            if ($data['exp'] < time()) {
                return false; // Token expired
            }
            
            return $data;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Verify JWT token
     */
    public static function verifyToken($token) {
        if (empty($token)) {
            return false;
        }

        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            return false;
        }

        list($header, $payload, $signature) = $tokenParts;

        $expectedSignature = hash_hmac(
            'sha256',
            $header . "." . $payload,
            JWT_SECRET,
            true
        );
        $expectedBase64UrlSignature = self::base64UrlEncode($expectedSignature);

        if ($signature !== $expectedBase64UrlSignature) {
            return false;
        }

        $payloadData = json_decode(self::base64UrlDecode($payload), true);

        if ($payloadData['exp'] < time()) {
            return false;
        }

        return $payloadData;
    }

    /**
     * Get current user from token
     */
    public static function getCurrentUser() {
        $headers = getallheaders();
        $token = null;

        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                $token = $matches[1];
            }
        }

        if (!$token) {
            return null;
        }

        return self::verifyToken($token);
    }

    /**
     * Require authentication
     */
    public static function requireAuth() {
        $user = self::getCurrentUser();
        if (!$user) {
            Response::unauthorized();
        }
        return $user;
    }

    /**
     * Require specific role
     */
    public static function requireRole($allowedRoles) {
        $user = self::requireAuth();
        
        if (!is_array($allowedRoles)) {
            $allowedRoles = [$allowedRoles];
        }

        if (!in_array($user['role'], $allowedRoles)) {
            Response::forbidden('Bạn không có quyền truy cập chức năng này');
        }

        return $user;
    }

    /**
     * Hash password
     */
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_HASH_ALGO, ['cost' => PASSWORD_HASH_COST]);
    }

    /**
     * Verify password
     */
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    /**
     * Generate random token
     */
    public static function generateRandomToken($length = 32) {
        return bin2hex(random_bytes($length));
    }

    /**
     * Base64 URL encode
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Base64 URL decode
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
