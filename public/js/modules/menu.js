// Fonction pour initialiser le menu
// Cette fonction est appelée lorsque le DOM est complètement chargé
// et que le script est exécuté
// Elle ajoute un écouteur d'événements au bouton de menu et gère les sous-menus
export function initialiserMenu() {
  const menuButton = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const dropdowns = document.querySelectorAll(".dropdown");

  // Gestion du menu hamburger
  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      // Changement de l'icône du menu
      toggleMenuIcon(menuButton); // Appel de la fonction pour changer l'icône du menu
    });
  }

  // Gestion des dropdowns sur mobile
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");

    if (toggle) {
      toggle.addEventListener("click", (e) => {
        // Empeche la navigation sur mobile
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation(); // Empêche la propagation de l'événement

          // Fermer les autres dropdowns
          dropdowns.forEach((other) => {
            if (other !== dropdown) {
              other.classList.remove("active");
            }
          });

          // Ouvrir/fermer le dropdown actuel
          dropdown.classList.toggle("active");
        }
      });
    }
  });

  // Fermer le menu si on clique en dehors
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#main-nav") && !e.target.closest("#menu-toggle")) {
      mainNav?.classList.remove("active");

      if (menuButton) {
        menuButton.classList.remove("active");
        // Réinitialiser l'icone du menu
        const spans = menuButton.getElementsByTagName("span");
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });
}

// Fonction pour changer l'icône du menu hamburger
// Cette fonction est appelée lorsque le bouton de menu est cliqué
function toggleMenuIcon(button) {
  const spans = button.getElementsByTagName("span");
  button.classList.toggle("active");

  if (button.classList.contains("active")) {
    spans[0].style.transform = "rotate(-45deg) translate(-5px, 6px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(45deg) translate(-5px, -6px)";
  } else {
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown-toggle");

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = dropdown.parentElement;
        parent.classList.toggle("active");
      }
    });
  });
});
