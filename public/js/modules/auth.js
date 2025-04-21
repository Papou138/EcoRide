// Fonction pour créer un utilisateur (CREATE)
// Cette fonction est appelée lors de la soumission du formulaire d'inscription
// Elle envoie une requête POST à l'API pour créer un nouvel utilisateur
export function createUser(nom, prenom, email, password) {
  // Validation basique
  if (!nom || !prenom || !email || !password) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  // Appel API
  fetch("../../backend/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=createUser&nom=${encodeURIComponent(
      nom
    )}&prenom=${encodeURIComponent(prenom)}&email=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(password)}`,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erreur réseau");
      return response.text();
    })
    .then((message) => {
      alert("Compte créé avec succès !");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert("Erreur lors de la création du compte");
    });
}

// Fonction pour mettre à jour un utilisateur (UPDATE)
// Cette fonction est appelée lors de la soumission du formulaire de mise à jour du profil
export function updateUser(id, nom, prenom, role) {
  fetch("../../backend/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=updateUser&id=${encodeURIComponent(
      id
    )}&nom=${encodeURIComponent(nom)}&prenom=${encodeURIComponent(
      prenom
    )}&role=${encodeURIComponent(role)}`,
  })
    .then((response) => response.text())
    .then((message) => {
      alert("Profil mis à jour avec succès !");
      console.log(message);
      // Mettre à jour l'interface utilisateur ou afficher un message de succès
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert("Erreur lors de la mise à jour du profil");
    });
}
