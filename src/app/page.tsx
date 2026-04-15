// app/page.tsx

import Image from "next/image";

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
    imageUrl: detail.sprites.front_default,
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">포켓몬 리스트 (한국어)</h1>
      <ul className="grid grid-cols-2 gap-4">
        {pokemons.map((p) => (
          <li key={p.id} className="border p-3 rounded bg-gray-50">
            <Image src={p.imageUrl} alt={p.koreanName} width={80} height={80} />
            <div className="mt-2 font-bold">
              {p.koreanName} ({p.englishName})
            </div>
            <p className="text-sm text-gray-600 mt-1">{p.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
