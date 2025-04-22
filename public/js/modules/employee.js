// Fonctions pour gérer les employés et les comptes
export function createEmployeeAccount(email) {
  if (!email || !email.includes("@")) {
    alert("Veuillez entrer une adresse email valide.");
    return false;
  }

  try {
    // Simuler la création du compte employé
    alert(`Compte employé créé avec succès pour ${email} !`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la création du compte :", error);
    alert("Une erreur est survenue. Veuillez réessayer.");
    return false;
  }
}

export function suspendAccount(email) {
  if (!email || !email.includes("@")) {
    alert("Veuillez entrer une adresse email valide.");
    return false;
  }

  try {
    // Simuler la suspension du compte
    alert(`Le compte ${email} a été suspendu avec succès !`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suspension du compte :", error);
    alert("Une erreur est survenue. Veuillez réessayer.");
    return false;
  }
}
