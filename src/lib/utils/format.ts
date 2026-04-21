/**
 * Supprime les répétitions de lettres dans une chaîne
 * @param str - La chaîne à traiter
 * @param limit - Nombre maximum de répétitions autorisées (défaut: 7)
 * @returns La chaîne avec les répétitions supprimées
 */
export function supRepLettre(
  str: string | undefined | null,
  limit: number = 7
): string {
  if (!str) return "";
  const regex = new RegExp(`(.)\\1{${limit},}`, "g");
  return str.replace(regex, "$1");
}

/**
 * Coupe les mots trop longs en ajoutant des espaces
 * @param str - La chaîne à traiter
 * @param length - Longueur maximale d'un mot avant coupure (défaut: 20)
 * @returns La chaîne avec les mots coupés
 */
export function coupeMot(
  str: string | undefined | null,
  length: number = 20
): string {
  if (!str) return "";
  const regex = new RegExp(`([^ ]{${length}})`, "g");
  return str.replace(regex, "$1 ");
}

/**
 * Formate une date selon la locale spécifiée
 * @param date - La date à formater (string ou Date)
 * @param locale - La locale à utiliser (défaut: "fr-FR")
 * @param showTime - Afficher l'heure (défaut: true)
 * @param options - Options supplémentaires pour le formatage
 * @returns La date formatée
 */
export function formatDate(
  date: string | Date,
  locale: string = "fr-FR",
  showTime: boolean = true,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const defaultOptions: Intl.DateTimeFormatOptions = showTime
    ? {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    : {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

  return dateObj.toLocaleDateString(locale, options || defaultOptions);
}
