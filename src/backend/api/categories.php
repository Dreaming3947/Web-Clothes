<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../utils/Response.php';

$categoryModel = new Category();

try {
    // Only support GET requests for categories
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        
        // Get category by ID
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $category = $categoryModel->getById($id);
            
            if ($category) {
                Response::success('Category retrieved', $category);
            } else {
                Response::error('Category not found', 404);
            }
            exit;
        }
        
        // Get category by slug
        if (isset($_GET['slug'])) {
            $slug = $_GET['slug'];
            $category = $categoryModel->getBySlug($slug);
            
            if ($category) {
                Response::success('Category retrieved', $category);
            } else {
                Response::error('Category not found', 404);
            }
            exit;
        }
        
        // Get children of a parent category
        if (isset($_GET['parent_id'])) {
            $parentId = intval($_GET['parent_id']);
            $children = $categoryModel->getChildren($parentId);
            Response::success('Children categories retrieved', $children);
            exit;
        }
        
        // Get hierarchical categories (default)
        if (isset($_GET['hierarchical']) && $_GET['hierarchical'] === 'true') {
            $categories = $categoryModel->getHierarchical();
            Response::success('Hierarchical categories retrieved', $categories);
            exit;
        }
        
        // Get all categories (flat list)
        $includeChildren = !isset($_GET['parent_only']) || $_GET['parent_only'] !== 'true';
        $categories = $categoryModel->getAll($includeChildren);
        Response::success('Categories retrieved', $categories);
        exit;
    }
    
    Response::error('Method not allowed', 405);
    
} catch (Exception $e) {
    error_log("Error in categories.php: " . $e->getMessage());
    Response::error('Server error', 500);
}
