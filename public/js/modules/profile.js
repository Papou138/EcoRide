/* ------------------------------------
 * Module de gestion du profil utilisateur
 * Ce fichier contient toutes les fonctions nécessaires à la gestion du profil
 * ------------------------------------
 */

const CONFIG = {
  API_URL: "../../backend",
};

// Fonction pour mettre à jour le profil d'un utilisateur
export function updateProfile(userId, newName, newSurname, role) {
  // Validation des champs obligatoires
  if (!userId || !newName || !newSurname || !role) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  // Récupération des valeurs des champs email
  const newEmail = document.getElementById("newEmail").value;
  const confirmEmail = document.getElementById("confirmEmail").value;
  const oldEmail = document.getElementById("newEmail").defaultValue;

  // Vérification de la modification de l'email
  if (newEmail !== oldEmail) {
    // Vérification de la correspondance des emails
    if (newEmail !== confirmEmail) {
      document.getElementById("confirmEmail-error").textContent =
        "Les adresses Email ne correspondent pas";
      return;
    }

    // Vérification la disponibilité de l'email
    verifierEmail(newEmail).then((disponible) => {
      if (!disponible) {
        document.getElementById("newEmail-error").textContent =
          "Cette adresse Email est déjà utilisée";
        return;
      }
      // Si l'email est valide, on procède à la mise à jour
      envoyerMiseAJour(userId, newName, newSurname, role, newEmail);
    });
  } else {
    // Si l'email n'a pas été modifé, on met à jour directement
    envoyerMiseAJour(userId, newName, newSurname, role, oldEmail);
  }
}

// Fonction pour vérifier la disponibilité de l'email
async function verifierEmail(email) {
  try {
    const response = await fetch(
      "../../backend/profile.php?action=checkEmail&email=" +
        encodeURIComponent(email)
    );
    const data = await response.json();
    return data.disponible;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email :", error);
    return false;
  }
}

// Fonction pour envoyer la mise à jour du profil
function envoyerMiseAJour(userId, newName, newSurname, role, email) {
  // Récupération des informations du véhicule si nécessaire
  let vehiculeInfo = {};
  if (role === "chauffeur" || role === "les_deux") {
    vehiculeInfo = {
      plaque: document.getElementById("plaque").value,
      dateImmat: document.getElementById("date-immat").value,
      modele: document.getElementById("vehicule").value,
      places: document.getElementById("places").value,
      preferences: Array.from(
        document.querySelectorAll('input[name="preferences"]:checked')
      ).map((checkbox) => checkbox.value),
    };
  }

  // Envoi de la requête de mise à jour
  fetch("../../backend/profile.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=updateUser&id=${userId}&nom=${encodeURIComponent(
      newName
    )}&prenom=${encodeURIComponent(
      newSurname
    )}&role=${role}&email=${encodeURIComponent(
      email
    )}&vehicule=${JSON.stringify(vehiculeInfo)}`,
  })
    .then((response) => response.text())
    .then((message) => {
      alert("Profil mis à jour avec succès !");
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert("Erreur lors de la mise à jour du profil");
    });
}

// Fonction pour gérer l'affichage des informations chauffeur
export function toggleChauffeurInfo() {
  const roleSelect = document.getElementById("role");
  const chauffeurInfo = document.getElementById("chauffeur-info");

  if (chauffeurInfo) {
    if (roleSelect.value === "chauffeur" || roleSelect.value === "les_deux") {
      chauffeurInfo.style.display = "block";
    } else {
      chauffeurInfo.style.display = "none";
    }
  }
}

// Fonction pour charger les données du profil
// Cette fonction est appelée lors du chargement de la page de profil
export function loadProfileData(userId) {
  fetch("../../backend/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=getUser&id=${userId}`,
  })
    .then((response) => response.json())
    .then((data) => {
      // Mise à jour des champs de base
      document.getElementById("newName").value = data.user.nom;
      document.getElementById("newSurname").value = data.user.prenom;
      document.getElementById("role").value = data.user.role;

      // Mise à jour des champs du véhicule si présents
      if (data.vehicule) {
        document.getElementById("plaque").value = data.vehicule.plaque;
        document.getElementById("date-immat").value = data.vehicule.dateImmat;
        document.getElementById("vehicule").value = data.vehicule.modele;
        document.getElementById("places").value = data.vehicule.places;

        // Mise à jour des préférences
        data.vehicule.preferences.forEach((preference) => {
          document.querySelector(
            `input[name="preferences"][value="${preference}"]`
          ).checked = true;
        });
      }

      toggleChauffeurInfo();
    })
    .catch((error) => {
      console.error("Erreur lors du chargement du profil : ", error);
    });
}

// Fonction pour charger le profil
export async function chargerProfil() {
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const response = await fetch(`${CONFIG.API_URL}/profile.php`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    // Remplir les champs du formulaire
    document.getElementById("nom").value = data.user.nom;
    document.getElementById("prenom").value = data.user.prenom;
    document.getElementById("email").value = data.user.email;
    document.getElementById("telephone").value = data.user.telephone || "";
  } catch (error) {
    afficherErreur("profile-error", error.message);
  }
}

// Fonction pour mettre à jour le profil
export async function mettreAJourProfil(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  formData.append("action", "update");

  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const response = await fetch(`${CONFIG.API_URL}/profile.php`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    afficherMessage("profile-success", "Profil mis à jour avec succès");
  } catch (error) {
    afficherErreur("profile-error", error.message);
  }
}
