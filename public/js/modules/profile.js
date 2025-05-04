// Fonction pour mettre à jour le profil d'un utilisateur
// Cette fonction est appelée lors de la soumission du formulaire de mise à jour du profil
export function updateProfile(userId, newName, newSurname, role) {
  if (!userId || !newName || !newSurname || !role) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  // Vérifier si l'email a été modifié
  const newEmail = document.getElementById("newEmail").value;
  const confirmEmail = document.getElementById("confirmEmail").value;
  const oldEmail = document.getElementById("newEmail").defaultValue;

  if (newEmail !== oldEmail) {
    // Vérifier que les Emails correspondent
    if (newEmail !== confirmEmail) {
      document.getElementById("confirmEmail-error").textContent =
      "Les adresses Email ne correspondent pas";
    return;
    }

  // Vérifier la disponibilité de l'email
  verifierEmail(newEmail).then((disponible) => {
    if (!disponible) {
      document.getElementById("newEmail-error").textContent =
        "Cette adresse Email est déjà utilisée";
      return;
    }
    // Si l'email est disponible, continuer avec la mise à jour
    envoyerMiseAJour(userId, newName, newSurname, role, oldEmail);
    });
  } else {
  // Si l'Email n'est pas modifé, continuer avec la mise à jour
  envoyerMiseAJour(userId, newName,newSurname, role, oldEmail);
  }
}

// Fonction pour vérifier la disponibilité de l'email
async function verifierEmail(email) {
  try {
    const response = await fetch('../../backend/profile.php?action=checkEmail&email=' + encodeURIComponent(email));
    const data = await response.json();
    return data.disponible;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
    return false;
  }
}

// Fonction pour envoyer la mise à jour du profil
function envoyerMiseAJour(userId, newName, newSurname, role, email) {
  // Récupérer les informations du véhicule si nécessaire
  let vehiculeInfo = {};
  if (role === 'chauffeur' || role === 'les_deux') {
    vehiculeInfo = {
      plaque: document.getElementById('plaque').value,
      dateImmat: document.getElementById('date-immat').value,
      modele: document.getElementById('vehicule').value,
      places: document.getElementById('places').value,
      preferences: Array.from(document.querySelectorAll('input[name="preferences"]:checked'))
        .map(checkbox => checkbox.value)
    };
  }

  // Envoyer la requête de mise à jour
  fetch("../../backend/profile.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=updateUser&id=${userId}&nom=${encodeURIComponent(newName)}&prenom=${encodeURIComponent(newSurname)}&role=${role}&email=${encodeURIComponent(email)}&vehicule=${JSON.stringify(vehiculeInfo)}`,
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


  // Récupérer les informations du véhicules si le role est chauffeur ou les_deux
  let vehiculeInfo = {};
  if (role === "chauffeur" || role === "les_deux") {
    vehiculeInfo = {
      plaque: document.getElementById("plaque").value,
      dateImmat: document.getElementById("dateImmat").value,
      modele: document.getElementById("vehicule").value,
      places: document.getElementById("places").value,
      preferences: Array.from(
        document.querySelectorAll('input[name="preferences"]:checked')
      ).map((checkbox) => checkbox.value),
    };
  }

  fetch("../../backend/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=updateUser&id=${userId}&nom=${newName}&prenom=${newSurname}&role=${role}`,
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

// Fonction qui gère l'affichage conditionnel d'informations relatives au chauffeur dans un formulaire
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
      document.getElementById("newName").value = data.user.nom;
      document.getElementById("newSurname").value = data.user.prenom;
      document.getElementById("role").value = data.user.role;

      // Mise à jour des champs du véhicule si nécessaire
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


// Fonction pour valider les emails
export async function validerEmails() {
  const email = document.getElementById("newEmail").value;
  const confirmEmail = document.getElementById("confirmEmail").value;
  const emailError = document.getElementById("newEmail-error");
  const confirmEmailError = document.getElementById("confirmEmail-error");

  // Réinitialiser les messages
  emailError.textContent = "";
  confirmEmailError.textContent = "";

  // Verifier si les emails correspondent
  if (email !== confirmEmail) {
    confirmEmailError.textContent = "Les adresses email ne correspondent pas";
    return false;
  }

  // Vérifier si l'email est déja utilisé
  const emailDisponible = await verifierEmail(email);
  if (!emailDisponible) {
    emailError.textContent = "Cette adresse email est déjà utilisée";
    return false;
  }

  return true;
}
