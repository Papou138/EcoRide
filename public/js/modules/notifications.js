export class NotificationManager {
  constructor() {
    this.container = this.createNotificationContainer();
  }

  createNotificationContainer() {
    const container = document.createElement("div");
    container.id = "notification-container";
    container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
      `;
    document.body.appendChild(container);
    return container;
  }

  show(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
          <div class="notification-content">
              ${message}
              <button class="notification-close">&times;</button>
          </div>
      `;

    // Ajoute la notification au conteneur
    this.container.appendChild(notification);

    // Suppression automatique après 5 secondes
    setTimeout(() => this.remove(notification), 5000);

    // Gestion du bouton de fermeture
    const closeButton = notification.querySelector(".notification-close");
    closeButton.addEventListener("click", () => this.remove(notification));
  }

  remove(notification) {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 300);
  }
}

// Création de l'instance globale
const notificationManager = new NotificationManager();

// Export des méthodes pour utilisation globale
export function showNotification(message, type) {
  notificationManager.show(message, type);
}
