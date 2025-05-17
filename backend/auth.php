<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

/**
 * Fonction pour envoyer une réponse JSON
 */
function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

/**
 * Gestion de la connexion
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'login':
            handleLogin();
            break;
        default:
            sendResponse(false, 'Action non reconnue');
    }
}

/**
 * Fonction de gestion de la connexion
 */
function handleLogin() {
    global $pdo;

    // Vérification des données requises
    if (!isset($_POST['email'], $_POST['password'])) {
        sendResponse(false, 'Email et mot de passe requis');
        return;
    }

    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    try {
        // Recherche de l'utilisateur
        $stmt = $pdo->prepare("SELECT id, nom, prenom, email, password, role FROM Utilisateur WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        // Vérification de l'existence de l'utilisateur et du mot de passe
        if (!$user || !password_verify($password, $user['password'])) {
            sendResponse(false, 'Identifiants incorrects');
            return;
        }

        // Création du token JWT
        $token = generateToken($user);

        // Envoi de la réponse
        sendResponse(true, 'Connexion réussie', [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'nom' => $user['nom'],
                'prenom' => $user['prenom'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);

    } catch (PDOException $e) {
        sendResponse(false, 'Erreur serveur : ' . $e->getMessage());
    }
}

/**
 * Fonction pour générer un token JWT
 */
function generateToken($user) {
    $secretKey = "votre_clé_secrète_à_changer"; // À remplacer par une vraie clé secrète
    $issuedAt = time();
    $expire = $issuedAt + 3600; // Expire dans 1 heure

    $payload = [
        'iat' => $issuedAt,
        'exp' => $expire,
        'user' => [
            'id' => $user['id'],
            'role' => $user['role']
        ]
    ];

    // Encodage du token
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', "$header.$payload", $secretKey, true);
    $signature = base64_encode($signature);

    return "$header.$payload.$signature";
}