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
            }, ${trajet.prix}€, ${trajet.duree} heures, Note: ${trajet.note}
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
