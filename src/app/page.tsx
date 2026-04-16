import { Suspense } from "react";
import ReactDOM from "react-dom";
import SearchBar from "@/components/SearchBar";
import TypeFilter from "@/components/TypeFilter";
import PokemonGrid, {
  PokemonRestCards,
  PokemonDefaultCountBadge,
  PokemonDefaultPagination,
} from "@/components/PokemonGrid";
import PokemonCard from "@/components/PokemonCard";
import Loading, { SkeletonCard } from "@/app/loading";
import { getPokemonWithKo, getPokemonImageUrl } from "@/lib/pokemon";

const gridClass = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string; type?: string }>;
}) {
  const { page: pageParam, query: queryParam, type: typeParam } = await searchParams;
  const query = queryParam?.trim() ?? "";
  const activeType = typeParam?.trim() ?? "";
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  const isDefaultFirst = !query && !activeType && currentPage === 1;

  let firstPokemon = null;
  if (isDefaultFirst) {
    firstPokemon = await getPokemonWithKo("https://pokeapi.co/api/v2/pokemon/1/");
    ReactDOM.preload(getPokemonImageUrl(1), { as: "image", fetchPriority: "high" });
  }

  return (
    <>
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

      {isDefaultFirst && firstPokemon ? (
        // 첫 카드를 초기 HTML에 포함하고, 나머지 19장을 같은 그리드 안 Suspense로 스트리밍
        // → 브라우저가 LCP 이미지를 즉시 발견, 레이아웃도 끊김 없이 채워짐
        <main className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-yellow-900">전체 포켓몬</h3>
            <Suspense
              fallback={<div className="h-7 w-24 bg-yellow-100 rounded-full animate-pulse" />}
            >
              <PokemonDefaultCountBadge currentPage={currentPage} />
            </Suspense>
          </div>
          <div className={gridClass}>
            <PokemonCard {...firstPokemon} priority={true} />
            <Suspense
              fallback={
                <>{Array.from({ length: 19 }).map((_, i) => <SkeletonCard key={i} />)}</>
              }
            >
              <PokemonRestCards currentPage={currentPage} />
            </Suspense>
          </div>
          <Suspense fallback={null}>
            <PokemonDefaultPagination currentPage={currentPage} />
          </Suspense>
        </main>
      ) : (
        <Suspense fallback={<Loading />}>
          <PokemonGrid query={query} activeType={activeType} currentPage={currentPage} />
        </Suspense>
      )}
    </>
  );
}
