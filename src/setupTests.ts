import React from "react";
import { beforeEach, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { configure as domConfigure } from "@testing-library/dom";
import i18n from "@/i18n";

globalThis.React = React;

beforeEach(() => {
  vi.clearAllMocks();
});

beforeEach(async () => {
  localStorage.setItem("i18nextLng", "en");
  await i18n.changeLanguage("en");
});

afterEach(() => {
  cleanup();
});

// Mock global scrollTo for jsdom environment
globalThis.scrollTo = vi.fn();

// Mock global URL.createObjectURL for previewing in tests
globalThis.URL.createObjectURL = vi.fn(() => "mocked-image-url");

// Mock window.matchMedia for components that read media preferences in jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Supprimer totalement le dump du DOM
domConfigure({
  getElementError: (message) => {
    const raw = String(message ?? "");
    // Remove everything after the roles section if present
    const trimmed = raw.replace(
      /\n\nHere are the accessible roles:[\s\S]*$/m,
      ""
    );
    // Keep just the first line (usually “Unable to find …”)
    const firstLine = trimmed.split("\n")[0].trim() || "Testing Library error";
    const err = new Error(firstLine);
    // Optionally also trim the stack so Vitest prints only one line
    err.stack = firstLine;
    return err;
  },
});
