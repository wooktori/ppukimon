import PokemonCard from "@/components/PokemonCard";

async function getPokemonWithKo(url: string) {
  const detail = await fetch(url).then((res) => res.json());
  const species = await fetch(detail.species.url).then((res) => res.json());

  const koName =
    species.names.find((n: any) => n.language.name === "ko")?.name ||
    detail.name;

  const koDescription =
    species.flavor_text_entries
      .find((entry: any) => entry.language.name === "ko")
      ?.flavor_text.replace(/\n|\f/g, " ") || "설명이 없습니다.";

  return {
    id: detail.id,
    englishName: detail.name,
    koreanName: koName,
    description: koDescription,
  };
}

export default async function Home() {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  );
  const data = await res.json();

  const pokemons = await Promise.all(
    data.results.map((p: any) => getPokemonWithKo(p.url))
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pokemons.map((p) => (
          <PokemonCard
            key={p.id}
            id={p.id}
            koreanName={p.koreanName}
            englishName={p.englishName}
            description={p.description}
          />
        ))}
      </div>
    </main>
  );
}
