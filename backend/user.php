<?php
include 'db_connect.php';

// Create (Créer un utilisateur)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'createUser') {
    $stmt = $pdo->prepare("INSERT INTO Utilisateur (nom, prenom, email, password) VALUES (?, ?, ?, ?)");
    $stmt->execute([$_POST['nom'], $_POST['prenom'], $_POST['email'], password_hash($_POST['password'], PASSWORD_DEFAULT)]);
    echo "Utilisateur créé avec succès";
    echo "\n"; // Ajout d'un saut de ligne
}

// Read (Lire tous les utilisateurs)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'getUsers') {
    $stmt = $pdo->query("SELECT * FROM Utilisateur");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
}

// Update (Mettre à jour un utilisateur)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'updateUser') {
    $stmt = $pdo->prepare("UPDATE Utilisateur SET nom = ?, prenom = ? WHERE id = ?");
    $stmt->execute([$_POST['nom'], $_POST['prenom'], $_POST['role'], $_POST['id']]);
    echo "Mise à jour utilisateur réussie";
    echo "\n"; // Ajout d'un saut de ligne
}

// Delete (Supprimer un utilisateur)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'deleteUser') {
    $stmt = $pdo->prepare("DELETE FROM Utilisateur WHERE id = ?");
    $stmt->execute([$_POST['id']]);
    echo "Suppression Utilisateur réussie";
    echo "\n"; // Ajout d'un saut de ligne
}
?>
