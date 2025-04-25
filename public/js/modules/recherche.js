// Fonction pour initialiser le menu recherche
// Cette fonction est appelée lorsque le DOM est complètement chargé
// et que le script est exécuté
// Elle ajoute un écouteur d'événements au formulaire de recherche et gère la soumission du formulaire
export function initialiserRecherche() {
  const searchForm = document.getElementById("search-form");
  const toggleFilters = document.getElementById("toggle-filters");
  const filtersContent = document.getElementById("filters-content");

  if (toggleFilters && filtersContent) {
    toggleFilters.addEventListener("click", () => {
      filtersContent.classList.toggle("active");
      toggleFilters.innerHTML = filtersContent.classList.contains("active")
        ? '<i class="fas fa-times"></i> Masquer les filtres'
        : '<i class="fas fa-filter"></i> Filtres avancés';
    });
  }

  if (searchForm) {
    // Définir la date minimale à aujourd'hui
    const dateInput = document.getElementById("date");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
    }

    //Ajouter des écouteurs d'événements pour la validation en temps réel
    const inputs = searchForm.querySelectorAll("input[required]");
    inputs.forEach((input) => {
      input.addEventListener("input", () => validateInput(input));
      input.addEventListener("blur", () => validateInput(input));
    });

    searchForm.addEventListener("submit", gestionRecherche);
  }
}

function validateInput(input) {
  const errorDiv = document.getElementById(`${input.id}-error`);
  let isValid = true;
  let errorMessage = "";

  // Réinitialiser les styles
  input.classList.remove("error");
  input.setAttribute("aria-invalid", "false");

  // Validation spécifique pour chaque champ
  switch (input.id) {
    case "depart":
    case "arrivee":
      if (!input.value.trim()) {
        errorMessage = `Le champ ${input.id} est requis.`;
        isValid = false;
      } else if (input.value.length > 2) {
        errorMessage = `Le ${input.id} doit contenir au moins 2 caractères.`;
        isValid = false;
      }
      break;

    case "date":
      const selectedDate = new Date(input.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour la comparaison

      if (!input.value) {
        errorMessage = "La date est requise.";
        isValid = false;
      } else if (selectedDate < today) {
        errorMessage = "La date ne peut pas être dans le passé.";
        isValid = false;
      }
      break;

    case "prix":
      if (input.value && (input.value < 0 || input.value > 1000)) {
        errorMessage = "Le prix doit être compris entre 0 et 1000 €.";
        isValid = false;
      }
      break;

    case "duree":
      if (input.value && (input.value < 0 || input.value > 24)) {
        errorMessage = "La durée doit être comprise entre 0 et 24 heures.";
        isValid = false;
      }
      break;

    case "note":
      if (input.value && (input.value < 0 || input.value > 5)) {
        errorMessage = "La note doit être comprise entre 0 et 5.";
        isValid = false;
      }
      break;
  }

  // Mise à jour de l'affichage des erreurs
  if (!isValid) {
    input.classList.add("error");
    input.setAttribute("aria-invalid", "true");
    if (errorDiv) {
      errorDiv.textContent = errorMessage;
      errorDiv.classList.add("visible");
    }
  } else if (errorDiv) {
    errorDiv.textContent = ""; // Réinitialiser le message d'erreur
    errorDiv.classList.remove("visible");
  }
  return isValid;
}

// Fonction pour gérer la soumission du formulaire de recherche
// Cette fonction est appelée lorsque le formulaire est soumis
// Elle empêche le comportement par défaut du formulaire et traite les données
// Elle valide les données et affiche les résultats
function gestionRecherche(event) {
  event.preventDefault();

  const formData = {
    depart: document.getElementById("depart").value,
    arrivee: document.getElementById("arrivee").value,
    date: document.getElementById("date").value,
    ecologique: document.getElementById("ecologique").value,
    prix: document.getElementById("prix").value,
    duree: document.getElementById("duree").value,
    note: document.getElementById("note").value,
  };

  // Validation de tous les champs du formulaire
  const inputs = event.target.querySelectorAll("input[required]");
  let isFormValid = true;

  inputs.forEach((input) => {
    if (!validateInput(input)) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    return;
  }

  try {
    afficheResults(formData);
  } catch (error) {
    console.error("Erreur lors de l'affichage des résultats : ", error);
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
      <div class="error-message">
          Une erreur est survenue lors de l'affichage des résultats.
          Veuillez réessayer ultérieurement.
      </div>
    `;
  }
}

// Fonction pour valider les données du formulaire de recherche
// Cette fonction vérifie si tous les champs obligatoires sont remplis
// Elle affiche une alerte si des champs sont manquants
// Elle retourne true si les données sont valides, sinon false
function valideDataForm(data) {
  if (!data.depart || !data.arrivee || !data.date) {
    alert("Veuillez remplir tous les champs obligatoires");
    return false;
  }
  return true;
}

// Fonction pour afficher les résultats de la recherche
// Cette fonction prend les données du formulaire et les affiche dans la section des résultats
// Elle formate la date au format français et affiche les informations pertinentes
// Elle utilise l'API Intl.DateTimeFormat pour formater la date
// Elle crée un élément HTML pour afficher les résultats
// Elle insère le HTML dans la div des résultats
function afficheResults(data) {
  const resultsDiv = document.getElementById("results");

  try {
    const dateFr = new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(data.date));

    const html = `
        <div class="search-results">
            <h3>Résultats de recherche</h3>
            <div class="result-item">
                <p><strong>De:</strong> ${escapeHtml(data.depart)}</p>
                <p><strong>À:</strong> ${escapeHtml(data.arrivee)}</p>
                <p><strong>Date:</strong> ${dateFr}</p>
                ${
                  data.ecologique
                    ? `<p><strong>Véhicule écologique:</strong> ${escapeHtml(
                        data.ecologique
                      )}</p>`
                    : ""
                }
                ${
                  data.prix
                    ? `<p><strong>Prix maximum:</strong> ${escapeHtml(
                        data.prix
                      )}€</p>`
                    : ""
                }
                ${
                  data.duree
                    ? `<p><strong>Durée maximum:</strong> ${escapeHtml(
                        data.duree
                      )}h</p>`
                    : ""
                }
                ${
                  data.note
                    ? `<p><strong>Note minimum:</strong> ${escapeHtml(
                        data.note
                      )}/5</p>`
                    : ""
                }
            </div>
        </div>
    `;

    resultsDiv.innerHTML = html;
  } catch (error) {
    console.error("Erreur lors du formatage des résultats : ", error);
    resultsDiv.innerHTML = `
            <div class="error-message">
                Une erreur est survenue lors de l'affichage des résultats.
                Veuillez réessayer ultérieurement.
            </div>
        `;
  }
}

// Fonction utilitaire pour échapper les caractères HTML
/* Cette fonction est conçue pour sécuriser le texte qui sera affiché dans du HTML. Voici son fonctionnement étape par étape :
1. Elle prend un paramètre `unsafe` qui est le texte à sécuriser
2. Si `unsafe` est `null` ou `undefined`, elle retourne une chaîne vide
3. Elle convertit l'entrée en chaîne de caractères avec `toString()`
4. Elle remplace les caractères spéciaux HTML par leurs équivalents encodés :
   - `&` devient `&amp;`
   - `<` devient `&lt;`
   - `>` devient `&gt;`
   - `"` devient `&quot;`
   - `'` devient `&#039;`

Cette fonction est importante pour la **sécurité** car elle empêche les attaques XSS (Cross-Site Scripting) en s'assurant que le texte entré par l'utilisateur est affiché tel quel et n'est pas interprété comme du HTML.
Il est recommandé d'utiliser cette fonction chaque fois que vous affichez du contenu utilisateur dans une page HTML.
*/
function escapeHtml(unsafe) {
  if (unsafe == null) return "";
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
