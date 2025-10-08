import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = React.memo(
  ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1);
    const handleNext = () =>
      currentPage < totalPages && onPageChange(currentPage + 1);

    return (
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button onClick={handlePrev} disabled={currentPage === 1}>
          Prev
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    );
  }
);

export default Pagination;
