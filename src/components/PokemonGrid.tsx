import { getPokemonWithKo } from "@/lib/pokemon";
import PokemonCard from "@/components/PokemonCard";
import Pagination from "@/components/Pagination";
import koNames from "@/data/ko-names.json";

const LIMIT = 20;

async function fetchList(currentPage: number) {
  const offset = (currentPage - 1) * LIMIT;
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`,
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  const pokemons = await Promise.all(
    data.results.map((p: { url: string }) => getPokemonWithKo(p.url))
  );
  return { pokemons, total: data.count, totalPages: Math.ceil(data.count / LIMIT) };
}

async function fetchByType(typeName: string, currentPage: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`, {
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  const allUrls = (data.pokemon as { pokemon: { url: string } }[])
    .map((p) => p.pokemon.url)
    .filter((url) => {
      const id = parseInt(url.split("/").filter(Boolean).pop() ?? "0");
      return id >= 1 && id <= 1025;
    });
  const offset = (currentPage - 1) * LIMIT;
  const pokemons = await Promise.all(
    allUrls.slice(offset, offset + LIMIT).map((url) => getPokemonWithKo(url))
  );
  return { pokemons, total: allUrls.length, totalPages: Math.ceil(allUrls.length / LIMIT) };
}

async function fetchByQuery(query: string) {
  const trimmed = query.trim();
  if (/^\d+$/.test(trimmed)) {
    try {
      return [await getPokemonWithKo(`https://pokeapi.co/api/v2/pokemon/${trimmed}/`)];
    } catch {
      return [];
    }
  }
  if (/[가-힣]/.test(trimmed)) {
    const matches = Object.entries(koNames as Record<string, number>)
      .filter(([name]) => name.includes(trimmed))
      .slice(0, 20);
    return Promise.all(
      matches.map(([, id]) => getPokemonWithKo(`https://pokeapi.co/api/v2/pokemon/${id}/`))
    );
  }
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000", {
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  const matches = (data.results as { name: string; url: string }[])
    .filter((p) => p.name.includes(trimmed.toLowerCase()))
    .slice(0, 20);
  return Promise.all(matches.map((p) => getPokemonWithKo(p.url)));
}

interface PokemonGridProps {
  query: string;
  activeType: string;
  currentPage: number;
  hideFirst?: boolean;
}

export default async function PokemonGrid({
  query,
  activeType,
  currentPage,
  hideFirst = false,
}: PokemonGridProps) {
  const gridClass = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5";

  if (query) {
    const pokemons = await fetchByQuery(query);
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-yellow-900">&quot;{query}&quot; 검색 결과</h3>
          <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full font-medium">
            {pokemons.length}마리
          </span>
        </div>
        {pokemons.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-bold text-yellow-800 mb-1">포켓몬을 찾을 수 없어요</p>
            <p className="text-sm text-gray-400">이름 또는 도감 번호로 다시 검색해보세요.</p>
          </div>
        ) : (
          <div className={gridClass}>
            {pokemons.map((p, i) => <PokemonCard key={p.id} {...p} priority={i < 4} />)}
          </div>
        )}
      </main>
    );
  }

  if (activeType) {
    const { pokemons, total, totalPages } = await fetchByType(activeType, currentPage);
    const offset = (currentPage - 1) * LIMIT;
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-yellow-900">타입 필터 결과</h3>
          <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full font-medium">
            {offset + 1}~{Math.min(offset + LIMIT, total)} / {total}마리
          </span>
        </div>
        <div className={gridClass}>
          {pokemons.map((p, i) => <PokemonCard key={p.id} {...p} priority={i < 4} />)}
        </div>
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} activeType={activeType} />
        )}
      </main>
    );
  }

  const offset = (currentPage - 1) * LIMIT;
  const { pokemons, total, totalPages } = await fetchList(currentPage);
  const visiblePokemons = hideFirst ? pokemons.slice(1) : pokemons;
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-yellow-900">전체 포켓몬</h3>
        <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full font-medium">
          {offset + 1}~{Math.min(offset + LIMIT, total)} / {total.toLocaleString()}마리
        </span>
      </div>
      <div className={gridClass}>
        {visiblePokemons.map((p, i) => (
          <PokemonCard key={p.id} {...p} priority={!hideFirst && i < 4} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </main>
  );
}
