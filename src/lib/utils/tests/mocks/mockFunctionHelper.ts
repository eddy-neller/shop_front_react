import { vi } from "vitest";
import { parseISO, formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { filesize } from "filesize";

vi.mock("@/utils/helper.ts", () => ({
  coupeMot: vi.fn((str: string, length: number = 20) => {
    const regex = new RegExp(`([^ ]{${length}})`, "g");
    return str.replace(regex, "$1 ");
  }),
  supRepLettre: vi.fn((str: string, limit: number = 7) => {
    const regex = new RegExp(`(.)\\1{${limit},}`, "g");
    return str.replace(regex, "$1");
  }),
  diffForHumans: vi.fn((date: string, locale: string = "en") => {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;

    if (locale === "fr") {
      return formatDistanceToNow(parsedDate, { addSuffix: true, locale: fr });
    }

    return formatDistanceToNow(parsedDate, { addSuffix: true, locale: enUS });
  }),
  formatFileSize: vi.fn((octets: number) => {
    return filesize(octets, { locale: "fr", round: 2, base: 2 }) as string;
  }),
  truncate: vi.fn((text: string, chars: number = 25) => {
    if (text.length <= chars) {
      return text;
    }

    text = text.slice(0, chars + 1);

    const lastSpaceIndex = text.lastIndexOf(" ");
    if (lastSpaceIndex !== -1) {
      text = text.slice(0, lastSpaceIndex);
    }

    return text + "...";
  }),
  formatDate: vi.fn(
    (
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

      return new Date(date).toLocaleDateString(
        locale,
        options || defaultOptions
      );
    }
  ),
}));
