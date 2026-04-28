const toast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

vi.mock("sonner", async () => {
  const original = await vi.importActual<typeof import("sonner")>("sonner");

  return {
    ...original,
    toast,
  };
});

export { toast };
