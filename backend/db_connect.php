<?php
$config = require_once __DIR__ . '/../config/database.php';

try{
    $pdo= new Pdo("mysql:host={$config['host']};dbname={$config['dbname']}", $config['user'], $config['password']);
    $pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo -> setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    //Eviter d'afficher le message de connexion en production
    if($_SERVER['SERVER_NAME']==='localhost'){
        echo "Connexion BDD réussie\n";
    }
}catch(PDOException $e){
    die("Echec de connexion à la BDD : " . $e->getMessage()) . "\n";
}
?>
