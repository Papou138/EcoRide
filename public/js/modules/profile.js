// Fonction pour mettre à jour le profil d'un utilisateur
// Cette fonction est appelée lors de la soumission du formulaire de mise à jour du profil
export function updateProfile(userId, newName, newSurname, role) {
  if (!userId || !newName || !newSurname || !role) {
    alert("Tous les champs sont obligatoires");
    return;
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

  if (roleSelect && chauffeurInfo) {
    if (roleSelect.value === "chauffeur" || roleSelect.value === "les_deux") {
      chauffeurInfo.style.display = "block";
    } else {
      chauffeurInfo.style.display = "none";
    }
  }
}
