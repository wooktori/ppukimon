import { Suspense } from "react";
import ReactDOM from "react-dom";
import SearchBar from "@/components/SearchBar";
import TypeFilter from "@/components/TypeFilter";
import PokemonGrid from "@/components/PokemonGrid";
import PokemonCard from "@/components/PokemonCard";
import Loading from "@/app/loading";
import { getPokemonWithKo } from "@/lib/pokemon";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string; type?: string }>;
}) {
  const { page: pageParam, query: queryParam, type: typeParam } = await searchParams;
  const query = queryParam?.trim() ?? "";
  const activeType = typeParam?.trim() ?? "";
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  // 기본 1페이지(검색·타입 필터 없음)에서만 첫 카드를 초기 HTML에 포함
  const isDefaultFirst = !query && !activeType && currentPage === 1;

  let firstPokemon = null;
  if (isDefaultFirst) {
    firstPokemon = await getPokemonWithKo("https://pokeapi.co/api/v2/pokemon/1/");
    const firstImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png`;
    // LCP 이미지 URL을 <head>에 preload 힌트로 삽입 (브라우저가 스트리밍 전에 다운로드 시작)
    ReactDOM.preload(firstImageUrl, { as: "image", fetchPriority: "high" });
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
        <>
          {/* 첫 번째 카드: 초기 HTML에 포함 → LCP 이미지를 즉시 발견 가능 */}
          <div className="max-w-5xl mx-auto px-4 pt-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-yellow-900">전체 포켓몬</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              <PokemonCard {...firstPokemon} priority={true} />
            </div>
          </div>
          {/* 나머지 19장: Suspense로 스트리밍 */}
          <Suspense fallback={<Loading hideHeader hideFirst />}>
            <PokemonGrid
              query={query}
              activeType={activeType}
              currentPage={currentPage}
              hideFirst={true}
            />
          </Suspense>
        </>
      ) : (
        <Suspense fallback={<Loading />}>
          <PokemonGrid query={query} activeType={activeType} currentPage={currentPage} />
        </Suspense>
      )}
    </>
  );
}
