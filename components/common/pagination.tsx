import React from "react";
import { twMerge } from "tailwind-merge";

type PaginatonProps = {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  className?: string;
};

function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
  className,
}: PaginatonProps) {
  function getShownContent(): (string | number)[] {
    if (totalPages < 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage < 5 && totalPages > 5) {
      const num = Array.from({ length: 4 }, (_, i) => i + 1);
      return [...num, "...", totalPages];
    }

    if (currentPage > totalPages - 3) {
      const endValues = Array.from({ length: 4 }, (_, i) => totalPages + i - 3);
      return [1, "...", ...endValues];
    }
    const remainingValues: number[] = [];
    for (let i = currentPage - 1; i < currentPage + 2; i++) {
      remainingValues.push(i);
    }
    return [1, "...", ...remainingValues, "...", totalPages];
  }

  return (
    <div
      className={twMerge(
        "flex items-center justify-center gap-1 py-2",
        className,
      )}
    >
      {/* Prev */}
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 text-stone-400 text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
      >
        ‹
      </button>

      {/* Pages */}
      {getShownContent().map((item, index) =>
        item === "..." ? (
          <span
            key={index}
            className="w-8 h-8 flex items-center justify-center text-stone-300 text-sm select-none"
          >
            ···
          </span>
        ) : (
          <button
            key={index}
            onClick={() => setCurrentPage(item as number)}
            className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm transition-all cursor-pointer ${
              currentPage === item
                ? "bg-amber-500 text-white border border-amber-500 shadow-sm"
                : "border border-stone-200 text-stone-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50"
            }`}
            style={
              currentPage === item
                ? { fontFamily: "var(--font-playfair)" }
                : undefined
            }
          >
            {item}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 text-stone-400 text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
      >
        ›
      </button>
    </div>
  );
}

export default Pagination;
