import { showNotification } from "./notifications.js";

export class TripHistory {
  constructor() {
    this.container = document.getElementById("trips-history");
    this.container = document.getElementById("srtatistiques");
    this.init();
  }

  async init() {
    this.initialiserFilters();
    await this.loadTripHistory();
  }

  async loadTripHistory() {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch("../../backend/history.php", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.displayStats(data.data.statistiques);
      this.displayTrips(
        data.data.voyages_conducteur,
        data.data.voyages_passager
      );
    } catch (error) {
      showNotification(`Erreur: ${error.message}`, "error");
    }
  }

  displayStats(stats) {
    if (!this.statsContainer) return;

    const formatter = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    });

    this.statsContainer.innerHTML = `
            <div class="stat-card">
                <i class="fas fa-route"></i>
                <h3>Total Trajets</h3>
                <p class="stat-value">${
                  stats.conducteur.total_voyages + stats.passager.total_voyages
                }</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <h3>Passagers transportés</h3>
                <p class="stat-value">${
                  stats.conducteur.total_passagers || 0
                }</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-euro-sign"></i>
                <h3>Revenus totaux</h3>
                <p class="stat-value">${formatter.format(
                  stats.conducteur.revenus_totaux || 0
                )}</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-leaf"></i>
                <h3>CO₂ évité</h3>
                <p class="stat-value">${stats.impact_environnemental.emissions_evitees.toFixed(
                  2
                )} kg</p>
            </div>
        `;
  }

  displayTrips(voyagesConducteur, voyagesPassager) {
    const conducteurContainer = document.getElementById("voyages-conducteur");
    const passagerContainer = document.getElementById("voyages-passager");

    if (conducteurContainer) {
      conducteurContainer.innerHTML = voyagesConducteur.length
        ? voyagesConducteur
            .map((voyage) => this.createTripHTML(voyage, "conducteur"))
            .join("")
        : '<p class="no-trips">Aucun voyage en tant que conducteur</p>';
    }

    if (passagerContainer) {
      passagerContainer.innerHTML = voyagesPassager.length
        ? voyagesPassager
            .map((voyage) => this.createTripHTML(voyage, "passager"))
            .join("")
        : '<p class="no-trips">Aucun voyage en tant que passager</p>';
    }
  }

  createTripHTML(voyage, type) {
    const date = this.formatDate(voyage.date_depart);

    return `
            <div class="history-card" id="voyage-${voyage.id}">
                <div class="history-header">
                    <div class="trajet-info">
                        <h3><i class="fas fa-map-marker-alt"></i> ${
                          voyage.lieu_depart
                        } → ${voyage.lieu_arrivee}</h3>
                        <span class="date">${date}</span>
                    </div>
                    <span class="role ${type}">${
      type === "conducteur" ? "Conducteur" : "Passager"
    }</span>
                </div>
                <div class="history-details">
                    ${
                      type === "conducteur"
                        ? `
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <span>${voyage.nombre_passagers} passagers</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-euro-sign"></i>
                            <span>${voyage.revenus_totaux}€ gagnés</span>
                        </div>
                    `
                        : `
                        <div class="detail-item">
                            <i class="fas fa-user"></i>
                            <span>Conducteur: ${voyage.conducteur_prenom} ${voyage.conducteur_nom}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-euro-sign"></i>
                            <span>${voyage.montant_total}€ payés</span>
                        </div>
                    `
                    }
                    <div class="detail-item">
                        <i class="fas fa-leaf"></i>
                        <span>${this.calculateCO2(
                          voyage.distance_km
                        )} kg CO₂ économisés</span>
                    </div>
                </div>
                <div class="history-actions">
                    <button class="btn btn-secondary" onclick="tripHistory.showDetails(${
                      voyage.id
                    })">
                        <i class="fas fa-info-circle"></i> Détails
                    </button>
                </div>
            </div>
        `;
  }

  initialiserFilters() {
    const filterForm = document.querySelector(".filters-form");
    if (!filterForm) return;

    filterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const filters = {
        dateDebut: document.getElementById("date-debut").value,
        dateFin: document.getElementById("date-fin").value,
        type: document.getElementById("type-trajet").value,
      };
      await this.applyFilters(filters);
    });
  }

  async applyFilters(filters) {
    // Implémenter la logique de filtrage ici
    console.log("Filtres appliqués:", filters);
    await this.loadTripHistory(filters);
  }

  calculateCO2(distance) {
    // Calcul simplifié : 120g CO2/km en moyenne
    return (distance * 0.12 || 0).toFixed(1);
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  async showDetails(voyageId) {
    // À implémenter : affichage des détails du voyage
    console.log("Affichage des détails du voyage:", voyageId);
  }

  async cancelTrip(tripId) {
    try {
      const response = await fetch("../../backend/history/cancel_trip.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
            .content,
        },
        body: JSON.stringify({ tripId }),
      });

      const data = await response.json();
      if (data.success) {
        document.getElementById(`trip-${tripId}`).remove();
        showNotification("Voyage annulé avec succès", "success");
      } else {
        throw new Error(data.message || "Erreur lors de l'annulation");
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  }
}

// Initialisation
const tripHistory = new TripHistory();
window.tripHistory = tripHistory; // Pour l'accès global
