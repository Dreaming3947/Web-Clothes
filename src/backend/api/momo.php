<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../utils/Auth.php';
require_once '../utils/Response.php';

class MoMoPayment {
    private $conn;
    
    // MoMo Test Environment Credentials
    private $partnerCode = 'YOUR_PARTNER_CODE';
    private $accessKey = 'YOUR_ACCESS_KEY';
    private $secretKey = 'YOUR_SECRET_KEY';
    private $endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Execute POST request to MoMo API
     */
    private function execPostRequest($url, $data) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data))
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        
        $result = curl_exec($ch);
        
        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);
            error_log("cURL Error: " . $error);
            throw new Exception("cURL Error: " . $error);
        }
        
        curl_close($ch);
        
        return $result;
    }
    
    /**
     * Create MoMo payment request
     */
    public function createPayment($orderData) {
        try {
            // Generate unique order ID
            $orderId = time() . "_" . uniqid();
            $requestId = time() . "";
            $amount = (string)$orderData['amount'];
            $orderInfo = $orderData['orderInfo'] ?? "Thanh toán đơn hàng";
            
            // Callback URLs - adjust to your domain
            $redirectUrl = "http://localhost:3000/payment-result";
            $ipnUrl = BASE_URL . "/api/momo-callback.php";
            
            $extraData = json_encode([
                'user_id' => $orderData['user_id'],
                'order_id' => $orderData['order_id'] ?? null,
                'order_code' => $orderData['order_code'] ?? null,
                'order_items' => $orderData['items'],
                'shipping_info' => $orderData['shipping_info']
            ]);
            
            $requestType = "captureWallet"; // or "payWithATM" for ATM payment
            
            // Create signature
            $rawHash = "accessKey=" . $this->accessKey . 
                      "&amount=" . $amount . 
                      "&extraData=" . $extraData . 
                      "&ipnUrl=" . $ipnUrl . 
                      "&orderId=" . $orderId . 
                      "&orderInfo=" . $orderInfo . 
                      "&partnerCode=" . $this->partnerCode . 
                      "&redirectUrl=" . $redirectUrl . 
                      "&requestId=" . $requestId . 
                      "&requestType=" . $requestType;
            
            $signature = hash_hmac("sha256", $rawHash, $this->secretKey);
            
            $data = array(
                'partnerCode' => $this->partnerCode,
                'partnerName' => "ForHerShop",
                'storeId' => "ForHerShop",
                'requestId' => $requestId,
                'amount' => $amount,
                'orderId' => $orderId,
                'orderInfo' => $orderInfo,
                'redirectUrl' => $redirectUrl,
                'ipnUrl' => $ipnUrl,
                'lang' => 'vi',
                'extraData' => $extraData,
                'requestType' => $requestType,
                'signature' => $signature
            );
            
            // Call MoMo API
            $result = $this->execPostRequest($this->endpoint, json_encode($data));
            $jsonResult = json_decode($result, true);
            
            // Debug log
            error_log("MoMo Request Data: " . json_encode($data));
            error_log("MoMo Response: " . $result);
            
            // Save payment request to database
            $this->savePaymentRequest($orderId, $requestId, $amount, $extraData, 'pending');
            
            if (isset($jsonResult['payUrl'])) {
                return Response::success('Payment URL created successfully', [
                    'payUrl' => $jsonResult['payUrl'],
                    'orderId' => $orderId,
                    'requestId' => $requestId,
                    'message' => $jsonResult['message'] ?? 'Success'
                ]);
            } else {
                error_log("MoMo Error: " . ($jsonResult['message'] ?? 'Unknown error'));
                return Response::error($jsonResult['message'] ?? 'Failed to create payment URL', 400);
            }
            
        } catch (Exception $e) {
            return Response::error('Payment creation failed: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * Save payment request to database
     */
    private function savePaymentRequest($orderId, $requestId, $amount, $extraData, $status) {
        $query = "INSERT INTO momo_payments 
                  (order_id, request_id, amount, extra_data, status, created_at) 
                  VALUES (:order_id, :request_id, :amount, :extra_data, :status, NOW())";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ':order_id' => $orderId,
            ':request_id' => $requestId,
            ':amount' => $amount,
            ':extra_data' => $extraData,
            ':status' => $status
        ]);
    }
    
    /**
     * Update payment status
     */
    public function updatePaymentStatus($orderId, $status, $transId = null, $responseData = null) {
        $query = "UPDATE momo_payments 
                  SET status = :status, trans_id = :trans_id, response_data = :response_data, updated_at = NOW() 
                  WHERE order_id = :order_id";
        
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            ':status' => $status,
            ':trans_id' => $transId,
            ':response_data' => $responseData,
            ':order_id' => $orderId
        ]);
    }
    
    /**
     * Get payment info
     */
    public function getPaymentInfo($orderId) {
        $query = "SELECT * FROM momo_payments WHERE order_id = :order_id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':order_id' => $orderId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * Verify MoMo callback signature
     */
    public function verifyCallback($data) {
        $rawHash = "accessKey=" . $this->accessKey .
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
        
        $signature = hash_hmac("sha256", $rawHash, $this->secretKey);
        
        return $signature === $data['signature'];
    }
}

// Main execution
$database = new Database();
$db = $database->getConnection();
$momo = new MoMoPayment($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Create payment request
        $userData = Auth::getCurrentUser();
        if (!$userData) {
            echo Response::error('Unauthorized', 401);
            exit;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Debug log
        error_log("MoMo Payment Data: " . print_r($data, true));
        
        if (!isset($data['amount']) || $data['amount'] <= 0) {
            error_log("Invalid amount: " . ($data['amount'] ?? 'not set'));
            echo Response::error('Invalid amount: ' . ($data['amount'] ?? 'not set'), 400);
            exit;
        }
        
        $orderData = [
            'user_id' => $userData['user_id'],
            'amount' => $data['amount'],
            'orderInfo' => $data['orderInfo'] ?? 'Thanh toán đơn hàng',
            'items' => $data['items'] ?? [],
            'shipping_info' => $data['shipping_info'] ?? []
        ];
        
        echo $momo->createPayment($orderData);
        break;
        
    case 'GET':
        // Get payment status
        if (!isset($_GET['orderId'])) {
            echo Response::error('Order ID is required', 400);
            exit;
        }
        
        $paymentInfo = $momo->getPaymentInfo($_GET['orderId']);
        
        if ($paymentInfo) {
            echo Response::success('Payment info retrieved', $paymentInfo);
        } else {
            echo Response::error('Payment not found', 404);
        }
        break;
        
    default:
        echo Response::error('Method not allowed', 405);
        break;
}
