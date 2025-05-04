<?php
/**
 * Gestion des opérations CRUD pour les utilisateurs
 * CREATE, READ, UPDATE, DELETE
 */

require_once 'database.php';

// Configuration de l'en-tête pour le format JSON
header('Content-Type: application/json');

/**
 * Fonctions utilitaires
 */
function sendJsonResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}


/**
 * Gestion des requêtes
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    try {
        switch ($action) {
            case 'createUser':
                handleCreateUser();
                break;
            
            case 'getUser':
                handleGetUser();
                break;
            
            case 'updateUser':
                handleUpdateUser();
                break;
            
            case 'deleteUser':
                handleDeleteUser();
                break;
            
            default:
                sendJsonResponse(false, 'Action non reconnue');
        }
    } catch (PDOException $e) {
        sendJsonResponse(false, "Erreur base de données : " . $e->getMessage());
    } catch (Exception $e) {
sendJsonResponse(false, "Erreur : " . $e-> getMessage());
    }
}

/**
 * Fonctions de gestion des actions
 */

// CREATE - Création d'un utilisateur
function handleCreateUser() {
    global $pdo;

    if (!isset($_POST['nom'], $_POST['prenom'], $_POST['email'], $_POST['password'])) {
        sendJsonResponse(false, "Données manquantes");
    }

    $stmt = $pdo->prepare("INSERT INTO Utilisateur (nom, prenom, email, password) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $_POST['nom'],
        $_POST['prenom'],
        $_POST['email'],
        password_hash($_POST['password'], PASSWORD_DEFAULT)
    ]);

    sendJsonResponse(true, 'Utilisateur créé avec succès');
}

// READ - Récupération des informations utilisateur
function hendleGetUser() {
    global $pdo;

    if (!isset($_POST['id'])) {
        sendJsonResponse(false, "ID utilisateurs manquant");
    }

    $userId = $_POST['id'];

    // Récupération des informations utilisateur
    $stmt = $pdo->prepare("SELECT * FROM Utilisateur WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        sendJsonResponse(false, "Utilisateur non trouvé");
    }

    // Récupération des informations véhicules si nécessaire
    $vehicule = null;
    if ($user['role'] === "chauffeur" || $user['role'] === "les_deux") {
        $stmt = $pdo->prepare("SELECT * FROM Vehicule WHERE user_id = ?");
        $stmt->execute([$userId]);
        $vehicule = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    sendJsonResponse(true, "Données récupérées avec succès", ['user' => $user, 'vehicule' => $vehicule]);
}

// UPDATE - Mise à jour des informations utilisateur
function handleUpdateUser() {
    global $pdo;
    
    if (!isset($_POST['id'], $_POST['nom'], $_POST['prenom'], $_POST['role'])) {
        sendJsonResponse(false, 'Données manquantes');
    }

    // Mise à jour des informations de base
    $stmt = $pdo->prepare("UPDATE Utilisateur SET nom = ?, prenom = ?, role = ? WHERE id = ?");
    $stmt->execute([
        $_POST['nom'],
        $_POST['prenom'],
        $_POST['role'],
        $_POST['id']
    ]);

    // Gestion des informations véhicule
    if (isset($_POST['vehicule'])) {
        $vehicule = json_decode($_POST['vehicule'], true);
        
        if (!empty($vehicule)) {
            $stmt = $pdo->prepare("
                INSERT INTO Vehicule (user_id, plaque, date_immat, modele, places, preferences) 
                VALUES (?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                    plaque = VALUES(plaque),
                    date_immat = VALUES(date_immat),
                    modele = VALUES(modele),
                    places = VALUES(places),
                    preferences = VALUES(preferences)
            ");

            $stmt->execute([
                $_POST['id'],
                $vehicule['plaque'],
                $vehicule['dateImmat'],
                $vehicule['modele'],
                $vehicule['places'],
                json_encode($vehicule['preferences'])
            ]);
        }
    }

    sendJsonResponse(true, 'Utilisateur mis à jour avec succès');
}

// DELETE - Suppression d'un utilisateur
function handleDeleteUser() {
    global $pdo;
    
    if (!isset($_POST['id'])) {
        sendJsonResponse(false, 'ID utilisateur manquant');
    }

    $stmt = $pdo->prepare("DELETE FROM Utilisateur WHERE id = ?");
    $stmt->execute([$_POST['id']]);

    sendJsonResponse(true, 'Utilisateur supprimé avec succès');
}
?>
