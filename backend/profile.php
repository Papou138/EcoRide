<?php
require_once 'database.php';

header('Content-Type: application/json');

// Vérification de la disponibilité de l'email
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'checkEmail') {
    $email = $_GET['email'];
    
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM Utilisateur WHERE email = ?");
        $stmt->execute([$email]);
        $result = $stmt->fetch();
        
        echo json_encode([
            'disponible' => ($result['count'] == 0)
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'error' => 'Erreur lors de la vérification de l\'email',
            'disponible' => false
        ]);
    }
}

// Mise à jour du profil utilisateur
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'updateUser') {
    $userId = $_POST['id'];
    $email = $_POST['email'];
    
    try {
        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM Utilisateur WHERE email = ? AND id != ?");
        $stmt->execute([$email, $userId]);
        $result = $stmt->fetch();
        
        if ($result['count'] > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Cet email est déjà utilisé'
            ]);
            exit;
        }
        
        // Mise à jour des informations utilisateur
        $stmt = $pdo->prepare("UPDATE Utilisateur SET nom = ?, prenom = ?, email = ?, role = ? WHERE id = ?");
        $stmt->execute([$_POST['nom'], $_POST['prenom'], $email, $_POST['role'], $userId]);
        
        // Mise à jour des informations véhicule si présentes
        if (isset($_POST['vehicule'])) {
            $vehicule = json_decode($_POST['vehicule'], true);
            if ($vehicule) {
                $stmt = $pdo->prepare("INSERT INTO Vehicule (user_id, plaque, date_immat, modele, places, preferences) 
                                     VALUES (?, ?, ?, ?, ?, ?) 
                                     ON DUPLICATE KEY UPDATE 
                                     plaque = VALUES(plaque),
                                     date_immat = VALUES(date_immat),
                                     modele = VALUES(modele),
                                     places = VALUES(places),
                                     preferences = VALUES(preferences)");
                
                $stmt->execute([
                    $userId,
                    $vehicule['plaque'],
                    $vehicule['dateImmat'],
                    $vehicule['modele'],
                    $vehicule['places'],
                    json_encode($vehicule['preferences'])
                ]);
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Profil mis à jour avec succès'
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de la mise à jour du profil'
        ]);
    }
}
?>