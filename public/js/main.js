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
import { createEmployeeAccount, suspendAccount } from "./modules/employee.js";
import { participer } from "./modules/participer.js";
import { initialiserMenu } from "./modules/menu.js";
import { initialiserRecherche } from "./modules/recherche.js";

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", function () {
  // Initialisation du menu
  initialiserMenu();

  // Initialisation de la recherche
  initialiserRecherche();
});

// Gestion globale des erreurs fetch
function handleFetchError(error) {
  console.error("Erreur : ", error);
  alert(
    "Une erreur est survenue lors de la communication avec le serveur. Veuillez réessayer."
  );
}
