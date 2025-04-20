<?php
include 'db_connect.php';

// Create (Créer un utilisateur)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'createUser') {
    $stmt = $pdo->prepare("INSERT INTO Utilisateur (nom, prenom, email, password) VALUES (?, ?, ?, ?)");
    $stmt->execute([$_POST['nom'], $_POST['prenom'], $_POST['email'], $_POST['password']]);
    echo "User created successfully";
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
    $stmt->execute([$_POST['nom'], $_POST['prenom'], $_POST['id']]);
    echo "User updated successfully";
}

// Delete (Supprimer un utilisateur)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'deleteUser') {
    $stmt = $pdo->prepare("DELETE FROM Utilisateur WHERE id = ?");
    $stmt->execute([$_POST['id']]);
    echo "User deleted successfully";
}
?>
