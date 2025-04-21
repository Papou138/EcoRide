<?php
try {
    // Remplace 'root' et '' par les informations de connexion appropriées si nécessaire
    $pdo = new PDO('mysql:host=localhost;dbname=ecoride', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connexion BDD réussie";
    echo "\n"; // Ajout d'un saut de ligne
} catch (PDOException $e) {
    die("Echec de connexion à la BDD : " . $e->getMessage());
}
?>
