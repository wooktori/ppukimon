import Image from "next/image";

interface PokemonCardProps {
  id: number;
  koreanName: string;
  englishName: string;
  description: string;
}

export default function PokemonCard({
  id,
  koreanName,
  englishName,
  description,
}: PokemonCardProps) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="absolute top-3 left-3 bg-gray-100 text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">
        #{String(id).padStart(3, "0")}
      </div>
      <div className="bg-gray-50 flex items-center justify-center pt-10 pb-4 px-4">
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
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}
