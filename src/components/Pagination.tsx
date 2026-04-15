import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  activeType?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function pageHref(page: number, activeType?: string) {
  const params = new URLSearchParams();
  if (activeType) params.set("type", activeType);
  params.set("page", String(page));
  return `?${params.toString()}`;
}

export default function Pagination({ currentPage, totalPages, activeType }: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 mt-12">
      <Link
        href={pageHref(currentPage - 1, activeType)}
        aria-disabled={currentPage <= 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage <= 1
            ? "pointer-events-none text-yellow-300"
            : "text-yellow-700 hover:bg-yellow-100"
        }`}
      >
        ← 이전
      </Link>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-yellow-400 text-sm">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(p, activeType)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-yellow-400 text-yellow-900 font-bold shadow-sm"
                : "text-yellow-700 hover:bg-yellow-100"
            }`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={pageHref(currentPage + 1, activeType)}
        aria-disabled={currentPage >= totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage >= totalPages
            ? "pointer-events-none text-yellow-300"
            : "text-yellow-700 hover:bg-yellow-100"
        }`}
      >
        다음 →
      </Link>
    </nav>
  );
}
