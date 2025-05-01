// Gestion de l'affichage/masquage du mot de passe
// Permet de basculer entre le type "password" et "text" pour afficher ou masquer le mot de passe
export function togglePassword(passwordFieldId, toggleButtonId) {
  const passwordField = document.getElementById(passwordFieldId);
  const icon = document.getElementById(toggleButtonId).querySelector("i");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// Validation en temps réel des champs de formulaire
// Affiche un message d'erreur si le champ est invalide
export function validateInput(input) {
  const errorDiv = document.getElementById(`${input.id}-error`);

  if (!input.checkValidity()) {
    errorDiv.textContent = input.title || "Ce champ est requis";
    errorDiv.classList.add("visible");
    input.classList.add("error");
  } else {
    errorDiv.textContent = "";
    errorDiv.classList.remove("visible");
    input.classList.remove("error");
  }
}

// Initialisation de la validation des formulaires
// Ajoute des écouteurs d'événements pour valider les champs de formulaire lors de la saisie
export function initialiserFormValidation(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll("input[required]");

  inputs.forEach((input) => {
    input.addEventListener("input", () => validateInput(input));
  });
}
