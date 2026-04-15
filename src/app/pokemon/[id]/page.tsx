import Image from "next/image";
import Link from "next/link";
import { TYPE_KO, TYPE_COLORS } from "@/lib/pokemon-types";

const STAT_KO: Record<string, string> = {
  hp: "HP",
  attack: "공격",
  defense: "방어",
  "special-attack": "특수공격",
  "special-defense": "특수방어",
  speed: "스피드",
};

const STAT_COLORS: Record<string, string> = {
  hp: "bg-red-400",
  attack: "bg-orange-400",
  defense: "bg-yellow-400",
  "special-attack": "bg-blue-400",
  "special-defense": "bg-green-400",
  speed: "bg-pink-400",
};

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const detail = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
    (r) => r.json()
  );
  const species = await fetch(detail.species.url).then((r) => r.json());

  const koName =
    species.names.find(
      (n: { language: { name: string }; name: string }) =>
        n.language.name === "ko"
    )?.name || detail.name;

  const koDescription =
    species.flavor_text_entries
      .find(
        (e: { language: { name: string }; flavor_text: string }) =>
          e.language.name === "ko"
      )
      ?.flavor_text.replace(/\n|\f/g, " ") || "설명이 없습니다.";

  const types: string[] = detail.types.map(
    (t: { type: { name: string } }) => t.type.name
  );

  const stats: { name: string; value: number }[] = detail.stats.map(
    (s: { stat: { name: string }; base_stat: number }) => ({
      name: s.stat.name,
      value: s.base_stat,
    })
  );

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${detail.id}.png`;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-yellow-700 hover:text-yellow-900 text-sm font-medium mb-8 transition-colors"
      >
        ← 목록으로
      </Link>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-yellow-100">
        {/* 이미지 영역 */}
        <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 flex flex-col items-center pt-10 pb-6 px-6 relative">
          <span className="absolute top-4 left-5 bg-yellow-200 text-yellow-700 text-sm font-bold px-3 py-1 rounded-full">
            #{String(detail.id).padStart(3, "0")}
          </span>
          <Image
            src={imageUrl}
            alt={koName}
            width={200}
            height={200}
            className="drop-shadow-xl"
            priority
          />
          <h1 className="text-3xl font-extrabold text-yellow-900 mt-4">
            {koName}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{detail.name}</p>
          <div className="flex gap-2 mt-3">
            {types.map((type) => (
              <span
                key={type}
                className={`text-sm font-semibold px-3 py-1 rounded-full ${TYPE_COLORS[type] ?? "bg-gray-200 text-gray-600"}`}
              >
                {TYPE_KO[type] ?? type}
              </span>
            ))}
          </div>
        </div>

        {/* 정보 영역 */}
        <div className="p-6 space-y-6">
          {/* 설명 */}
          <p className="text-gray-600 text-sm leading-relaxed">{koDescription}</p>

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-yellow-600 font-semibold mb-1">키</p>
              <p className="text-lg font-bold text-yellow-900">
                {(detail.height / 10).toFixed(1)} m
              </p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-yellow-600 font-semibold mb-1">몸무게</p>
              <p className="text-lg font-bold text-yellow-900">
                {(detail.weight / 10).toFixed(1)} kg
              </p>
            </div>
          </div>

          {/* 스탯 */}
          <div>
            <h2 className="text-base font-bold text-yellow-900 mb-3">기본 스탯</h2>
            <div className="space-y-3">
              {stats.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20 shrink-0 text-right">
                    {STAT_KO[s.name] ?? s.name}
                  </span>
                  <span className="text-sm font-bold text-gray-700 w-8 text-right shrink-0">
                    {s.value}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${STAT_COLORS[s.name] ?? "bg-gray-400"}`}
                      style={{ width: `${Math.min((s.value / 255) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
