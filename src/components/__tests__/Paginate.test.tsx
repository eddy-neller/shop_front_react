import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Paginate from "@/components/Paginate";

describe("Paginate", () => {
  const onPageChange = vi.fn();

  const setup = (
    pageCount: number,
    currentPage: number,
    overrides?: Partial<{
      previousLabel: string;
      nextLabel: string;
      className: string;
    }>
  ) => {
    return render(
      <Paginate
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={onPageChange}
        {...overrides}
      />
    );
  };

  it("ne rend rien si pageCount <= 1", () => {
    const { container } = setup(1, 1);
    expect(container).toBeEmptyDOMElement();
  });

  it("ne rend rien si pageCount vaut 0", () => {
    const { container } = setup(0, 1);
    expect(container).toBeEmptyDOMElement();
  });

  it("rend la navigation de pagination si pageCount > 1", () => {
    setup(3, 1);
    expect(screen.getByRole("navigation", { name: /pagination/i })).toBeInTheDocument();
  });

  it("affiche les labels Previous et Next par défaut", () => {
    setup(3, 1);
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("affiche les labels personnalisés previousLabel et nextLabel", () => {
    setup(3, 1, { previousLabel: "Précédent", nextLabel: "Suivant" });
    expect(screen.getByText("Précédent")).toBeInTheDocument();
    expect(screen.getByText("Suivant")).toBeInTheDocument();
  });

  it("rend toutes les pages si pageCount <= 7", () => {
    setup(5, 1);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole("link", { name: `Page ${i}` })).toBeInTheDocument();
    }
  });

  it("marque la page courante comme active (aria-current=page)", () => {
    setup(5, 3);
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("désactive le bouton Previous sur la première page", () => {
    setup(5, 1);
    const prev = screen.getByText("Previous").closest("a");
    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(prev).toHaveClass("pointer-events-none", "opacity-50");
  });

  it("désactive le bouton Next sur la dernière page", () => {
    setup(5, 5);
    const next = screen.getByText("Next").closest("a");
    expect(next).toHaveAttribute("aria-disabled", "true");
    expect(next).toHaveClass("pointer-events-none", "opacity-50");
  });

  it("appelle onPageChange avec la page suivante au clic sur Next", async () => {
    setup(5, 2);
    await userEvent.click(screen.getByText("Next").closest("a")!);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("appelle onPageChange avec la page précédente au clic sur Previous", async () => {
    setup(5, 3);
    await userEvent.click(screen.getByText("Previous").closest("a")!);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("appelle onPageChange avec le numéro de page cliqué", async () => {
    setup(5, 1);
    await userEvent.click(screen.getByRole("link", { name: "Page 4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("n'appelle pas onPageChange si la page cliquée est déjà active", async () => {
    setup(5, 3);
    await userEvent.click(screen.getByRole("link", { name: "Page 3" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("n'appelle pas onPageChange sur Previous quand page = 1", async () => {
    setup(5, 1);
    await userEvent.click(screen.getByText("Previous").closest("a")!);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("n'appelle pas onPageChange sur Next quand page = dernière", async () => {
    setup(5, 5);
    await userEvent.click(screen.getByText("Next").closest("a")!);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  describe("getPageItems — ellipsis et troncature", () => {
    it("affiche ellipsis-end et la dernière page quand currentPage <= 4 (pageCount > 7)", () => {
      setup(10, 2);
      const links = screen.getAllByRole("link", { name: /Page \d+/ });
      const pageNumbers = links.map((l) => Number(l.textContent));
      expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 10]);
      expect(screen.getAllByText("More pages")).toHaveLength(1);
    });

    it("affiche ellipsis-start et la première page quand currentPage >= pageCount - 3 (pageCount > 7)", () => {
      setup(10, 8);
      const links = screen.getAllByRole("link", { name: /Page \d+/ });
      const pageNumbers = links.map((l) => Number(l.textContent));
      expect(pageNumbers).toEqual([1, 6, 7, 8, 9, 10]);
      expect(screen.getAllByText("More pages")).toHaveLength(1);
    });

    it("affiche deux ellipsis en milieu de pagination (pageCount > 7)", () => {
      setup(15, 8);
      const links = screen.getAllByRole("link", { name: /Page \d+/ });
      const pageNumbers = links.map((l) => Number(l.textContent));
      expect(pageNumbers).toEqual([1, 7, 8, 9, 15]);
      expect(screen.getAllByText("More pages")).toHaveLength(2);
    });
  });
});
