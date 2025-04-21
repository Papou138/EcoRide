<?php
include 'db_connect.php';

// Create (Créer un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'createVoyage') {
    $stmt = $pdo->prepare("INSERT INTO Covoiturage (lieu_depart, lieu_arrivee, date_depart, heure_depart, prix_personne, nb_places, statut) VALUES (?, ?, ?, ?, ?, ?, 'proposed')");
    $stmt->execute([
      $_POST['lieu_depart'],
      $_POST['lieu_arrivee'],
      $_POST['date_depart'],
      $_POST['heure_depart'],
      $_POST['prix_personne'],
      $_POST['nb_places']
  ]);
    echo "Voyage crée avec succès";
    echo "\n"; // Ajout d'un saut de ligne
}

// Read (Lire tous les voyages)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'getVoyages') {
    $stmt = $pdo->query("SELECT * FROM Covoiturage");
    $lesVoyages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($lesVoyages);
}

// Update (Mettre à jour un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'updateVoyage') {
    $stmt = $pdo->prepare("UPDATE Covoiturage SET statut = ? WHERE id = ?");
    $stmt->execute([$_POST['statut'], $_POST['id']]);
    echo "Mise à jour voyage réussie";
    echo "\n"; // Ajout d'un saut de ligne
}

// Delete (Supprimer un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'deleteVoyage') {
    $stmt = $pdo->prepare("DELETE FROM Covoiturage WHERE id = ?");
    $stmt->execute([$_POST['id']]);
    echo "Suppression voyage réussie";
    echo "\n"; // Ajout d'un saut de ligne
}

// Start Trip (Démarrer un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'startVoyage') {
    $stmt = $pdo->prepare("UPDATE Covoiturage SET statut = 'started' WHERE id = ?");
    $stmt->execute([$_POST['tripId']]);
    echo "Démarrage du voyage réussi";
    echo "\n"; // Ajout d'un saut de ligne
}

// Stop Trip (Arrêter un voyage)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'stopVoyage') {
    $stmt = $pdo->prepare("UPDATE Covoiturage SET statut = 'completed' WHERE id = ?");
    $stmt->execute([$_POST['tripId']]);
    echo "Arrêt du voyage réussi";
    echo "\n"; // Ajout d'un saut de ligne
}
?>
