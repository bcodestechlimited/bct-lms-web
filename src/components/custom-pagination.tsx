import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { JSX, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

interface PaginationProps {
  pagination: {
    totalCount: number;
    filteredCount: number;
    totalPages: number;
    limit: number;
    page: number;
  };
}

export default function CustomPagination({ pagination }: PaginationProps) {
  const { totalPages, page = 1, limit = 10 } = pagination;
  const [searchParams, setSearchParams] = useSearchParams();

  // Ensure URL params are only updated when necessary
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let needsUpdate = false;

    if (!params.has("page") || params.get("page") !== page.toString()) {
      params.set("page", page.toString());
      needsUpdate = true;
    }
    if (!params.has("limit") || params.get("limit") !== limit.toString()) {
      params.set("limit", limit.toString());
      needsUpdate = true;
    }

    if (needsUpdate) setSearchParams(params);
  }, [page, limit, searchParams, setSearchParams]);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setSearchParams((prev: URLSearchParams) => {
      const params = new URLSearchParams(prev);
      params.set("page", newPage.toString());
      return params;
    });
  };

  // Memoize page number rendering
  const pageNumbers = useMemo(() => {
    const pages: JSX.Element[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
            aria-label={`Go to page ${i}`}
            aria-disabled={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <Pagination className="my-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        {pageNumbers}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
