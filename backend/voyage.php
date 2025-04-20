<?php
include 'db_connect.php';

// Create (Créer un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'createVoyage') {
    $stmt = $pdo->prepare("INSERT INTO Covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, nb_places, statut) VALUES (?, ?, ?, ?, ?, ?, ?, 'proposed')");
    $stmt->execute([$_POST['date'], $_POST['heure'], $_POST['depart'], $_POST['date'], $_POST['heure'], $_POST['arrivee'], $_POST['nbPlaces']]);
    echo "Trip created successfully";
}

// Read (Lire tous les voyages)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'getTrips') {
    $stmt = $pdo->query("SELECT * FROM Covoiturage");
    $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($trips);
}

// Update (Mettre à jour un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'updateVoyage') {
    $stmt = $pdo->prepare("UPDATE Covoiturage SET statut = ? WHERE id = ?");
    $stmt->execute([$_POST['statut'], $_POST['id']]);
    echo "Trip updated successfully";
}

// Delete (Supprimer un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'deleteVoyage') {
    $stmt = $pdo->prepare("DELETE FROM Covoiturage WHERE id = ?");
    $stmt->execute([$_POST['id']]);
    echo "Trip deleted successfully";
}

// Start Trip (Démarrer un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'startVoyage') {
    $stmt = $pdo->prepare("UPDATE Covoiturage SET statut = 'started' WHERE id = ?");
    $stmt->execute([$_POST['tripId']]);
    echo "Trip started successfully";
}

// Stop Trip (Arrêter un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'stopVoyage') {
    $stmt = $pdo->prepare("UPDATE Covoiturage SET statut = 'completed' WHERE id = ?");
    $stmt->execute([$_POST['tripId']]);
    echo "Trip stopped successfully";
}
?>
