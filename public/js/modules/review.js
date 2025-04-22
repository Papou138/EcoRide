// Fonctions pour gérer les avis et problèmes
export function approveReview(reviewId) {
  // Simuler l'approbation de l'avis
  alert("L'avis a été approuvé avec succès !");
  // Supprimer l'élément de la liste (simulation)
  document.getElementById(`review-${reviewId}`).remove();
}

export function rejectReview(reviewId) {
  // Simuler le rejet de l'avis
  alert("L'avis a été rejeté avec succès !");
  // Supprimer l'élément de la liste (simulation)
  document.getElementById(`review-${reviewId}`).remove();
}

export function resolveIssue(issueId) {
  // Simuler la résolution du problème
  alert("Le problème a été résolu avec succès !");
  // Supprimer l'élément de la liste (simulation)
  document.getElementById(`issue-${issueId}`).remove();
}
