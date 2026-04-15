import PokemonCard from "@/components/PokemonCard";

async function getPokemonWithKo(url: string) {
  const detail = await fetch(url).then((res) => res.json());
  const species = await fetch(detail.species.url).then((res) => res.json());

  const koName =
    species.names.find((n: { language: { name: string }; name: string }) => n.language.name === "ko")?.name ||
    detail.name;

  const koDescription =
    species.flavor_text_entries
      .find((entry: { language: { name: string }; flavor_text: string }) => entry.language.name === "ko")
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

export default async function Home() {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  );
  const data = await res.json();

  const pokemons = await Promise.all(
    data.results.map((p: { url: string }) => getPokemonWithKo(p.url))
  );

  return (
    <>
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
      </section>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-yellow-900">
            전체 포켓몬
          </h3>
          <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full font-medium">
            {pokemons.length}마리
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {pokemons.map((p) => (
            <PokemonCard
              key={p.id}
              id={p.id}
              koreanName={p.koreanName}
              englishName={p.englishName}
              description={p.description}
              types={p.types}
            />
          ))}
        </div>
      </main>
    </>
  );
}
