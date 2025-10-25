import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Button } from "@/components/ui/button";
const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1)
        return null;
    const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1);
    const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1);
    return (_jsxs("div", { className: "flex justify-center items-center gap-4 mt-8", children: [_jsx(Button, { onClick: handlePrev, disabled: currentPage === 1, children: "Prev" }), _jsxs("span", { children: ["Page ", currentPage, " of ", totalPages] }), _jsx(Button, { onClick: handleNext, disabled: currentPage === totalPages, children: "Next" })] }));
});
export default Pagination;
