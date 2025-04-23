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

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", function () {
  // Gestion du menu hamburger - affichage du menu mobile
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("active");

      // Animation du bouton hamburger
      const spans = this.getElementsByTagName("span");
      this.classList.toggle("active");

      if (this.classList.contains("active")) {
        spans[0].style.transform = "rotate(-45deg) translate(-5px, 6px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(45deg) translate(-5px, -6px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  }

  // Gestion du formulaire de recherche
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const departInput = document.getElementById("depart");
      const arriveeInput = document.getElementById("arrivee");
      const dateInput = document.getElementById("date");
      const ecologiqueInput = document.getElementById("ecologique");
      const prixInput = document.getElementById("prix");
      const dureeInput = document.getElementById("duree");
      const noteInput = document.getElementById("note");
      const resultsDiv = document.getElementById("results");

      if (
        departInput &&
        arriveeInput &&
        dateInput &&
        ecologiqueInput &&
        prixInput &&
        dureeInput &&
        noteInput &&
        resultsDiv
      ) {
        // Récupérer les valeurs
        const depart = departInput.value || "Non spécifié";
        const arrivee = arriveeInput.value || "Non spécifié";
        const date = dateInput.value || "Non spécifiée";

        // Formatage de la date en français
        const dateFr = date
          ? new Intl.DateTimeFormat("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(date))
          : "Non spécifiée";

        // Afficher les résultats
        let results = `
            <h3>Résultats pour le trajet de ${depart} à ${arrivee} le ${dateFr} :</h3>
            <ul>`;

        // Exemple de données simulées
        const trajets = [
          {
            depart: "Paris",
            arrivee: "Lyon",
            date: "12-04-2025",
            ecologique: "oui",
            prix: 20,
            duree: 4,
            note: 4.5,
          },
        ];

        // Filtrer les trajets
        trajets.forEach((trajet) => {
          results += `<li>
                    <p>Trajet de ${trajet.depart} à ${trajet.arrivee}, ${trajet.date}</p>
                    <a href="detail.html?id=${trajet.id}">Voir les détails</a>
                </li>`;
        });

        results += `</ul>`;
        resultsDiv.innerHTML = results;
      }
    });
  }
});

// Gestion des erreurs fetch
function handleFetchError(error) {
  console.error("Erreur : ", error);
  alert(
    "Une erreur est survenue lors de la communication avec le serveur. Veuillez réessayer."
  );
}

/*
Fonction pour gérer la soumission du formulaire
Cette fonction vérifie que les informations fournies sont valides
et simule l'enregistrement de l'utilisateur
*/
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Récupérer les valeurs du formulaire
      const pseudoInput = document.getElementById("pseudo");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      // Vérifier si les élémenents existent
      if (pseudoInput && emailInput && passwordInput) {
        const pseudo = pseudoInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validation des champs
        if (!pseudo) {
          alert("Le pseudo est obligatoire.");
          pseudoInput.focus();
          return;
        }

        if (!email || !email.includes("@")) {
          alert("Veuiller entrer une adresse email valide.");
          emailInput.focus();
          return;
        }

        if (password.length < 8) {
          alert("Le mot de passe doit contenir au moins 8 caractères.");
          passwordInput.focus();
          return;
        }

        try {
          // Simuler l'enregistrement de l'utilisateur
          alert(
            `Compte créé avec succès pour ${pseudo}! Vous recevez 20 crédits.`
          );

          // Réinitialiser le formulaire
          registerForm.reset();

          // Redirection (simultation)
          setTimeout(() => {
            window.location.href = "index.html"; // Remplace par l'URL de la page d'accueil
          }, 1500);
        } catch (error) {
          console.error("Erreur lors de l'inscription :", error);
          alert(
            "Une erreur est survenue lors de l'inscription. Veuillez réessayer"
          );
        }
      } else {
        console.error("Certains éléments du formulaire sont manquants.");
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    });
  } else {
    console.error("Le formulaire d'inscription n'a pas été trouvé.");
  }
});

/*
Fonction pour gérer l'affichage des informations spécifiques au rôle de l'utilisateur
*/
document.addEventListener("DOMContentLoaded", function () {
  // Gestion du changement de rôle
  const roleSelect = document.getElementById("role");
  const chauffeurInfo = document.getElementById("chauffeur-info");

  if (roleSelect && chauffeurInfo) {
    roleSelect.addEventListener("change", function () {
      try {
        if (this.value === "chauffeur" || this.value === "les_deux") {
          chauffeurInfo.style.display = "block";
        } else {
          chauffeurInfo.style.display = "none";
        }
      } catch (error) {
        console.error("Erreur lors du changement de rôle :", error);
      }
    });
  } else {
    console.error("Éléments du sélecteur de rôle non trouvés");
  }

  // Gestion du formulaire de profil
  const profileForm = document.getElementById("profile-form");

  if (profileForm) {
    profileForm.addEventListener("submit", function (event) {
      event.preventDefault();

      try {
        // Simuler l'enregistrement des informations
        alert("Vos informations ont été enregistrées avec succès !");

        // Réinitialiser le formulaire (optionnel)
        if (profileForm instanceof HTMLFormElement) {
          profileForm.reset();
        }
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du profil :", error);
        alert(
          "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer."
        );
      }
    });
  } else {
    console.error("Le formulaire de profil n'a pas été trouvé");
  }
});

/*
Fonction pour gérer la soumission du formulaire de Saisie de voyage
*/
document.addEventListener("DOMContentLoaded", function () {
  const tripForm = document.getElementById("trip-form");

  if (tripForm) {
    tripForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Récupérer les valeurs du formulaire de Saisie de voyage
      const departInput = document.getElementById("depart");
      const arriveeInput = document.getElementById("arrivee");
      const dateInput = document.getElementById("date");
      const heureDepartInput = document.getElementById("heure-depart");
      const prixInput = document.getElementById("prix");
      const vehiculeInput = document.getElementById("vehicule");
      const placesInput = document.getElementById("places");

      if (
        departInput &&
        arriveeInput &&
        dateInput &&
        heureDepartInput &&
        prixInput &&
        vehiculeInput &&
        placesInput
      ) {
        // Récupérer les éléments du formulaire
        const depart = departInput.value || "Non spécifié";
        const arrivee = arriveeInput.value || "Non spécifié";
        const heureDepart = heureDepartInput.value || "Non spécifié";
        const prix = prixInput.value || "Non spécifié";
        const places = placesInput.value || "Non spécifié";
        // Formatage de la date en français
        // Utilisation de l'API Intl.DateTimeFormat pour formater la date
        const date = dateInput.value
          ? new Intl.DateTimeFormat("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(dateInput.value))
          : "Non spécifié";

        try {
          // Simuler l'enregistrement d'un trajet
          // Créer un simple message pour confirmer les détails du voyage
          let message = "Voyage proposé avec succès !\n\n";
          message += "Départ : " + depart + "\n";
          message += "Arrivée : " + arrivee + "\n";
          message += "Date : " + date + "\n";
          message += "Heure : " + heureDepart + "\n";
          message += "Prix : " + prix + " €\n";

          // Gestion du singulier ou pluriel si place = 1 ou plus
          let placesMessage = "";
          if (places == 1) {
            placesMessage = "1 place disponible";
          } else {
            placesMessage = places + " places disponibles";
          }
          message += placesMessage;

          // Afficher le message
          alert(message);

          // Réinitialiser le formulaire
          if (tripForm instanceof HTMLFormElement) {
            tripForm.reset();
          }
        } catch (error) {
          console.error("Erreur lors de l'enregistrement du trajet :", error);
          alert("Une erreur est survenue. Veuillez réessayer.");
        }
      } else {
        console.error(
          "Certains éléments du formulaire sont manquants ou invalides."
        );
        alert(
          "Une erreur est survenue. Veuillez vérifier les champs du formulaire."
        );
      }
    });
  } else {
    console.error("Le formulaire de saisie de voyage n'a pas été trouvé");
  }
});

/*
Fonctions pour gérer la création de comptes employés
et la suspension de comptes.
*/
document.addEventListener("DOMContentLoaded", function () {
  const createEmployeeForm = document.getElementById("create-employee-form");
  const suspendForm = document.getElementById("suspend-form");

  if (createEmployeeForm) {
    createEmployeeForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Récupérer l'email de l'employé
      const employeeEmailInput = document.getElementById("employee-email");

      if (employeeEmailInput) {
        try {
          const employeeEmail = employeeEmailInput.value.trim();

          if (!employeeEmail || !employeeEmail.includes("@")) {
            alert("Veuillez entrer une adresse email valide.");
            employeeEmailInput.focus();
            return;
          }

          // Simuler la création du compte employé
          alert(`Compte employé créé avec succès pour ${employeeEmail} !`);
          createEmployeeForm.reset();
        } catch (error) {
          console.error("Erreur lors de la création du compte :", error);
          alert("Une erreur est survenue. Veuillez réessayer.");
        }
      }
    });
  }

  if (suspendForm) {
    suspendForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Récupérer l'email du compte à suspendre
      const accountEmailInput = document.getElementById("account-email");

      if (accountEmailInput) {
        try {
          const accountEmail = accountEmailInput.value.trim();

          if (!accountEmail || !accountEmail.includes("@")) {
            alert("Veuillez entrer une adresse email valide.");
            accountEmailInput.focus();
            return;
          }

          // Simuler la suspension du compte
          alert(`Le compte ${accountEmail} a été suspendu avec succès !`);
          suspendForm.reset();
        } catch (error) {
          console.error("Erreur lors de la suspension du compte :", error);
          alert("Une erreur est survenue. Veuillez réessayer.");
        }
      }
    });
  }
});
