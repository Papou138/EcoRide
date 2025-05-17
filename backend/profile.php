<?php
<?php
require_once 'database.php';
require_once 'auth.php'; // Pour la vérification du token

header('Content-Type: application/json');

// Action checkEmail - Vérification de la disponibilité de l'email
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

// Action update User - Mise à jour du profil utilisateur
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
        
        echo json_encode([
          'success' => true,
          'message' => 'Profil mis à jour avec succès'
        ]);
      }catch (PDOException $e) {
        echo json_encode([
          'success' => false,
          'message' => 'Erreur lors de la mise à jour du profil'
        ]);
      }
}

/**
 * Fonction pour récupérer le profil utilisateur
 */
function getUserProfile($userId) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT id, nom, prenom, email, telephone FROM Utilisateur WHERE id = ?");
        $stmt->execute([$userId]);
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            sendResponse(false, 'Utilisateur non trouvé');
            return;
        }
        
        sendResponse(true, 'Profil récupéré avec succès', ['user' => $user]);
        
    } catch (PDOException $e) {
        sendResponse(false, 'Erreur serveur : ' . $e->getMessage());
    }
}

/**
 * Fonction pour mettre à jour le profil utilisateur
 */
function updateUserProfile($userId) {
    global $pdo;
    
    // Validation des données
    $nom = filter_var($_POST['nom'], FILTER_SANITIZE_STRING);
    $prenom = filter_var($_POST['prenom'], FILTER_SANITIZE_STRING);
    $telephone = filter_var($_POST['telephone'], FILTER_SANITIZE_STRING);
    
    if (empty($nom) || empty($prenom)) {
        sendResponse(false, 'Nom et prénom sont requis');
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            UPDATE Utilisateur 
            SET nom = ?, prenom = ?, telephone = ?
            WHERE id = ?
        ");
        
        $stmt->execute([$nom, $prenom, $telephone, $userId]);
        
        sendResponse(true, 'Profil mis à jour avec succès');
        
    } catch (PDOException $e) {
        sendResponse(false, 'Erreur serveur : ' . $e->getMessage());
    }
}

// Vérification du token et récupération de l'ID utilisateur
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    sendResponse(false, 'Token manquant');
    exit;
}

try {
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    $tokenData = verifyToken($token); // À implémenter dans auth.php
    $userId = $tokenData['user']['id'];
    
    // Routage des actions
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        getUserProfile($userId);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($_POST['action'] === 'update') {
            updateUserProfile($userId);
        } else {
            sendResponse(false, 'Action non reconnue');
        }
    }
    
} catch (Exception $e) {
    sendResponse(false, 'Token invalide');
}
?>