<?php
require_once '../../config/database.php';
require_once '../../backend/voyage.php';

header('Content-Type: application/json');
session_start();

// Vérification de la session et du token CSRF
if (!isset($_SESSION['user_id']) || !isset($_SERVER['HTTP_X_CSRF_TOKEN']) || $_SERVER['HTTP_X_CSRF_TOKEN'] !== $_SESSION['csrf_token']) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

try {
    $trip = new Trip($db);
    $trips = $trip->getUserTrips($_SESSION['user_id']);
    echo json_encode($trips);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur']);
}