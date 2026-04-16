import { unstable_cache } from "next/cache";

export const getPokemonWithKo = unstable_cache(
  async (url: string) => {
    const id = url.split("/").filter(Boolean).pop()!;
    const [detail, species] = await Promise.all([
      fetch(url).then((r) => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`).then((r) => r.json()),
    ]);

    const koName =
      species.names.find(
        (n: { language: { name: string }; name: string }) => n.language.name === "ko"
      )?.name || detail.name;

    const koDescription =
      species.flavor_text_entries
        .find(
          (e: { language: { name: string }; flavor_text: string }) =>
            e.language.name === "ko"
        )
        ?.flavor_text.replace(/\n|\f/g, " ") || "설명이 없습니다.";

    return {
      id: detail.id as number,
      englishName: detail.name as string,
      koreanName: koName as string,
      description: koDescription as string,
      types: (detail.types as { type: { name: string } }[]).map((t) => t.type.name),
    };
  },
  ["pokemon-detail"],
  { revalidate: 86400 }
);
