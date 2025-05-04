<?php
require_once '../../config/database.php';
require_once '../../backend/voyage.php';

header('Content-Type: application/json');
session_start();

// Vérification de la session et du token CSRF
if (!isset($_SESSION['user_id']) || !isset($_SERVER['HTTP_X_CSRF_TOKEN']) || $_SERVER['HTTP_X_CSRF_TOKEN'] !== $_SESSION['csrf_token']) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Non autorisé']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $tripId = filter_var($data['tripId'] ?? null, FILTER_VALIDATE_INT);

    if (!$tripId) {
        throw new Exception('ID de voyage invalide');
    }

    $trip = new Trip($db);
    $success = $trip->cancelTrip($tripId, $_SESSION['user_id']);

    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Impossible d\'annuler le voyage');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}