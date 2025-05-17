<?php
<?php
require_once 'db_connect.php';
require_once 'auth.php';

header('Content-Type: application/json');

/**
 * Fonction pour créer un nouveau voyage
 */
function createVoyage($userId) {
    global $pdo;
    
    // Validation des données
    $depart = filter_var($_POST['depart'], FILTER_SANITIZE_STRING);
    $arrivee = filter_var($_POST['arrivee'], FILTER_SANITIZE_STRING);
    $date_depart = filter_var($_POST['date_depart'], FILTER_SANITIZE_STRING);
    $places_disponibles = filter_var($_POST['places_disponibles'], FILTER_SANITIZE_NUMBER_INT);
    $prix = filter_var($_POST['prix'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    
    // Validation des données
    $depart = filter_var($_POST['lieu_depart'], FILTER_SANITIZE_STRING);
    $arrivee = filter_var($_POST['lieu_arrivee'], FILTER_SANITIZE_STRING);
    $date = filter_var($_POST['date_depart'], FILTER_SANITIZE_STRING);
    $heure = filter_var($_POST['heure_depart'], FILTER_SANITIZE_STRING);
    $prix = filter_var($_POST['prix_personne'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $places = filter_var($_POST['nb_places'], FILTER_SANITIZE_NUMBER_INT);

    try {
        $stmt = $pdo->prepare("
            INSERT INTO Voyage (conducteur_id, lieu_depart, lieu_arrivee, date_depart, places_disponibles, prix, statut)
            VALUES (?, ?, ?, ?, ?, ?, 'PROPOSED')
        ");
        
        $stmt->execute([$userId, $depart, $arrivee, $date, $heure, $prix, $places]);
        
        sendResponse(true, 'Voyage créé avec succès', ['voyage_id' => $pdo->lastInsertId()]);
        
    } catch (PDOException $e) {
        sendResponse(false, 'Erreur lors de la création du voyage : ' . $e->getMessage());
    }
}

/**
 * Fonction pour démarrer un voyage
 */
function startVoyage($tripId, $userId) {
    global $pdo;
    
    try {
        // Vérifier que l'utilisateur est bien le conducteur
        $stmt = $pdo->prepare("
            SELECT conducteur_id FROM Voyage 
            WHERE id = ? AND statut = 'PROPOSED'
        ");
        $stmt->execute([$tripId]);
        $voyage = $stmt->fetch();
        
        if (!$voyage || $voyage['conducteur_id'] != $userId) {
            sendResponse(false, 'Voyage non trouvé ou non autorisé');
            return;
        }
        
        // Mettre à jour le statut
        $stmt = $pdo->prepare("UPDATE Voyage SET statut = 'STARTED' WHERE id = ?");
        $stmt->execute([$tripId]);
        
        sendResponse(true, 'Voyage démarré avec succès');
        
    } catch (PDOException $e) {
        sendResponse(false, 'Erreur : ' . $e->getMessage());
    }
}

/**
 * Fonction pour terminer un voyage
 */
function stopVoyage($tripId, $userId) {
    global $pdo;
    
    try {
        // Vérifier que l'utilisateur est bien le conducteur
        $stmt = $pdo->prepare("
            SELECT conducteur_id FROM Voyage 
            WHERE id = ? AND statut = 'STARTED'
        ");
        $stmt->execute([$tripId]);
        $voyage = $stmt->fetch();
        
        if (!$voyage || $voyage['conducteur_id'] != $userId) {
            sendResponse(false, 'Voyage non trouvé ou non autorisé');
            return;
        }
        
        // Mettre à jour le statut
        $stmt = $pdo->prepare("UPDATE Voyage SET statut = 'COMPLETED' WHERE id = ?");
        $stmt->execute([$tripId]);
        
        sendResponse(true, 'Voyage terminé avec succès');
        
    } catch (PDOException $e) {
        sendResponse(false, 'Erreur : ' . $e->getMessage());
    }
}

/**
 * Fonction pour annuler un voyage
 */
function annulVoyage($tripId, $userId) {
    global $pdo;
    
    try {
        // Vérifier que l'utilisateur est bien le conducteur
        $stmt = $pdo->prepare("
            SELECT conducteur_id FROM Voyage 
            WHERE id = ? AND statut IN ('PROPOSED', 'STARTED')
        ");
        $stmt->execute([$tripId]);
        $voyage = $stmt->fetch();
        
        if (!$voyage || $voyage['conducteur_id'] != $userId) {
            sendResponse(false, 'Voyage non trouvé ou non autorisé');
            return;
        }
        
        $pdo->beginTransaction();
        
        // Annuler le voyage
        $stmt = $pdo->prepare("UPDATE Voyage SET statut = 'CANCELLED' WHERE id = ?");
        $stmt->execute([$tripId]);
        
        // Notifier les passagers (à implémenter)
        // TODO: Ajouter la logique de notification
        
        $pdo->commit();
        sendResponse(true, 'Voyage annulé avec succès');
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        sendResponse(false, 'Erreur : ' . $e->getMessage());
    }
}

// Vérification du token et routage des actions
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    sendResponse(false, 'Token manquant');
    exit;
}

try {
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    $tokenData = verifyToken($token);
    $userId = $tokenData['user']['id'];
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        switch ($_POST['action']) {
            case 'createVoyage':
                createVoyage($userId);
                break;
            case 'startVoyage':
                startVoyage($_POST['tripId'], $userId);
                break;
            case 'stopVoyage':
                stopVoyage($_POST['tripId'], $userId);
                break;
            case 'annulVoyage':
                annulVoyage($_POST['tripId'], $userId);
                break;
            default:
                sendResponse(false, 'Action non reconnue');
        }
    }
    
} catch (Exception $e) {
    sendResponse(false, 'Token invalide');
}

/**
 * Fonction pour rechercher des voyages
 */
function searchVoyages() {
    global $pdo;
    
    $depart = isset($_GET['depart']) ? $_GET['depart'] : '';
    $arrivee = isset($_GET['arrivee']) ? $_GET['arrivee'] : '';
    $date = isset($_GET['date']) ? $_GET['date'] : '';
    
    try {
        $sql = "
            SELECT v.*, u.nom, u.prenom 
            FROM Voyage v
            JOIN Utilisateur u ON v.conducteur_id = u.id
            WHERE v.statut = 'actif'
        ";
        $params = [];
        
        if (!empty($depart)) {
            $sql .= " AND v.lieu_depart LIKE ?";
            $params[] = "%$depart%";
        }
        if (!empty($arrivee)) {
            $sql .= " AND v.lieu_arrivee LIKE ?";
            $params[] = "%$arrivee%";
        }
        if (!empty($date)) {
            $sql .= " AND DATE(v.date_depart) = ?";
            $params[] = $date;
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        $voyages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(true, 'Voyages trouvés', ['voyages' => $voyages]);
        
    } catch (PDOException $e) {
        sendResponse(false, 'Erreur lors de la recherche: ' . $e->getMessage());
    }
}

/**
 * Fonction pour réserver un voyage
 */
function reserverVoyage($userId) {
    global $pdo;
    
    $voyage_id = filter_var($_POST['voyage_id'], FILTER_SANITIZE_NUMBER_INT);
    $places = filter_var($_POST['places'], FILTER_SANITIZE_NUMBER_INT);
    
    try {
        $pdo->beginTransaction();
        
        // Vérifier les places disponibles
        $stmt = $pdo->prepare("
            SELECT places_disponibles 
            FROM Voyage 
            WHERE id = ? AND statut = 'actif'
            FOR UPDATE
        ");
        $stmt->execute([$voyage_id]);
        $voyage = $stmt->fetch();
        
        if (!$voyage || $voyage['places_disponibles'] < $places) {
            $pdo->rollBack();
            sendResponse(false, 'Places non disponibles');
            return;
        }
        
        // Créer la réservation
        $stmt = $pdo->prepare("
            INSERT INTO Reservation (voyage_id, passager_id, nombre_places, statut)
            VALUES (?, ?, ?, 'confirmé')
        ");
        $stmt->execute([$voyage_id, $userId, $places]);
        
        // Mettre à jour les places disponibles
        $stmt = $pdo->prepare("
            UPDATE Voyage 
            SET places_disponibles = places_disponibles - ?
            WHERE id = ?
        ");
        $stmt->execute([$places, $voyage_id]);
        
        $pdo->commit();
        sendResponse(true, 'Réservation effectuée avec succès');
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        sendResponse(false, 'Erreur lors de la réservation: ' . $e->getMessage());
    }
}

// Vérification du token
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    sendResponse(false, 'Token manquant');
    exit;
}

try {
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    $tokenData = verifyToken($token);
    $userId = $tokenData['user']['id'];
    
    // Routage des actions
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        searchVoyages();
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        switch ($_POST['action']) {
            case 'create':
                createVoyage($userId);
                break;
            case 'reserver':
                reserverVoyage($userId);
                break;
            default:
                sendResponse(false, 'Action non reconnue');
        }
    }
    
} catch (Exception $e) {
    sendResponse(false, 'Token invalide');
}
?>