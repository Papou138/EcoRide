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

// Gestion globale des erreurs fetch
function handleFetchError(error) {
  console.error("Erreur : ", error);
  alert(
    "Une erreur est survenue lors de la communication avec le serveur. Veuillez réessayer."
  );
}

// Expose les fonctions pour les utiliser dans le HTML
window.createUser = createUser;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.fetchUsers = fetchUsers;

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
