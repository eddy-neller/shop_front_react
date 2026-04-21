import { formatDistanceToNow, parseISO } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { filesize } from "filesize";

const diffForHumans = (
  date: string | Date,
  locale: "fr" | "en" = "en"
): string => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;

  if (locale === "fr") {
    return formatDistanceToNow(parsedDate, { addSuffix: true, locale: fr });
  }

  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: enUS });
};

const truncate = (
  text: string | undefined | null,
  chars: number = 25
): string => {
  if (!text) return "";
  if (text.length <= chars) {
    return text;
  }

  text = text.slice(0, chars + 1);

  const lastSpaceIndex = text.lastIndexOf(" ");
  if (lastSpaceIndex !== -1) {
    text = text.slice(0, lastSpaceIndex);
  }

  return text + "...";
};

const supRepLettre = (
  str: string | undefined | null,
  limit: number = 7
): string => {
  if (!str) return "";
  const regex = new RegExp(`(.)\\1{${limit},}`, "g");
  return str.replace(regex, "$1");
};

const coupeMot = (
  str: string | undefined | null,
  length: number = 20
): string => {
  if (!str) return "";
  const regex = new RegExp(`([^ ]{${length}})`, "g");
  return str.replace(regex, "$1 ");
};

const formatFileSize = (octets: number): string => {
  return filesize(octets, { locale: "fr", round: 2, base: 2 }) as string;
};

const formatDate = (
  date: string,
  locale: string = "en-US",
  showTime: boolean = true,
  options?: Intl.DateTimeFormatOptions
) => {
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

  return new Date(date).toLocaleDateString(locale, options || defaultOptions);
};

export {
  truncate,
  diffForHumans,
  supRepLettre,
  coupeMot,
  formatFileSize,
  formatDate,
};
