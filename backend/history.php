<?php
<?php
require_once 'db_connect.php';
require_once 'auth.php';

header('Content-Type: application/json');

/**
 * Fonction pour obtenir l'historique des voyages d'un utilisateur
 */
function getUserHistory($userId) {
    global $pdo;
    
    try {
        // Récupération des voyages en tant que conducteur
        $stmtConducteur = $pdo->prepare("
            SELECT 
                v.*,
                COUNT(DISTINCT r.passager_id) as nombre_passagers,
                SUM(r.montant_total) as revenus_totaux
            FROM Voyage v
            LEFT JOIN Reservation r ON v.id = r.voyage_id
            WHERE v.conducteur_id = ? AND v.statut = 'COMPLETED'
            GROUP BY v.id
            ORDER BY v.date_depart DESC
        ");
        $stmtConducteur->execute([$userId]);
        $voyagesConducteur = $stmtConducteur->fetchAll(PDO::FETCH_ASSOC);

        // Récupération des voyages en tant que passager
        $stmtPassager = $pdo->prepare("
            SELECT 
                v.*,
                r.nombre_places,
                r.montant_total,
                u.nom as conducteur_nom,
                u.prenom as conducteur_prenom
            FROM Reservation r
            JOIN Voyage v ON r.voyage_id = v.id
            JOIN Utilisateur u ON v.conducteur_id = u.id
            WHERE r.passager_id = ? AND v.statut = 'COMPLETED'
            ORDER BY v.date_depart DESC
        ");
        $stmtPassager->execute([$userId]);
        $voyagesPassager = $stmtPassager->fetchAll(PDO::FETCH_ASSOC);

        // Calcul des statistiques
        $stats = calculateUserStats($userId);

        sendResponse(true, 'Historique récupéré avec succès', [
            'voyages_conducteur' => $voyagesConducteur,
            'voyages_passager' => $voyagesPassager,
            'statistiques' => $stats
        ]);
        
    } catch (PDOException $e) {
        sendResponse(false, 'Erreur lors de la récupération de l\'historique: ' . $e->getMessage());
    }
}

/**
 * Fonction pour calculer les statistiques de l'utilisateur
 */
function calculateUserStats($userId) {
    global $pdo;
    
    try {
        // Statistiques en tant que conducteur
        $stmtConducteur = $pdo->prepare("
            SELECT 
                COUNT(DISTINCT v.id) as total_voyages,
                SUM(DISTINCT r.nombre_places) as total_passagers,
                SUM(r.montant_total) as revenus_totaux,
                AVG(n.note) as note_moyenne
            FROM Voyage v
            LEFT JOIN Reservation r ON v.id = r.voyage_id
            LEFT JOIN Note n ON v.id = n.voyage_id
            WHERE v.conducteur_id = ? AND v.statut = 'COMPLETED'
        ");
        $stmtConducteur->execute([$userId]);
        $statsConducteur = $stmtConducteur->fetch(PDO::FETCH_ASSOC);

        // Statistiques en tant que passager
        $stmtPassager = $pdo->prepare("
            SELECT 
                COUNT(DISTINCT r.voyage_id) as total_voyages,
                SUM(r.montant_total) as depenses_totales
            FROM Reservation r
            JOIN Voyage v ON r.voyage_id = v.id
            WHERE r.passager_id = ? AND v.statut = 'COMPLETED'
        ");
        $stmtPassager->execute([$userId]);
        $statsPassager = $stmtPassager->fetch(PDO::FETCH_ASSOC);

        // Calcul de l'impact environnemental (simulation)
        $impactCO2 = calculateEnvironmentalImpact($userId);

        return [
            'conducteur' => $statsConducteur,
            'passager' => $statsPassager,
            'impact_environnemental' => $impactCO2
        ];
        
    } catch (PDOException $e) {
        return null;
    }
}

/**
 * Fonction pour calculer l'impact environnemental
 */
function calculateEnvironmentalImpact($userId) {
    // Simulation simple - à adapter selon vos besoins
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                SUM(v.distance_km) as total_km
            FROM Voyage v
            LEFT JOIN Reservation r ON v.id = r.voyage_id
            WHERE (v.conducteur_id = ? OR r.passager_id = ?) 
            AND v.statut = 'COMPLETED'
        ");
        $stmt->execute([$userId, $userId]);
        $result = $stmt->fetch();
        
        // Calcul simplifié des émissions évitées (en kg de CO2)
        $kmParcourus = $result['total_km'] ?? 0;
        $emissionsEvitees = $kmParcourus * 0.12; // 120g CO2/km en moyenne
        
        return [
            'km_parcourus' => $kmParcourus,
            'emissions_evitees' => $emissionsEvitees
        ];
        
    } catch (PDOException $e) {
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
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        getUserHistory($userId);
    } else {
        sendResponse(false, 'Méthode non autorisée');
    }
    
} catch (Exception $e) {
    sendResponse(false, 'Token invalide');
}
?>