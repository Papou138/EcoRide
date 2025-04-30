// Fonction pour initialiser le menu
// Cette fonction est appelée lorsque le DOM est complètement chargé
// et que le script est exécuté
// Elle ajoute un écouteur d'événements au bouton de menu et gère les sous-menus
export function initialiserMenu() {
  const menuButton = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const dropdowns = document.querySelectorAll(".dropdown");

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      toggleMenuIcon(menuButton);
    });
  }

  // Gestion des dropdowns sur mobile
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", (e) => {
        // Empeche la navigation sur mobile
        if (window.innerWidth <= 768) {
          e.preventDefault();
          menu.classList.toggle("active");

          // Fermer les autres menus
          dropdowns.forEach((otherDropdown) => {
            if (otherDropdown !== dropdown) {
              const otherMenu = otherDropdown.querySelector(".dropdown-menu");
              if (otherMenu) {
                otherMenu.classList.remove("active");
              }
            }
          });
        }
      });
    }
  });

  // Fermer les menus si on clique en dehors
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("active");
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
