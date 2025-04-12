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
      const resultsDiv = document.getElementById("results");

      // Vérifier si tous les éléments existent
      if (departInput && arriveeInput && dateInput && resultsDiv) {
        // Récupérer les valeurs
        const depart = departInput.value || "Non spécifié";
        const arrivee = arriveeInput.value || "Non spécifié";
        const date = dateInput.value || "Non spécifiée";

        // Afficher les résultats
        resultsDiv.innerHTML = `
                  <h3>Résultats pour le trajet de ${depart} à ${arrivee} le ${date}:</h3>
                  <ul>
                      <li>Trajet 1: Départ à 8h, 3 places disponibles, 20€</li>
                      <li>Trajet 2: Départ à 9h, 2 places disponibles, 25€</li>
                  </ul>
              `;
      } else {
        console.error("Certains éléments du formulaire sont manquants");
      }
    });
  } else {
    console.error("Le formulaire de recherche n'a pas été trouvé");
  }
});
