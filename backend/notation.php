<?php
<?php
require_once 'db_connect.php';
require_once 'auth.php';

header('Content-Type: application/json');

/**
 * Fonction pour ajouter une note/avis
 */
function addNotation($userId) {
    global $pdo;
    
    // Validation des données
    $voyageId = filter_var($_POST['voyage_id'], FILTER_SANITIZE_NUMBER_INT);
    $note = filter_var($_POST['note'], FILTER_SANITIZE_NUMBER_INT);
    $commentaire = filter_var($_POST['commentaire'], FILTER_SANITIZE_STRING);
    
    try {
        // Vérifier si l'utilisateur a participé au voyage
        $stmt = $pdo->prepare("
            SELECT r.id, v.conducteur_id, v.date_depart 
            FROM Reservation r
            JOIN Voyage v ON r.voyage_id = v.id
            WHERE r.voyage_id = ? AND r.passager_id = ? AND v.statut = 'COMPLETED'
        ");
        $stmt->execute([$voyageId, $userId]);
        $reservation = $stmt->fetch();

        if (!$reservation) {
            throw new Exception('Vous ne pouvez noter que les voyages auxquels vous avez participé');
        }

        // Vérifier si l'utilisateur n'a pas déjà noté ce voyage
        $stmt = $pdo->prepare("
            SELECT id FROM Avis 
            WHERE voyage_id = ? AND utilisateur_id = ?
        ");
        $stmt->execute([$voyageId, $userId]);
        if ($stmt->fetch()) {
            throw new Exception('Vous avez déjà noté ce voyage');
        }

        // Insérer la note
        $stmt = $pdo->prepare("
            INSERT INTO Avis (voyage_id, utilisateur_id, note, commentaire, date_avis)
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$voyageId, $userId, $note, $commentaire]);
        
        // Mettre à jour la note moyenne du conducteur
        updateNoteMoyenneConducteur($reservation['conducteur_id']);
        
        sendResponse(true, 'Avis ajouté avec succès');
        
    } catch (Exception $e) {
        sendResponse(false, $e->getMessage());
    }
}

/**
 * Fonction pour récupérer les avis d'un conducteur
 */
function getNotationsConducteur($conducteurId) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                a.*,
                u.nom as evaluateur_nom,
                u.prenom as evaluateur_prenom,
                v.lieu_depart,
                v.lieu_arrivee,
                v.date_depart,
                v.prix
            FROM Avis a
            JOIN Voyage v ON a.voyage_id = v.id
            JOIN Utilisateur u ON a.utilisateur_id = u.id
            WHERE v.conducteur_id = ?
            ORDER BY a.date_avis DESC
        ");
        $stmt->execute([$conducteurId]);
        
        $notations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Récupérer les statistiques
        $stats = getStatistiquesConducteur($conducteurId);
        
        sendResponse(true, 'Avis récupérés avec succès', [
            'notations' => $notations,
            'stats' => $stats
        ]);
        
    } catch (Exception $e) {
        sendResponse(false, 'Erreur lors de la récupération des avis');
    }
}

/**
 * Fonction pour mettre à jour la note moyenne d'un conducteur
 */
function updateNoteMoyenneConducteur($conducteurId) {
    global $pdo;
    
    $stmt = $pdo->prepare("
        UPDATE Utilisateur u
        SET note_moyenne = (
            SELECT AVG(a.note)
            FROM Avis a
            JOIN Voyage v ON a.voyage_id = v.id
            WHERE v.conducteur_id = ?
        )
        WHERE u.id = ?
    ");
    $stmt->execute([$conducteurId, $conducteurId]);
}

/**
 * Fonction pour obtenir les statistiques d'un conducteur
 */
function getStatistiquesConducteur($conducteurId) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                COUNT(*) as total_avis,
                AVG(note) as note_moyenne,
                COUNT(CASE WHEN note >= 4 THEN 1 END) as avis_positifs
            FROM Avis a
            JOIN Voyage v ON a.voyage_id = v.id
            WHERE v.conducteur_id = ?
        ");
        $stmt->execute([$conducteurId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
        
    } catch (Exception $e) {
        return null;
    }
}

// Vérification du token et routage
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
        if ($_POST['action'] === 'noter') {
            ajouterNotation($userId);
        } else {
            sendResponse(false, 'Action non reconnue');
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $conducteurId = $_GET['conducteur_id'] ?? $userId;
        getNotationsConducteur($conducteurId);
    }
    
} catch (Exception $e) {
    sendResponse(false, 'Token invalide');
}
?>