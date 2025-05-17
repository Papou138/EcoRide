/**
 * Configuration principale
 */
const CONFIG = {
  API_URL: "../../backend", // URL de l'API
  MIN_PASSWORD_LENGTH: 8,
};

/**
 * Messages d'erreur standardisés
 */
const MESSAGES = {
  CHAMPS_OBLIGATOIRES: "Tous les champs sont obligatoires",
  EMAIL_INVALIDE: "Veuillez entrer un email valide",
  PASSWORD_COURT: "Le mot de passe doit contenir au moins 8 caractères",
  CONNEXION_ERREUR: "Erreur de connexion. Vérifiez vos identifiants.",
  COMPTE_CREE: "Compte créé avec succès !",
  PROFIL_MAJ: "Profil mis à jour avec succès !",
};

/**
 * Fonction de connexion LOGIN
 */
export async function login(event) {
  event.preventDefault();

  // Récupération des valeurs du formulaire
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;

  try {
    // Préparation des données
    const formData = new FormData();
    formData.append("action", "login");
    formData.append("email", email);
    formData.append("password", password);
    formData.append("remember", remember);

    // Envoi de la requête
    const response = await fetch(`${CONFIG.API_URL}/auth.php`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || MESSAGES.CONNEXION_ERREUR);
    }

    // Stockage du token
    if (remember) {
      localStorage.setItem("token", data.token);
    } else {
      sessionStorage.setItem("token", data.token);
    }

    // Redirection selon le rôle
    redirigerUtilisateur(data.role);
  } catch (error) {
    afficherErreur("email-error", error.message);
  }
}

/**
 * Fonction de création d'utilisateur
 */
export function createUser(nom, prenom, email, password) {
  // Validation basique
  if (!nom || !prenom || !email || !password) {
    alert(MESSAGES.CHAMPS_OBLIGATOIRES);
    return;
  }

  if (password.length < CONFIG.MIN_PASSWORD_LENGTH) {
    alert(MESSAGES.PASSWORD_COURT);
    return;
  }

  // Envoi des données
  const formData = new FormData();
  formData.append("action", "createUser");
  formData.append("nom", nom);
  formData.append("prenom", prenom);
  formData.append("email", email);
  formData.append("password", password);

  // Appel API
  fetch(`${CONFIG.API_URL}/user.php`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      alert(MESSAGES.COMPTE_CREE);
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Erreur : " + error.message);
    });
}

/**
 * Fonction de déconnexion
 */
export function logout() {
  // Suppression des tokens
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");

  // Redirection vers la page de connexion
  window.location.href = "login.html";
}

/**
 * Fonctions utilitaires
 */
function afficherErreur(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function redirigerUtilisateur(role) {
  const routes = {
    ADMIN: "admin.html",
    EMPLOYEE: "employee.html",
    USER: "user-profile.html",
  };

  window.location.href = routes[role] || "index.html";
}

/**
 * Initialisation des événements
 */
document.addEventListener("DOMContentLoaded", () => {
  // Gestion du bouton de visibilité du mot de passe
  const togglePassword = document.getElementById("toggle-password");
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePassword.innerHTML = `<i class="fas fa-eye${
        type === "password" ? "" : "-slash"
      }"></i>`;
    });
  }

  // Gestion du bouton de déconnexion
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
});
