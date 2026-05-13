import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginateProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  previousLabel?: string;
  nextLabel?: string;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(pageCount: number, currentPage: number): PageItem[] {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  if (pageCount <= 7) {
    return pages;
  }

  if (currentPage <= 4) {
    return [...pages.slice(0, 5), "ellipsis-end", pageCount];
  }

  if (currentPage >= pageCount - 3) {
    return [1, "ellipsis-start", ...pages.slice(pageCount - 5)];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    pageCount,
  ];
}

export default function Paginate({
  pageCount,
  currentPage,
  onPageChange,
  className,
  previousLabel = "Previous",
  nextLabel = "Next",
}: PaginateProps) {
  if (pageCount <= 1) {
    return null;
  }

  const activePage = Math.min(Math.max(currentPage, 1), pageCount);
  const pageItems = getPageItems(pageCount, activePage);

  const handlePageChange = (page: number) => {
    if (page === activePage || page < 1 || page > pageCount) {
      return;
    }

    onPageChange(page);
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href="#"
            size="default"
            aria-disabled={activePage === 1}
            className={cn(
              "gap-1 pl-2.5",
              activePage === 1 && "pointer-events-none opacity-50"
            )}
            onClick={(event) => {
              event.preventDefault();
              handlePageChange(activePage - 1);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{previousLabel}</span>
          </PaginationLink>
        </PaginationItem>

        {pageItems.map((item) => (
          <PaginationItem key={item}>
            {typeof item === "number" ? (
              <PaginationLink
                href="#"
                isActive={item === activePage}
                aria-label={`Page ${item}`}
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            href="#"
            size="default"
            aria-disabled={activePage === pageCount}
            className={cn(
              "gap-1 pr-2.5",
              activePage === pageCount && "pointer-events-none opacity-50"
            )}
            onClick={(event) => {
              event.preventDefault();
              handlePageChange(activePage + 1);
            }}
          >
            <span>{nextLabel}</span>
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
