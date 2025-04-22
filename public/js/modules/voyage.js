// Fonction pour créer un voyage
// Cette fonction est appelée lors de la soumission du formulaire de création de voyage
export function createVoyage(depart, arrivee, date, heure, prix, nbPlaces) {
  if (!depart || !arrivee || !date || !heure || !prix || !nbPlaces) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  fetch("../../backend/voyage.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=createVoyage&lieu_depart=${depart}&lieu_arrivee=${arrivee}&date_depart=${date}&heure_depart=${heure}&prix_personne=${prix}&nb_places=${nbPlaces}`,
  })
    .then((response) => response.text())
    .then((message) => {
      alert("Voyage créé avec succès !");
      window.location.href = "manage-voyage.html";
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert("Erreur lors de la création du voyage");
    });
}

// Fonction pour demarrer un voyage
export function startVoyage(tripId) {
  fetch("../../backend/voyage.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=startVoyage&tripId=${tripId}`,
  })
    .then((response) => response.text())
    .then((message) => {
      document.getElementById("start-voyage-btn").style.display = "none";
      document.getElementById("end-voyage-btn").style.display = "inline-block";
      alert("Le voyage a commencé !");
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert("Erreur lors du démarrage du voyage");
    });
}

// Fonction pour terminer un voyage
export function stopVoyage(tripId) {
  fetch("../../backend/voyage.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=stopVoyage&tripId=${tripId}`,
  })
    .then((response) => response.text())
    .then((message) => {
      document.getElementById("start-voyage-btn").style.display =
        "inline-block";
      document.getElementById("end-voyage-btn").style.display = "none";
      alert("Le voyage est terminé !");
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert("Erreur lors de l'arrêt du voyage");
    });
}

// Fonction pour annuler un voyage
export function annulVoyage(tripId) {
  const confirmation = confirm(
    "Êtes-vous sûr de vouloir annuler ce covoiturage ?"
  );
  if (!confirmation) return;

  fetch("../../backend/voyage.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=annulVoyage&tripId=${tripId}`,
  })
    .then((response) => response.text())
    .then((message) => {
      document.getElementById("trip-" + tripId).remove();
      alert("Le covoiturage a été annulé avec succès !");
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert("Erreur lors de l'annulation du voyage");
    });
}
