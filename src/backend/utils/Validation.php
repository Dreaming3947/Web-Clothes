<?php
/**
 * Validation Utility
 * Xử lý validation dữ liệu
 */

class Validation {
    private $errors = [];

    /**
     * Validate required field
     */
    public function required($value, $fieldName) {
        if (empty($value) && $value !== '0') {
            $this->errors[$fieldName] = "$fieldName là bắt buộc";
            return false;
        }
        return true;
    }

    /**
     * Validate email
     */
    public function email($value, $fieldName) {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$fieldName] = "$fieldName không hợp lệ";
            return false;
        }
        return true;
    }

    /**
     * Validate min length
     */
    public function minLength($value, $min, $fieldName) {
        if (strlen($value) < $min) {
            $this->errors[$fieldName] = "$fieldName phải có ít nhất $min ký tự";
            return false;
        }
        return true;
    }

    /**
     * Validate max length
     */
    public function maxLength($value, $max, $fieldName) {
        if (strlen($value) > $max) {
            $this->errors[$fieldName] = "$fieldName không được vượt quá $max ký tự";
            return false;
        }
        return true;
    }

    /**
     * Validate numeric
     */
    public function numeric($value, $fieldName) {
        if (!is_numeric($value)) {
            $this->errors[$fieldName] = "$fieldName phải là số";
            return false;
        }
        return true;
    }

    /**
     * Validate positive number
     */
    public function positive($value, $fieldName) {
        if ($value <= 0) {
            $this->errors[$fieldName] = "$fieldName phải lớn hơn 0";
            return false;
        }
        return true;
    }

    /**
     * Validate phone number (Vietnam format)
     */
    public function phone($value, $fieldName) {
        $pattern = '/^(0|\+84)[0-9]{9,10}$/';
        if (!preg_match($pattern, $value)) {
            $this->errors[$fieldName] = "$fieldName không hợp lệ";
            return false;
        }
        return true;
    }

    /**
     * Validate in array
     */
    public function inArray($value, $array, $fieldName) {
        if (!in_array($value, $array)) {
            $this->errors[$fieldName] = "$fieldName không hợp lệ";
            return false;
        }
        return true;
    }

    /**
     * Validate URL
     */
    public function url($value, $fieldName) {
        if (!filter_var($value, FILTER_VALIDATE_URL)) {
            $this->errors[$fieldName] = "$fieldName không hợp lệ";
            return false;
        }
        return true;
    }

    /**
     * Validate image file
     */
    public function image($file, $fieldName) {
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            $this->errors[$fieldName] = "Vui lòng chọn file hình ảnh";
            return false;
        }

        if ($file['size'] > MAX_FILE_SIZE) {
            $this->errors[$fieldName] = "File quá lớn. Kích thước tối đa " . (MAX_FILE_SIZE / 1024 / 1024) . "MB";
            return false;
        }

        if (!in_array($file['type'], ALLOWED_IMAGE_TYPES)) {
            $this->errors[$fieldName] = "Định dạng file không được hỗ trợ";
            return false;
        }

        return true;
    }

    /**
     * Get all errors
     */
    public function getErrors() {
        return $this->errors;
    }

    /**
     * Check if has errors
     */
    public function hasErrors() {
        return !empty($this->errors);
    }

    /**
     * Clear errors
     */
    public function clearErrors() {
        $this->errors = [];
    }

    /**
     * Sanitize string
     */
    public static function sanitizeString($value) {
        return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Sanitize email
     */
    public static function sanitizeEmail($value) {
        return filter_var(trim($value), FILTER_SANITIZE_EMAIL);
    }

    /**
     * Sanitize integer
     */
    public static function sanitizeInt($value) {
        return filter_var($value, FILTER_SANITIZE_NUMBER_INT);
    }

    /**
     * Sanitize float
     */
    public static function sanitizeFloat($value) {
        return filter_var($value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    }
}
