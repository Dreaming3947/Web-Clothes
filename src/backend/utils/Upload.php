<?php
/**
 * Upload Utility
 * Xử lý upload file
 */

class Upload {
    /**
     * Upload single image
     */
    public static function uploadImage($file, $directory, $prefix = '') {
        // Validate file
        $validator = new Validation();
        if (!$validator->image($file, 'image')) {
            throw new Exception($validator->getErrors()['image']);
        }

        // Create directory if not exists
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $prefix . uniqid() . '_' . time() . '.' . $extension;
        $filepath = $directory . '/' . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Không thể tải file lên');
        }

        return $filename;
    }

    /**
     * Upload multiple images
     */
    public static function uploadMultipleImages($files, $directory, $prefix = '', $maxFiles = MAX_IMAGES_PER_PRODUCT) {
        $uploadedFiles = [];
        $errors = [];

        // Normalize files array
        $filesArray = self::normalizeFilesArray($files);

        if (count($filesArray) > $maxFiles) {
            throw new Exception("Chỉ được tải lên tối đa $maxFiles hình ảnh");
        }

        foreach ($filesArray as $index => $file) {
            try {
                $filename = self::uploadImage($file, $directory, $prefix);
                $uploadedFiles[] = $filename;
            } catch (Exception $e) {
                $errors[] = "File " . ($index + 1) . ": " . $e->getMessage();
            }
        }

        if (!empty($errors)) {
            // Delete uploaded files if there were errors
            foreach ($uploadedFiles as $file) {
                if (file_exists($directory . '/' . $file)) {
                    unlink($directory . '/' . $file);
                }
            }
            throw new Exception(implode(', ', $errors));
        }

        return $uploadedFiles;
    }

    /**
     * Create thumbnail
     */
    public static function createThumbnail($sourcePath, $thumbnailPath, $maxWidth = 300, $maxHeight = 300) {
        list($width, $height, $type) = getimagesize($sourcePath);

        // Calculate new dimensions
        $ratio = min($maxWidth / $width, $maxHeight / $height);
        $newWidth = (int)($width * $ratio);
        $newHeight = (int)($height * $ratio);

        // Create new image
        $thumbnail = imagecreatetruecolor($newWidth, $newHeight);

        // Handle different image types
        switch ($type) {
            case IMAGETYPE_JPEG:
                $source = imagecreatefromjpeg($sourcePath);
                break;
            case IMAGETYPE_PNG:
                $source = imagecreatefrompng($sourcePath);
                imagealphablending($thumbnail, false);
                imagesavealpha($thumbnail, true);
                break;
            case IMAGETYPE_GIF:
                $source = imagecreatefromgif($sourcePath);
                break;
            default:
                return false;
        }

        // Copy and resize
        imagecopyresampled($thumbnail, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        // Save thumbnail
        switch ($type) {
            case IMAGETYPE_JPEG:
                imagejpeg($thumbnail, $thumbnailPath, 85);
                break;
            case IMAGETYPE_PNG:
                imagepng($thumbnail, $thumbnailPath, 8);
                break;
            case IMAGETYPE_GIF:
                imagegif($thumbnail, $thumbnailPath);
                break;
        }

        // Free memory
        imagedestroy($source);
        imagedestroy($thumbnail);

        return true;
    }

    /**
     * Delete file
     */
    public static function deleteFile($filepath) {
        if (file_exists($filepath)) {
            return unlink($filepath);
        }
        return false;
    }

    /**
     * Normalize files array from $_FILES
     */
    private static function normalizeFilesArray($files) {
        $normalized = [];

        if (isset($files['name']) && is_array($files['name'])) {
            // Multiple files
            foreach ($files['name'] as $index => $name) {
                if (!empty($name)) {
                    $normalized[] = [
                        'name' => $files['name'][$index],
                        'type' => $files['type'][$index],
                        'tmp_name' => $files['tmp_name'][$index],
                        'error' => $files['error'][$index],
                        'size' => $files['size'][$index]
                    ];
                }
            }
        } else {
            // Single file
            if (!empty($files['name'])) {
                $normalized[] = $files;
            }
        }

        return $normalized;
    }
}
