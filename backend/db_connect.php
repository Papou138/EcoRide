<?php
try {
    // Remplace 'root' et '' par les informations de connexion appropriées si nécessaire
    $pdo = new PDO('mysql:host=localhost;dbname=ecoride', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully"; // Ligne pour vérifier la connexion
} catch (PDOException $e) {
    die("Connection failed : " . $e->getMessage());
}
?>
