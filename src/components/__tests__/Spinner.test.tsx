import { render, screen } from "@testing-library/react";
import Spinner from "@/components/Spinner";

interface SpinnerProps {
  loading: boolean;
  fullscreen?: boolean;
  message?: string;
  size?: number;
  color?: string;
  backdrop?: boolean;
  className?: string;
}

describe("Spinner", () => {
  const setup = (props: SpinnerProps) => render(<Spinner {...props} />);

  it("ne rend rien si loading est false", () => {
    const { container } = setup({ loading: false });
    expect(container).toBeEmptyDOMElement();
  });

  it("rend le conteneur avec les attributs ARIA quand loading est true", () => {
    setup({ loading: true });
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-busy", "true");
  });

  it("affiche le message de chargement par défaut", () => {
    setup({ loading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("affiche un message personnalisé", () => {
    setup({ loading: true, message: "Traitement en cours…" });
    expect(screen.getByText("Traitement en cours…")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("applique une className supplémentaire sur le conteneur", () => {
    setup({ loading: true, className: "my-custom-class" });
    expect(screen.getByRole("status")).toHaveClass("my-custom-class");
  });

  it("applique la taille personnalisée au spinner", () => {
    const { container } = setup({ loading: true, size: 32 });
    const spinner = container.querySelector('[role="presentation"]');
    expect(spinner).toHaveStyle({ width: "32px", height: "32px" });
  });

  it("applique la couleur personnalisée au spinner", () => {
    const { container } = setup({ loading: true, color: "rgb(255, 0, 0)" });
    const spinner = container.querySelector('[role="presentation"]');
    expect(spinner).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  describe("mode standard (non fullscreen)", () => {
    it("n'affiche pas de backdrop même si backdrop=true", () => {
      setup({ loading: true, backdrop: true });
      expect(document.body.querySelector("div[aria-hidden='true']")).not.toBeInTheDocument();
    });

    it("applique la classe min-h sur le conteneur", () => {
      setup({ loading: true });
      expect(screen.getByRole("status")).toHaveClass("min-h-[40vh]");
    });
  });

  describe("mode fullscreen", () => {
    it("utilise un portail vers document.body", () => {
      setup({ loading: true, fullscreen: true });
      expect(document.body.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it("applique la classe fixed inset-0 sur le conteneur", () => {
      setup({ loading: true, fullscreen: true });
      expect(document.body.querySelector('[role="status"]')).toHaveClass(
        "fixed",
        "inset-0"
      );
    });

    it("affiche le backdrop par défaut", () => {
      setup({ loading: true, fullscreen: true });
      expect(
        document.body.querySelector("div[aria-hidden='true']")
      ).toBeInTheDocument();
    });

    it("masque le backdrop quand backdrop=false", () => {
      setup({ loading: true, fullscreen: true, backdrop: false });
      expect(
        document.body.querySelector("div[aria-hidden='true']")
      ).not.toBeInTheDocument();
    });
  });
});
