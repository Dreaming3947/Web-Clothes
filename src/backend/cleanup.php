<?php
/**
 * Cleanup Cron Job
 * Chạy định kỳ để dọn dẹp expired tokens và sessions
 * 
 * Thêm vào crontab:
 * 0 2 * * * php /path/to/cleanup.php
 * (Chạy lúc 2AM mỗi ngày)
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/SessionManager.php';

$database = new Database();
$db = $database->getConnection();
$sessionManager = new SessionManager($db);

echo "[" . date('Y-m-d H:i:s') . "] Starting cleanup...\n";

try {
    // Clean up expired tokens and sessions
    $sessionManager->cleanupExpiredTokens();
    
    echo "[" . date('Y-m-d H:i:s') . "] Cleanup completed successfully\n";
} catch (Exception $e) {
    echo "[" . date('Y-m-d H:i:s') . "] Cleanup failed: " . $e->getMessage() . "\n";
}
