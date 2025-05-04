import { showNotification } from "./notifications.js";

export class TripHistory {
  constructor() {
    this.container = document.getElementById("trips-history");
    this.init();
  }

  async init() {
    await this.loadTripHistory();
  }

  async loadTripHistory() {
    try {
      const response = await fetch(
        "../../backend/history/get_trip_history.php"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.displayTrips(data);
    } catch (error) {
      showNotification(`Erreur: ${error.message}`, "error");
    }
  }

  displayTrips(trips) {
    if (!trips.length) {
      this.container.innerHTML =
        '<p class="no-trips">Aucun voyage dans votre historique</p>';
      return;
    }
    this.container.innerHTML = trips
      .map((trip) => this.createTripHTML(trip))
      .join("");
  }

  createTripHTML(trip) {
    return `
            <div class="trip" id="trip-${trip.id}">
                <h3>Trajet du ${this.formatDate(trip.date)}</h3>
                <p><i class="fas fa-map-marker-alt"></i> <strong>De:</strong> ${
                  trip.departure
                }</p>
                <p><i class="fas fa-map-marker"></i> <strong>À:</strong> ${
                  trip.destination
                }</p>
                <p><i class="fas fa-user"></i> <strong>Chauffeur:</strong> ${
                  trip.driver
                }</p>
                <p><i class="fas fa-euro-sign"></i> <strong>Prix:</strong> ${
                  trip.price
                } €</p>
                <button class="cancel-trip" onclick="tripHistory.cancelTrip(${
                  trip.id
                })">
                    <i class="fas fa-times"></i> Annuler
                </button>
            </div>
        `;
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

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}

// Initialisation
const tripHistory = new TripHistory();
window.tripHistory = tripHistory; // Pour l'accès global
