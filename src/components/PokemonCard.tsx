import Image from "next/image";

interface PokemonCardProps {
  id: number;
  koreanName: string;
  englishName: string;
  description: string;
  types: string[];
}

const TYPE_KO: Record<string, string> = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  grass: "풀",
  electric: "전기",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  dark: "악",
  steel: "강철",
  fairy: "페어리",
};

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-300 text-gray-700",
  fire: "bg-orange-400 text-white",
  water: "bg-blue-400 text-white",
  grass: "bg-green-400 text-white",
  electric: "bg-yellow-300 text-yellow-800",
  ice: "bg-cyan-300 text-cyan-800",
  fighting: "bg-red-500 text-white",
  poison: "bg-purple-400 text-white",
  ground: "bg-amber-500 text-white",
  flying: "bg-indigo-300 text-indigo-800",
  psychic: "bg-pink-400 text-white",
  bug: "bg-lime-400 text-lime-800",
  rock: "bg-stone-400 text-white",
  ghost: "bg-violet-500 text-white",
  dragon: "bg-blue-600 text-white",
  dark: "bg-neutral-700 text-white",
  steel: "bg-slate-400 text-white",
  fairy: "bg-rose-300 text-rose-800",
};

export default function PokemonCard({
  id,
  koreanName,
  englishName,
  description,
  types,
}: PokemonCardProps) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-yellow-100">
      <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-600 text-xs font-bold px-2 py-0.5 rounded-full">
        #{String(id).padStart(3, "0")}
      </div>
      <div className="bg-yellow-50 flex items-center justify-center pt-10 pb-4 px-4">
        <Image
          src={imageUrl}
          alt={koreanName}
          width={120}
          height={120}
          className="drop-shadow-md group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="font-bold text-lg leading-tight">{koreanName}</p>
        <p className="text-gray-400 text-sm mb-2">{englishName}</p>
        <div className="flex gap-1 flex-wrap mb-2">
          {types.map((type) => (
            <span
              key={type}
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[type] ?? "bg-gray-200 text-gray-600"}`}
            >
              {TYPE_KO[type] ?? type}
            </span>
          ))}
        </div>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}
