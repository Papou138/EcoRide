// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", function () {
  // Récupérer le formulaire
  const searchForm = document.getElementById("search-form");

  // Vérifier si le formulaire existe
  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Récupérer les éléments du formulaire
      const departInput = document.getElementById("depart");
      const arriveeInput = document.getElementById("arrivee");
      const dateInput = document.getElementById("date");
      const ecologiqueInput = document.getElementById("ecologique");
      const prixInput = document.getElementById("prix");
      const dureeInput = document.getElementById("duree");
      const noteInput = document.getElementById("note");
      const resultsDiv = document.getElementById("results");

      // Vérifier si tous les éléments existent
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
        const ecologique = ecologiqueInput.value || "Non spécifié";
        const prix = prixInput.value || "Non spécifié";
        const duree = dureeInput.value || "Non spécifiée";
        const note = noteInput.value || "Non spécifiée";

        // Formatage de la date en français / Utilisation de l'API Intl.DateTimeFormat
        const dateFr = date
          ? new Intl.DateTimeFormat("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(date))
          : "Non spécifiée";

        // Filtrer les résultats (simulation)
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
          {
            depart: "Paris",
            arrivee: "Lyon",
            date: "12-04-2025",
            ecologique: "non",
            prix: 25,
            duree: 5,
            note: 4.0,
          },
        ];

        // Filtrer les trajets
        trajets.forEach((trajet) => {
          if (
            (!ecologique || trajet.ecologique === ecologique) &&
            (!prix || trajet.prix <= prix) &&
            (!duree || trajet.duree <= duree) &&
            (!note || trajet.note >= note)
          ) {
            results += `<li>
            <p>
            Trajet de ${trajet.depart} à ${trajet.arrivee}, ${trajet.date}, ${
              trajet.ecologique ? "Ecologique" : "Non écologique"
            }, ${trajet.prix} €, ${trajet.duree} heures, Note: ${trajet.note}
            </p>
            <a href="detail.html?id=${trajet.id}">Voir les détails</a>
            </li>`;
          }
        });

        // Afficher les résultats
        results += `</ul>`;
        if (resultsDiv) {
          resultsDiv.innerHTML = results;
        }
      }
    });
  }
});

/*
Fonction pour gérer le menu mobile
*/
document.addEventListener("DOMContentLoaded", function () {
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
});

/*
Fonction pour gérer la participation à un covoiturage
Cette fonction vérifie si l'utilisateur est connecté et s'il a suffisamment de crédits
*/
function participer() {
  // Vérifier si l'utilisateur est connecté (simulation)
  const estConnecte = true; // Remplace par une vérification réelle
  const aSuffisammentDeCredits = true; // Remplace par une vérification réelle

  if (estConnecte) {
    if (aSuffisammentDeCredits) {
      // Confirmation de participation
      const confirme = confirm(
        "Voulez-vous vraiment participer à ce covoiturage ?"
      );
      if (confirme) {
        alert("Vous avez été inscrit au covoiturage !");
        // Mettre à jour les crédits et les places disponibles (simulation)
        // .....
      }
    } else {
      alert(
        "Vous n'avez pas assez de crédits pour participer à ce covoiturage."
      );
    }
  } else {
    alert("Vous devez être connecté pour participer à un covoiturage.");
    // Rediriger vers la page de connexion (simulation)
    // window.location.href = "login.html"; // Remplace par l'URL de la page de connexion
  }
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
Fonction pour gérer l'annulation d'un covoiturage
*/
function annulVoyage(tripId) {
  // Simuler l'annulation du covoiturage
  const confirmation = confirm(
    "Êtes-vous sûr de vouloir annuler ce covoiturage ?"
  );
  if (confirmation) {
    alert("Le covoiturage a été annulé avec succès !");
    // Supprimer l'élément de la liste (simulation)
    document.getElementById("trip-" + tripId).remove();
  }
}

/*
Fonctions pour gérer le démarrage et l'arrêt d'un covoiturage
*/
function startVoyage() {
  // Simuler le démarrage du covoiturage
  alert("Le covoiturage a commencé !");
  // Masquer le bouton de démarrage et afficher le bouton d'arrêt
  document.getElementById("start-voyage-btn").style.display = "none";
  document.getElementById("end-voyage-btn").style.display = "inline-block";
}

function endVoyage() {
  // Simuler l'arrêt du covoiturage
  alert("Le covoiturage est arrivé à destination !");
  // Afficher le bouton de démarrage et masquer le bouton d'arrêt
  document.getElementById("start-voyage-btn").style.display = "inline-block";
  document.getElementById("end-voyage-btn").style.display = "none";
}

/*
Fonctions pour gérer l'approbation et le rejet des avis
ainsi que la résolution des covoiturage problématiques
*/
function approveReview(reviewId) {
  // Simuler l'approbation de l'avis
  alert("L'avis a été approuvé avec succès !");
  // Supprimer l'élément de la liste (simulation)
  document.getElementById(`review-${reviewId}`).remove();
}

function rejectReview(reviewId) {
  // Simuler le rejet de l'avis
  alert("L'avis a été rejeté avec succès !");
  // Supprimer l'élément de la liste (simulation)
  document.getElementById(`review-${reviewId}`).remove();
}

function resolveIssue(issueId) {
  // Simuler la résolution du problème
  alert("Le problème a été résolu avec succès !");
  // Supprimer l'élément de la liste (simulation)
  document.getElementById(`issue-${issueId}`).remove();
}

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

/* ---------------------------------------------------------------
Intégration du Backend avec le Frontend
en utilisant AJAX pour effectuer des appels API
------------------------------------------------------------------ */

/* ---- Les opérations CRUD (Create Read Update Delete) ---- */
// Fonction pour créer un nouvel utilisateur (CREATE)
function createUser(nom, prenom, email, password) {
  fetch("../../backend/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=createUser&nom=${encodeURIComponent(
      nom
    )}&prenom=${encodeURIComponent(prenom)}&email=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(password)}`,
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      // Mettre à jour l'interface utilisateur ou afficher un message de succès
    })
    .catch((error) => console.error("Error:", error));
}

// Exemple d'utilisation
createUser("Dupont", "Jean", "jean.dupont@example.com", "password123");

// Fonction pour récupérer les utilisateurs (READ)
function fetchUsers() {
  // Utiliser fetch pour envoyer une requête GET à l'endpoint API
  fetch("../../backend/user.php?action=getUsers")
    .then((response) => {
      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // Afficher les données dans la console
      // Mettre à jour l'interface utilisateur avec les données
      const userList = document.getElementById("userList");
      userList.innerHTML = ""; // Vider la liste avant de la remplir
      data.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${user.nom} ${user.prenom} (${user.email})`;
        userList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// Appeler la fonction pour tester
fetchUsers();

// Fonction pour mettre à jour un utilisateur (UPDATE)
function updateUser(id, nom, prenom, role) {
  fetch("../../backend/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=updateUser&id=${encodeURIComponent(
      id
    )}&nom=${encodeURIComponent(nom)}&prenom=${encodeURIComponent(
      prenom
    )}&role=${encodeURIComponent(role)}`,
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      // Mettre à jour l'interface utilisateur ou afficher un message de succès
    })
    .catch((error) => console.error("Error:", error));
}

// Exemple d'utilisation
updateUser(1, "Dupont", "Jean-Luc", "chauffeur");

// Fonction pour supprimer un utilisateur (DELETE)
function deleteUser(id) {
  fetch("../../backend/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=deleteUser&id=${encodeURIComponent(id)}`,
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      // Mettre à jour l'interface utilisateur ou afficher un message de succès
    })
    .catch((error) => console.error("Error:", error));
}

// Exemple d'utilisation
deleteUser(1);
