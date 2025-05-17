import {
  togglePassword,
  initialiserFormValidation,
} from "./modules/form-validation.js";
import {
  createUser,
  updateUser,
  deleteUser,
  fetchUsers,
} from "./modules/auth.js";
import {
  createVoyage,
  startVoyage,
  stopVoyage,
  annulVoyage,
} from "./modules/voyage.js";
import { updateProfile, toggleChauffeurInfo } from "./modules/profile.js";
import { approveReview, rejectReview, resolveIssue } from "./modules/review.js";
import {
  createEmployeeAccount,
  suspendAccount,
} from "../js/modules/employee.js";
import { participer } from "./modules/participer.js";
import { initialiserMenu } from "./modules/menu.js";
import { initialiserRecherche } from "./modules/recherche.js";

// Constants pour les messages d'erreur
const ERROR_MESSAGES = {
  FETCH: "Une erreur est survenue lors de la communication avec le serveur.",
  VALIDATION: "Veuillez vérifier les informations saisies.",
  SERVER: "Le serveur est temporairement indisponible.",
  GENERIC: "Une erreur inattendue s'est produite.",
};

// Gestion globale des erreurs fetch avec style amélioré
function handleFetchError(error) {
  console.error("Erreur :", error);

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message visible";
  errorDiv.setAttribute("role", "alert");
  errorDiv.style.cssText = `
    background-color: var(--color-danger-light);
    color: var(--color-error);
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    margin: var(--space-sm);
  `;
  errorDiv.textContent = ERROR_MESSAGES.FETCH;

  const container =
    document.querySelector(".search-container") || document.body;
  container.prepend(errorDiv);

  // Auto-suppression après 5 secondes
  setTimeout(() => errorDiv.remove(), 5000);
}

// Expose les fonctions pour les utiliser dans le HTML
window.createUser = createUser;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.fetchUsers = fetchUsers;
window.createVoyage = createVoyage;
window.startVoyage = startVoyage;
window.stopVoyage = stopVoyage;
window.annulVoyage = annulVoyage;
window.updateProfile = updateProfile;
window.toggleChauffeurInfo = toggleChauffeurInfo;
window.approveReview = approveReview;
window.rejectReview = rejectReview;
window.resolveIssue = resolveIssue;
window.createEmployeeAccount = createEmployeeAccount;
window.suspendAccount = suspendAccount;
window.participer = participer;

// Initialisation unique lors du chargement du DOM
// Cette fonction est appelée lorsque le DOM est complètement chargé
document.addEventListener("DOMContentLoaded", function () {
  // Initialisation du menu et de la recherche
  // Ces fonctions sont responsables de la configuration du menu et de la recherche sur la page
  initialiserMenu();
  initialiserRecherche();

  // Initialisation du formulaire d'inscription si présent
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    // Appel de la fonction d'initialisation de la validation du formulaire
    initialiserFormValidation("register-form");

    // Gestion de l'affichage/masquage du mot de passe
    // Permet de basculer entre le type "password" et "text" pour afficher ou masquer le mot de passe
    const togglePasswordButton = document.getElementById("toggle-password");
    if (togglePasswordButton) {
      togglePasswordButton.addEventListener("click", function () {
        togglePassword("password", "toggle-password");
      });
    }
  }
});
