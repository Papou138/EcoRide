class TripHistory {
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
        "../php/controllers/history/get_trip_history.php"
      );
      const data = await response.json();
      this.displayTrips(data);
    } catch (error) {
      this.showError("Erreur lors du chargement de l'historique");
    }
  }

  displayTrips(trips) {
    this.container.innerHTML = trips
      .map((trip) => this.createTripHTML(trip))
      .join("");
  }

  createTripHTML(trip) {
    return `
          <div class="trip" data-trip-id="${trip.id}">
              <h3>Trajet du ${this.formatDate(trip.date)}</h3>
              <p><strong>De :</strong> ${trip.departure}</p>
              <p><strong>À :</strong> ${trip.destination}</p>
              <p><strong>Chauffeur :</strong> ${trip.driver}</p>
              <p><strong>Prix :</strong> ${trip.price} €</p>
              <button onclick="tripHistory.cancelTrip(${
                trip.id
              })">Annuler</button>
          </div>
      `;
  }

  async cancelTrip(tripId) {
    if (!confirm("Êtes-vous sûr de vouloir annuler ce voyage ?")) return;

    try {
      const response = await fetch(
        "../php/controllers/history/cancel_trip.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripId }),
        }
      );
      const result = await response.json();

      if (result.success) {
        await this.loadTripHistory();
        this.showSuccess("Voyage annulé avec succès");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      this.showError("Erreur lors de l'annulation du voyage");
    }
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  showError(message) {
    // Utilise le système de notification global
    if (window.showNotification) {
      window.showNotification(message, "error");
    } else {
      alert(message);
    }
  }

  showSuccess(message) {
    if (window.showNotification) {
      window.showNotification(message, "success");
    }
  }
}

// Initialisation
const tripHistory = new TripHistory();
