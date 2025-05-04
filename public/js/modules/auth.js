// Fonction pour créer un utilisateur (CREATE)
// Cette fonction est appelée lors de la soumission du formulaire d'inscription
// Elle envoie une requête POST à l'API pour créer un nouvel utilisateur
export function createUser(nom, prenom, email, password) {
  // Validation basique
  if (!nom || !prenom || !email || !password) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  // Construction des données du formulaire
  const formData = new FormData();
  formData.append("action", "createUser");
  formData.append("nom", nom);
  formData.append("prenom", prenom);
  formData.append("email", email);
  formData.append("password", password);

  // Appel API
  fetch("../../backend/user.php", {
    method: "POST",
    body: formData,
  })
    .then(async (response) => {
      // Vérifier d'abord si la réponse est OK
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Vérifier si la réponse contient du contenu
      const text = await response.text();
      if (!text) {
        throw new Error("Réponse vide du serveur");
      }

      // Tenter de parser le JSON
      try {
        const data = JSON.parse(text);
        alert("Compte créé avec succès !");
        window.location.href = "index.html";
      } catch (e) {
        console.log("Réponse no-JSON", text);
        throw new Error("Format de réponse invalide");
      }
    })
    .catch((error) => {
      console.log("Erreur détaillée : ", error);
      alert(`Erreur lors de la création du compte : ${error.message}`);
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
    body: `action=updateUser&id=${id}&nom=${encodeURIComponent(
      nom
    )}&prenom=${encodeURIComponent(prenom)}&role=${encodeURIComponent(role)}`,
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

// Fonction pour supprimer un utilisateur (DELETE)
// Cette fonction est appelée lors de la soumission du formulaire de suppression d'un utilisateur
export function deleteUser(id) {
  fetch("../../backend/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=deleteUser&id=${encodeURIComponent(id)}`,
  })
    .then((response) => response.text())
    .then((message) => {
      alert("Utilisateur supprimé avec succès !");
      console.log(message);
      // Mettre à jour l'interface utilisateur ou afficher un message de succès
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert("Erreur lors de la suppression de l'utilisateur");
    });
}

// Fonction pour récupérer les utilisateurs (READ)
// Cette fonction est appelée lors du chargement de la page pour afficher la liste des utilisateurs
// Elle envoie une requête GET à l'API pour récupérer la liste des utilisateurs
export function fetchUsers() {
  fetch("../../backend/user.php?action=getUsers")
    .then((response) => {
      if (!response.ok) throw new Error("Erreur réseau");
      return response.json();
    })
    .then((data) => {
      const userList = document.getElementById("userList");
      userList.innerHTML = "";
      data.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${user.nom} ${user.prenom} (${user.email})`;
        userList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Erreur : ", error);
      alert("Erreur lors de la récupération des utilisateurs");
    });
}
