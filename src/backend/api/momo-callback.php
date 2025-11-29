<?php
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../utils/Response.php';

// Log callback data for debugging
$logFile = '../logs/momo_callback.log';
$logData = date('Y-m-d H:i:s') . " - " . file_get_contents("php://input") . "\n";
file_put_contents($logFile, $logData, FILE_APPEND);

// Get callback data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    $data = $_POST;
}

$database = new Database();
$db = $database->getConnection();

// MoMo credentials for signature verification
$partnerCode = 'MOMO4MUD20240115_TEST';
$accessKey = 'Ekj9og2VnRfOuIys';
$secretKey = 'PseUbm2s8QVJEbexsh8H3Jz2qa9tDqoa';

// Verify signature
$rawHash = "accessKey=" . $accessKey .
          "&amount=" . $data['amount'] .
          "&extraData=" . $data['extraData'] .
          "&message=" . $data['message'] .
          "&orderId=" . $data['orderId'] .
          "&orderInfo=" . $data['orderInfo'] .
          "&orderType=" . $data['orderType'] .
          "&partnerCode=" . $data['partnerCode'] .
          "&payType=" . $data['payType'] .
          "&requestId=" . $data['requestId'] .
          "&responseTime=" . $data['responseTime'] .
          "&resultCode=" . $data['resultCode'] .
          "&transId=" . $data['transId'];

$signature = hash_hmac("sha256", $rawHash, $secretKey);

if ($signature !== $data['signature']) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid signature']);
    exit;
}

// Process callback based on result code
$resultCode = $data['resultCode'];
$orderId = $data['orderId'];
$transId = $data['transId'];
$amount = $data['amount'];
$extraData = $data['extraData'];

try {
    // Update payment status
    $status = ($resultCode == 0) ? 'completed' : 'failed';
    
    $query = "UPDATE momo_payments 
              SET status = :status, 
                  trans_id = :trans_id, 
                  response_data = :response_data, 
                  updated_at = NOW() 
              WHERE order_id = :order_id";
    
    $stmt = $db->prepare($query);
    $responseData = json_encode($data);
    $stmt->execute([
        ':status' => $status,
        ':trans_id' => $transId,
        ':response_data' => $responseData,
        ':order_id' => $orderId
    ]);
    
    // If payment successful, update order payment status
    if ($resultCode == 0) {
        $extraDataDecoded = json_decode($extraData, true);
        
        // Cập nhật payment_status của order thành 'paid'
        if ($extraDataDecoded && isset($extraDataDecoded['order_id'])) {
            $systemOrderId = $extraDataDecoded['order_id'];
            
            $updateOrderQuery = "UPDATE orders 
                                SET payment_status = 'paid',
                                    payment_method = 'momo',
                                    updated_at = NOW()
                                WHERE id = :order_id";
            $updateStmt = $db->prepare($updateOrderQuery);
            $updateStmt->execute([':order_id' => $systemOrderId]);
            
            echo json_encode(['status' => 'success', 'message' => 'Payment confirmed, order updated']);
        } else {
            // Fallback: Tìm order theo order_code nếu có
            if (isset($extraDataDecoded['order_code'])) {
                $orderCode = $extraDataDecoded['order_code'];
                $updateOrderQuery = "UPDATE orders 
                                    SET payment_status = 'paid',
                                        payment_method = 'momo',
                                        updated_at = NOW()
                                    WHERE order_code = :order_code";
                $updateStmt = $db->prepare($updateOrderQuery);
                $updateStmt->execute([':order_code' => $orderCode]);
            }
            echo json_encode(['status' => 'success', 'message' => 'Payment confirmed']);
        }
    } else {
        echo json_encode(['status' => 'failed', 'resultCode' => $resultCode]);
    }
    
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
