// Fonction pour initialiser le menu recherche
// Cette fonction est appelée lorsque le DOM est complètement chargé
// et que le script est exécuté
// Elle ajoute un écouteur d'événements au formulaire de recherche et gère la soumission du formulaire
export function initialiserRecherche() {
  const searchForm = document.getElementById("search-form");
  const toggleFilters = document.getElementById("toggle-filters");
  const filtersContent = document.getElementById("filters-content");

  // Getion de sfiltres avancées
  if (toggleFilters && filtersContent) {
    toggleFilters.addEventListener("click", () => {
      const isExpanded = filtersContent.classList.toggle("active");
      toggleFilters.setAttribute("aria-expanded", isExpanded);
      filtersContent.setAttribute("aria-hidden", !isExpanded);

      toggleFilters.innerHTML = isExpanded
        ? '<i class="fas fa-times" aria-hidden="true"></i> Masquer les filtres'
        : '<i class="fas fa-filter" aria-hidden="true"></i> Filtres avancés';
    });
  }

  if (searchForm) {
    // Initialisation de la date
    initialiserDateInput();

    // Initialisation de la validation
    initialiserFormValidation(searchForm);

    // Gestion de la soumission
    searchForm.addEventListener("submit", handleSearchSubmit);
  }
}

function initialiserDateInput() {
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.setAttribute("aria-describedby", "date-help");
    const helpText = document.getElementById("date-help");
    if (!helpText) {
      const helpDiv = document.createElement("div");
      helpDiv.id = "date-help";
      helpDiv.className = "help-text";
      helpDiv.textContent = "Sélectionnez une date à partir d'aujourd'hui";
      dateInput.parentNode.appendChild(helpDiv);
    }
  }
}

function initialiserFormValidation(form) {
  const inputs = {
    required: form.querySelectorAll("input[required], select[required]"),
    optional: form.querySelectorAll(
      "input:not([required]), select:not([required])"
    ),
  };

  Object.entries(inputs).forEach(([type, elements]) => {
    elements.forEach((input) => {
      ["input", "blur"].forEach((event) => {
        input.addEventListener(event, () =>
          validateInput(input, type === "required")
        );
      });
    });
  });
}

function validateInput(input, isRequired) {
  const state = {
    errorDiv: document.getElementById(`${input.id}-error`),
    helpDiv: document.getElementById(`${input.id}-help`),
    isValid: true,
    errorMessage: "",
  };

  resetInputState(input, state.errorDiv);

  if (isRequired && !input.value.trim()) {
    state.isValid = false;
    state.errorMessage = `Le champ ${input.id} est requis.`;
  } else {
    const validationResult = validateSpecificField(input);
    state.isValid = validationResult.isValid;
    state.errorMessage = validationResult.message;
  }

  updateInputState(input, state);
  return state.isValid;
}

function validateSpecificField(input) {
  const validators = {
    depart: () => validateTextInput(input, 2),
    arrivee: () => validateTextInput(input, 2),
    date: () => validateDateField(input),
    ecologique: () => validateSelectField(input, ["", "oui", "non"]),
    prix: () => validateNumericField(input, 0, 1000, "€"),
    duree: () => validateNumericField(input, 0, 24, "heures"),
    note: () => validateNumericField(input, 0, 5, "étoiles"),
  };

  return validators[input.id]
    ? validators[input.id]()
    : { isValid: true, message: "" };
}

function validateTextInput(input, minLength) {
  if (input.value.trim().length < minLength) {
    return {
      isValid: false,
      message: `Le champ doit contenir au moins ${minLength} caractères.`,
    };
  }
  return { isValid: true, message: "" };
}

function validateDateField(input) {
  const selectedDate = new Date(input.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return {
      isValid: false,
      message: "La date ne peut pas être dans le passé.",
    };
  }
  return { isValid: true, message: "" };
}

function validateNumericField(input, min, max, unit) {
  const value = parseFloat(input.value);
  if (input.value && (isNaN(value) || value < min || value > max)) {
    return {
      isValid: false,
      message: `La valeur doit être comprise entre ${min} et ${max} ${unit}.`,
    };
  }
  return { isValid: true, message: "" };
}

function validateSelectField(input, validValues) {
  if (input.value && !validValues.includes(input.value)) {
    return {
      isValid: false,
      message: `Veuillez sélectionner une option valide.`,
    };
  }
  return { isValid: true, message: "" };
}

function resetInputState(input, errorDiv) {
  input.classList.remove("error");
  input.setAttribute("aria-invalid", "false");
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.classList.remove("visible");
  }
}

function updateInputState(input, state) {
  if (!state.isValid) {
    input.classList.add("error");
    input.setAttribute("aria-invalid", "true");
    if (state.errorDiv) {
      state.errorDiv.textContent = state.errorMessage;
      state.errorDiv.classList.add("visible");
    }
  }
  if (state.helpDiv) {
    state.helpDiv.style.display = state.isValid ? "block" : "none";
  }
}

function handleSearchSubmit(event) {
  event.preventDefault();

  const formData = collectFormData();
  if (!validateForm(event.target)) return;

  try {
    displayResults(formData);
  } catch (error) {
    handleSearchError(error);
  }
}

function collectFormData() {
  const fields = [
    "depart",
    "arrivee",
    "date",
    "ecologique",
    "prix",
    "duree",
    "note",
  ];
  return fields.reduce((data, field) => {
    const element = document.getElementById(field);
    data[field] = element ? element.value : "";
    return data;
  }, {});
}

function validateForm(form) {
  const requiredInputs = form.querySelectorAll("input[required]");
  return Array.from(requiredInputs).every((input) =>
    validateInput(input, true)
  );
}

function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  try {
    const dateFr = formatDate(data.date);
    resultsDiv.innerHTML = generateResultsHTML(data, dateFr);
    resultsDiv.setAttribute("aria-live", "polite");
  } catch (error) {
    handleResultsError(resultsDiv, error);
  }
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

function generateResultsHTML(data, dateFr) {
  return `
    <div class="search-results" role="region" aria-label="Résultats de recherche">
      <h3>Résultats de recherche</h3>
      <div class="result-item">
        ${generateResultField("De", data.depart)}
        ${generateResultField("À", data.arrivee)}
        ${generateResultField("Date", dateFr)}
        ${
          data.ecologique
            ? generateResultField("Véhicule écologique", data.ecologique)
            : ""
        }
        ${data.prix ? generateResultField("Prix maximum", `${data.prix}€`) : ""}
        ${
          data.duree
            ? generateResultField("Durée maximum", `${data.duree}h`)
            : ""
        }
        ${
          data.note ? generateResultField("Note minimum", `${data.note}/5`) : ""
        }
      </div>
    </div>
  `;
}

function generateResultField(label, value) {
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function handleSearchError(error) {
  console.error("Erreur lors de la recherche:", error);
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
    <div class="error-message" role="alert">
      Une erreur est survenue lors de la recherche.
      Veuillez réessayer ultérieurement.
    </div>
  `;
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
