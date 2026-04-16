import Image from "next/image";
import Link from "next/link";
import { TYPE_KO, TYPE_COLORS, STAT_KO, STAT_COLORS } from "@/lib/pokemon-types";
import { getPokemonDetail, getPokemonImageUrl } from "@/lib/pokemon";

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pokemon = await getPokemonDetail(id);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-yellow-700 hover:text-yellow-900 text-sm font-medium mb-8 transition-colors"
      >
        ← 목록으로
      </Link>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-yellow-100">
        <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 flex flex-col items-center pt-10 pb-6 px-6 relative">
          <span className="absolute top-4 left-5 bg-yellow-200 text-yellow-700 text-sm font-bold px-3 py-1 rounded-full">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          <Image
            src={getPokemonImageUrl(pokemon.id)}
            alt={pokemon.koreanName}
            width={200}
            height={200}
            className="drop-shadow-xl"
            priority
          />
          <h1 className="text-3xl font-extrabold text-yellow-900 mt-4">
            {pokemon.koreanName}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{pokemon.englishName}</p>
          <div className="flex gap-2 mt-3">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`text-sm font-semibold px-3 py-1 rounded-full ${TYPE_COLORS[type] ?? "bg-gray-200 text-gray-600"}`}
              >
                {TYPE_KO[type] ?? type}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-600 text-sm leading-relaxed">{pokemon.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-yellow-600 font-semibold mb-1">키</p>
              <p className="text-lg font-bold text-yellow-900">
                {(pokemon.height / 10).toFixed(1)} m
              </p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-yellow-600 font-semibold mb-1">몸무게</p>
              <p className="text-lg font-bold text-yellow-900">
                {(pokemon.weight / 10).toFixed(1)} kg
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-yellow-900 mb-3">기본 스탯</h2>
            <div className="space-y-3">
              {pokemon.stats.map((s) => (
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
