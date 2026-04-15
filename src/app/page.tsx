import PokemonCard from "@/components/PokemonCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";

const LIMIT = 20;

async function getPokemonWithKo(url: string) {
  const detail = await fetch(url).then((res) => res.json());
  const species = await fetch(detail.species.url).then((res) => res.json());

  const koName =
    species.names.find(
      (n: { language: { name: string }; name: string }) =>
        n.language.name === "ko"
    )?.name || detail.name;

  const koDescription =
    species.flavor_text_entries
      .find(
        (entry: { language: { name: string }; flavor_text: string }) =>
          entry.language.name === "ko"
      )
      ?.flavor_text.replace(/\n|\f/g, " ") || "설명이 없습니다.";

  const types: string[] = detail.types.map(
    (t: { type: { name: string } }) => t.type.name
  );

  return {
    id: detail.id,
    englishName: detail.name,
    koreanName: koName,
    description: koDescription,
    types,
  };
}

async function searchPokemon(query: string) {
  const trimmed = query.toLowerCase();

  if (/^\d+$/.test(trimmed)) {
    try {
      return [await getPokemonWithKo(`https://pokeapi.co/api/v2/pokemon/${trimmed}/`)];
    } catch {
      return [];
    }
  }

  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0",
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  const matches = (data.results as { name: string; url: string }[]).filter((p) =>
    p.name.includes(trimmed)
  );

  return Promise.all(matches.slice(0, 20).map((p) => getPokemonWithKo(p.url)));
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const { page: pageParam, query: queryParam } = await searchParams;
  const query = queryParam?.trim() ?? "";

  const hero = (
    <section className="bg-gradient-to-b from-yellow-200 to-yellow-50 py-12 px-4 text-center">
      <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-2">
        Pokémon Encyclopedia
      </p>
      <h2 className="text-4xl font-extrabold text-yellow-900 mb-3">
        뿌끼몬 도감
      </h2>
      <p className="text-yellow-700 text-base max-w-md mx-auto">
        포켓몬의 이름, 타입, 설명을 한눈에 확인해보세요.
      </p>
      <SearchBar initialQuery={query} />
    </section>
  );

  if (query) {
    const pokemons = await searchPokemon(query);
    return (
      <>
        {hero}
        <main className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-yellow-900">
              &quot;{query}&quot; 검색 결과
            </h3>
            <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full font-medium">
              {pokemons.length}마리
            </span>
          </div>
          {pokemons.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-bold text-yellow-800 mb-1">
                포켓몬을 찾을 수 없어요
              </p>
              <p className="text-sm">영문명 또는 도감 번호로 다시 검색해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {pokemons.map((p) => (
                <PokemonCard key={p.id} {...p} />
              ))}
            </div>
          )}
        </main>
      </>
    );
  }

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (currentPage - 1) * LIMIT;

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
  );
  const data = await res.json();
  const totalPages = Math.ceil(data.count / LIMIT);

  const pokemons = await Promise.all(
    data.results.map((p: { url: string }) => getPokemonWithKo(p.url))
  );

  return (
    <>
      {hero}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-yellow-900">전체 포켓몬</h3>
          <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full font-medium">
            {offset + 1}~{Math.min(offset + LIMIT, data.count)} /{" "}
            {data.count.toLocaleString()}마리
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {pokemons.map((p) => (
            <PokemonCard key={p.id} {...p} />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </main>
    </>
  );
}
