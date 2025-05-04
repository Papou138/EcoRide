<?php
require_once '../../config/database.php';
require_once '../../backend/voyage.php';

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Non autorisé']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$tripId = $data['tripId'] ?? null;

if (!$tripId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID du voyage manquant']);
    exit;
}

try {
    $trip = new Trip($db);
    $result = $trip->cancelTrip($tripId, $_SESSION['user_id']);
    
    echo json_encode([
        'success' => $result,
        'message' => $result ? 'Voyage annulé avec succès' : 'Échec de l\'annulation'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur']);
}