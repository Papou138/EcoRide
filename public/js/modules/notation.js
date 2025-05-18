import { showNotification } from "./notifications.js";

const CONFIG = {
  API_URL: "../../backend",
  MESSAGES: {
    SUCCESS: {
      AVIS_AJOUTE: "Votre avis a été ajouté avec succès !",
    },
    ERROR: {
      NOTE_REQUISE: "Veuillez attribuer une note",
      COMMENTAIRE_REQUIS: "Veuillez laisser un commentaire",
      NOTATION_ERREUR: "Erreur lors de l'ajout de votre avis",
    },
  },
};

export class NotationManager {
  constructor() {
    this.form = document.getElementById("notation-form");
    this.container = document.getElementById("notations-container");
    this.statsContainer = document.getElementById("stats-container");
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
    this.loadNotations();
  }

  async handleSubmit(event) {
    event.preventDefault();

    const note = document.querySelector('input[name="note"]:checked')?.value;
    const commentaire = document.getElementById("commentaire").value.trim();

    if (!note) {
      showNotification(CONFIG.MESSAGES.ERROR.NOTE_REQUISE, "error");
      return;
    }

    if (!commentaire) {
      showNotification(CONFIG.MESSAGES.ERROR.COMMENTAIRE_REQUIS, "error");
      return;
    }

    try {
      const formData = new FormData(event.target);
      formData.append("action", "noter");

      const response = await fetch(`${CONFIG.API_URL}/notation.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      showNotification(CONFIG.MESSAGES.SUCCESS.AVIS_AJOUTE, "success");
      this.form.reset();
      await this.loadNotations();
    } catch (error) {
      showNotification(
        error.message || CONFIG.MESSAGES.ERROR.NOTATION_ERREUR,
        "error"
      );
    }
  }

  async loadNotations(conducteurId = null) {
    try {
      const url = new URL(`${CONFIG.API_URL}/notation.php`);
      if (conducteurId) url.searchParams.append("conducteur_id", conducteurId);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      this.displayNotations(data.data.notations);
      this.displayStats(data.data.stats);
    } catch (error) {
      showNotification(error.message, "error");
    }
  }

  displayNotations(notations) {
    if (!this.container) return;

    if (!notations.length) {
      this.container.innerHTML =
        '<p class="info-message">Aucun avis pour le moment</p>';
      return;
    }

    this.container.innerHTML = notations
      .map((notation) => this.createNotationHTML(notation))
      .join("");
  }

  displayStats(stats) {
    if (!this.statsContainer || !stats) return;

    this.statsContainer.innerHTML = `
            <div class="stat-card">
                <i class="fas fa-star"></i>
                <h3>Note moyenne</h3>
                <p class="stat-value">${
                  stats.note_moyenne?.toFixed(1) || "0.0"
                }</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-comment"></i>
                <h3>Nombre d'avis</h3>
                <p class="stat-value">${stats.total_avis || 0}</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-thumbs-up"></i>
                <h3>Avis positifs</h3>
                <p class="stat-value">${stats.avis_positifs || 0}</p>
            </div>
        `;
  }

  createNotationHTML(notation) {
    const date = new Date(notation.date_avis).toLocaleDateString("fr-FR");

    return `
            <div class="notation-card">
                <div class="notation-header">
                    <div class="notation-user">
                        <strong>${notation.evaluateur_prenom} ${
      notation.evaluateur_nom
    }</strong>
                        <span class="notation-date">${date}</span>
                    </div>
                    <div class="notation-score">
                        ${this.generateStars(notation.note)}
                    </div>
                </div>
                <div class="notation-voyage">
                    <i class="fas fa-route"></i>
                    <span>${notation.lieu_depart} → ${
      notation.lieu_arrivee
    }</span>
                </div>
                <p class="notation-comment">${notation.commentaire}</p>
            </div>
        `;
  }

  generateStars(note) {
    return Array.from(
      { length: 5 },
      (_, i) => `<i class="fas fa-star${i < note ? " active" : ""}"></i>`
    ).join("");
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  new NotationManager();
});
