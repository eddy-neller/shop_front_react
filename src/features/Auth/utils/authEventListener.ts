/**
 * Gestion centralisée de l'event listener pour les déconnexions automatiques
 * L'event listener est créé lors de la connexion et supprimé lors de la déconnexion
 */

type LogoutHandler = (reason?: string) => void;

let eventListener: ((event: Event) => void) | null = null;
let isListenerActive = false;

/**
 * Crée l'event listener pour écouter les événements auth:logout
 * @param handler - Fonction à appeler lors de la réception de l'événement
 */
export function setupAuthLogoutListener(handler: LogoutHandler): void {
  // Éviter les doublons
  if (isListenerActive) {
    return;
  }

  const onAuthLogout = (event: Event) => {
    const reason = (event as CustomEvent<{ reason?: string }>).detail?.reason;
    handler(reason);
  };

  window.addEventListener("auth:logout", onAuthLogout);
  eventListener = onAuthLogout;
  isListenerActive = true;
}

/**
 * Supprime l'event listener pour les événements auth:logout
 */
export function removeAuthLogoutListener(): void {
  if (eventListener && isListenerActive) {
    window.removeEventListener("auth:logout", eventListener);
    eventListener = null;
    isListenerActive = false;
  }
}

/**
 * Vérifie si l'event listener est actif
 */
export function isAuthLogoutListenerActive(): boolean {
  return isListenerActive;
}
