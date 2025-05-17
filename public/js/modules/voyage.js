// Les statuts de voyage sont définis ici
// Ces statuts peuvent être utilisés pour gérer l'état des voyages dans l'application
const VOYAGE_STATUS = {
  PROPOSED: "proposed",
  STARTED: "started",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Configuration
const CONFIG = {
  API_URL: "../../backend",
  MESSAGES: {
    CONFIRMATION_ANNULATION:
      "Êtes-vous sûr de vouloir annuler ce covoiturage ?",
    CHAMPS_OBLIGATOIRES: "Tous les champs sont obligatoires",
    SUCCESS: {
      CREATION: "Voyage créé avec succès !",
      DEMARRAGE: "Le voyage a commencé !",
      ARRET: "Le voyage est terminé !",
      ANNULATION: "Le covoiturage a été annulé avec succès !",
    },
    ERROR: {
      CREATION: "Erreur lors de la création du voyage",
      DEMARRAGE: "Erreur lors du démarrage du voyage",
      ARRET: "Erreur lors de l'arrêt du voyage",
      ANNULATION: "Erreur lors de l'annulation du voyage",
    },
  },
};

// Fonction pour créer un voyage
// Cette fonction est appelée lors de la soumission du formulaire de création de voyage
export function createVoyage(depart, arrivee, date, heure, prix, nbPlaces) {
  if (!depart || !arrivee || !date || !heure || !prix || !nbPlaces) {
    alert(CONFIG.MESSAGES.CHAMPS_OBLIGATOIRES);
    return;
  }

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  fetch(`${CONFIG.API_URL}/voyage.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: `action=createVoyage&lieu_depart=${depart}&lieu_arrivee=${arrivee}&date_depart=${date}&heure_depart=${heure}&prix_personne=${prix}&nb_places=${nbPlaces}`,
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        alert(CONFIG.MESSAGES.SUCCESS.CREATION);
        window.location.href = "manage-voyage.html";
      } else {
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert(CONFIG.MESSAGES.ERROR.CREATION);
    });
}

// Fonction pour démarrer un voyage
export function startVoyage(tripId) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  fetch(`${CONFIG.API_URL}/voyage.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: `action=startVoyage&tripId=${tripId}`,
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        document.getElementById("start-voyage-btn").style.display = "none";
        document.getElementById("end-voyage-btn").style.display =
          "inline-block";
        alert(CONFIG.MESSAGES.SUCCESS.DEMARRAGE);
      } else {
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert(CONFIG.MESSAGES.ERROR.DEMARRAGE);
    });
}

// Fonction pour terminer un voyage
export function stopVoyage(tripId) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  fetch(`${CONFIG.API_URL}/voyage.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: `action=stopVoyage&tripId=${tripId}`,
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        document.getElementById("start-voyage-btn").style.display =
          "inline-block";
        document.getElementById("end-voyage-btn").style.display = "none";
        alert(CONFIG.MESSAGES.SUCCESS.ARRET);
      } else {
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert(CONFIG.MESSAGES.ERROR.ARRET);
    });
}

// Fonction pour annuler un voyage
export function annulVoyage(tripId) {
  if (!confirm(CONFIG.MESSAGES.CONFIRMATION_ANNULATION)) return;

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  fetch(`${CONFIG.API_URL}/voyage.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: `action=annulVoyage&tripId=${tripId}`,
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        document.getElementById("trip-" + tripId).remove();
        alert(CONFIG.MESSAGES.SUCCESS.ANNULATION);
      } else {
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert(CONFIG.MESSAGES.ERROR.ANNULATION);
    });
}
