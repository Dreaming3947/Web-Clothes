<?php
/**
 * Session Manager
 * Quản lý sessions và refresh tokens trong database
 */

class SessionManager {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Store refresh token in database
     */
    public function storeRefreshToken($userId, $token, $expiresAt) {
        $query = "INSERT INTO refresh_tokens 
                  (user_id, token, device_info, ip_address, user_agent, expires_at)
                  VALUES (:user_id, :token, :device_info, :ip_address, :user_agent, :expires_at)";
        
        $stmt = $this->db->prepare($query);
        
        $deviceInfo = $this->getDeviceInfo();
        $ipAddress = $this->getClientIp();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':device_info', $deviceInfo);
        $stmt->bindParam(':ip_address', $ipAddress);
        $stmt->bindParam(':user_agent', $userAgent);
        $stmt->bindParam(':expires_at', $expiresAt);
        
        return $stmt->execute();
    }

    /**
     * Verify refresh token from database
     */
    public function verifyRefreshToken($token) {
        $query = "SELECT rt.*, u.email, u.role 
                  FROM refresh_tokens rt
                  JOIN users u ON rt.user_id = u.id
                  WHERE rt.token = :token 
                  AND rt.expires_at > NOW()
                  AND rt.is_revoked = FALSE
                  AND u.status = 'active'
                  LIMIT 1";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            // Update last used
            $this->updateTokenLastUsed($token);
        }
        
        return $result;
    }

    /**
     * Revoke refresh token
     */
    public function revokeRefreshToken($token) {
        $query = "UPDATE refresh_tokens 
                  SET is_revoked = TRUE 
                  WHERE token = :token";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':token', $token);
        
        return $stmt->execute();
    }

    /**
     * Revoke all user tokens (logout from all devices)
     */
    public function revokeAllUserTokens($userId) {
        $query = "UPDATE refresh_tokens 
                  SET is_revoked = TRUE 
                  WHERE user_id = :user_id";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        
        return $stmt->execute();
    }

    /**
     * Create user session
     */
    public function createSession($userId, $sessionToken, $expiresAt) {
        $query = "INSERT INTO user_sessions 
                  (user_id, session_token, device_name, device_type, browser, ip_address, expires_at)
                  VALUES (:user_id, :session_token, :device_name, :device_type, :browser, :ip_address, :expires_at)";
        
        $stmt = $this->db->prepare($query);
        
        $deviceInfo = $this->parseUserAgent();
        $ipAddress = $this->getClientIp();
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':session_token', $sessionToken);
        $stmt->bindParam(':device_name', $deviceInfo['device']);
        $stmt->bindParam(':device_type', $deviceInfo['type']);
        $stmt->bindParam(':browser', $deviceInfo['browser']);
        $stmt->bindParam(':ip_address', $ipAddress);
        $stmt->bindParam(':expires_at', $expiresAt);
        
        return $stmt->execute();
    }

    /**
     * Get active sessions for user
     */
    public function getActiveSessions($userId) {
        $query = "SELECT * FROM user_sessions 
                  WHERE user_id = :user_id 
                  AND is_active = TRUE 
                  AND expires_at > NOW()
                  ORDER BY last_activity DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Terminate session
     */
    public function terminateSession($sessionId, $userId) {
        $query = "UPDATE user_sessions 
                  SET is_active = FALSE 
                  WHERE id = :session_id 
                  AND user_id = :user_id";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':session_id', $sessionId);
        $stmt->bindParam(':user_id', $userId);
        
        return $stmt->execute();
    }

    /**
     * Log session activity
     */
    public function logSessionActivity($userId, $action, $success = true, $errorMessage = null) {
        $query = "INSERT INTO session_logs 
                  (user_id, action, ip_address, user_agent, device_info, success, error_message)
                  VALUES (:user_id, :action, :ip_address, :user_agent, :device_info, :success, :error_message)";
        
        $stmt = $this->db->prepare($query);
        
        $ipAddress = $this->getClientIp();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        $deviceInfo = $this->getDeviceInfo();
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':action', $action);
        $stmt->bindParam(':ip_address', $ipAddress);
        $stmt->bindParam(':user_agent', $userAgent);
        $stmt->bindParam(':device_info', $deviceInfo);
        $stmt->bindParam(':success', $success, PDO::PARAM_BOOL);
        $stmt->bindParam(':error_message', $errorMessage);
        
        return $stmt->execute();
    }

    /**
     * Get session logs for user
     */
    public function getSessionLogs($userId, $limit = 20) {
        $query = "SELECT * FROM session_logs 
                  WHERE user_id = :user_id 
                  ORDER BY created_at DESC 
                  LIMIT :limit";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Clean up expired tokens
     */
    public function cleanupExpiredTokens() {
        $queries = [
            "DELETE FROM refresh_tokens WHERE expires_at < NOW() OR is_revoked = TRUE",
            "UPDATE user_sessions SET is_active = FALSE WHERE expires_at < NOW()",
            "DELETE FROM session_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)"
        ];
        
        foreach ($queries as $query) {
            $stmt = $this->db->prepare($query);
            $stmt->execute();
        }
        
        return true;
    }

    /**
     * Update token last used timestamp
     */
    private function updateTokenLastUsed($token) {
        $query = "UPDATE refresh_tokens 
                  SET last_used_at = CURRENT_TIMESTAMP 
                  WHERE token = :token";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
    }

    /**
     * Get client IP address
     */
    private function getClientIp() {
        $ipKeys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 
                   'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (isset($_SERVER[$key]) && filter_var($_SERVER[$key], FILTER_VALIDATE_IP)) {
                return $_SERVER[$key];
            }
        }
        
        return 'unknown';
    }

    /**
     * Get device info
     */
    private function getDeviceInfo() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        $parsed = $this->parseUserAgent();
        
        return $parsed['browser'] . ' on ' . $parsed['device'];
    }

    /**
     * Parse user agent
     */
    private function parseUserAgent() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        
        $browser = 'Unknown';
        $device = 'Unknown';
        $type = 'desktop';
        
        // Detect browser
        if (strpos($userAgent, 'Chrome') !== false) $browser = 'Chrome';
        elseif (strpos($userAgent, 'Firefox') !== false) $browser = 'Firefox';
        elseif (strpos($userAgent, 'Safari') !== false) $browser = 'Safari';
        elseif (strpos($userAgent, 'Edge') !== false) $browser = 'Edge';
        elseif (strpos($userAgent, 'Opera') !== false) $browser = 'Opera';
        
        // Detect device
        if (strpos($userAgent, 'Mobile') !== false) {
            $type = 'mobile';
            $device = 'Mobile';
        } elseif (strpos($userAgent, 'Tablet') !== false || strpos($userAgent, 'iPad') !== false) {
            $type = 'tablet';
            $device = 'Tablet';
        } else {
            $device = 'Desktop';
        }
        
        return [
            'browser' => $browser,
            'device' => $device,
            'type' => $type
        ];
    }
}
