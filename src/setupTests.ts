import React from "react";
import { beforeEach, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { configure as domConfigure } from "@testing-library/dom";

globalThis.React = React;

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

// Mock global scrollTo for jsdom environment
global.scrollTo = vi.fn();

// Mock global URL.createObjectURL for previewing in tests
global.URL.createObjectURL = vi.fn(() => "mocked-image-url");

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
