import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import TypeFilter from "@/components/TypeFilter";
import PokemonGrid from "@/components/PokemonGrid";
import Loading from "@/app/loading";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string; type?: string }>;
}) {
  const { page: pageParam, query: queryParam, type: typeParam } = await searchParams;
  const query = queryParam?.trim() ?? "";
  const activeType = typeParam?.trim() ?? "";
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  return (
    <>
      {/* 히어로 섹션: 데이터 없이 즉시 렌더링 → TTFB 단축 */}
      <section className="bg-gradient-to-b from-yellow-200 to-yellow-50 py-12 px-4 text-center">
        <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-2">
          Pokémon Encyclopedia
        </p>
        <h2 className="text-4xl font-extrabold text-yellow-900 mb-3">뿌끼몬 도감</h2>
        <p className="text-yellow-700 text-base max-w-md mx-auto">
          포켓몬의 이름, 타입, 설명을 한눈에 확인해보세요.
        </p>
        <SearchBar initialQuery={query} />
        {!query && <TypeFilter activeType={activeType} />}
      </section>

      {/* 포켓몬 목록: Suspense로 스트리밍 */}
      <Suspense fallback={<Loading />}>
        <PokemonGrid query={query} activeType={activeType} currentPage={currentPage} />
      </Suspense>
    </>
  );
}
