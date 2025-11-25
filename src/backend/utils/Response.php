<?php
/**
 * Response Utility
 * Xử lý và format các response trả về
 */

class Response {
    /**
     * Gửi JSON response
     */
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Success response
     */
    public static function success($message = 'Success', $data = null, $statusCode = 200) {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    /**
     * Created response (201)
     */
    public static function created($message = 'Created', $data = null) {
        self::success($message, $data, 201);
    }

    /**
     * Bad request response (400)
     */
    public static function badRequest($message = 'Bad Request', $errors = null) {
        self::error($message, $errors, 400);
    }

    /**
     * Method not allowed response (405)
     */
    public static function methodNotAllowed($message = 'Method Not Allowed') {
        self::error($message, null, 405);
    }

    /**
     * Error response
     */
    public static function error($message = 'Error', $errors = null, $statusCode = 400) {
        self::json([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], $statusCode);
    }

    /**
     * Paginated response
     */
    public static function paginated($data, $total, $page, $limit, $message = 'Success') {
        $totalPages = ceil($total / $limit);
        
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'pagination' => [
                'total' => (int)$total,
                'page' => (int)$page,
                'limit' => (int)$limit,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ]
        ], 200);
    }

    /**
     * Unauthorized response
     */
    public static function unauthorized($message = null) {
        self::error($message ?? ERROR_MESSAGES['UNAUTHORIZED'], null, 401);
    }

    /**
     * Forbidden response
     */
    public static function forbidden($message = null) {
        self::error($message ?? ERROR_MESSAGES['FORBIDDEN'], null, 403);
    }

    /**
     * Not found response
     */
    public static function notFound($message = null) {
        self::error($message ?? ERROR_MESSAGES['NOT_FOUND'], null, 404);
    }

    /**
     * Server error response
     */
    public static function serverError($message = null) {
        self::error($message ?? ERROR_MESSAGES['SERVER_ERROR'], null, 500);
    }

    /**
     * Validation error response
     */
    public static function validationError($errors, $message = null) {
        self::error($message ?? ERROR_MESSAGES['INVALID_INPUT'], $errors, 422);
    }
}
