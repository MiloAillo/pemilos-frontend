import { Check } from "lucide-react";

export function osisImage(number: number): string {
  if (number === 1) return "Rafif-1-cUHUsNgs.png";
  if (number === 2) return "Zahra-2-DLpGzRhv.png";
  if (number === 3) return "Laily-3-B7kQfHLV.png";
  return "";
}

interface OsisCardProps {
  id: string;
  name: string;
  number: number;
  osisVoteHandler: (id: string) => void;
  osisValue: string | null;
}

const OsisCard = ({
  id,
  name,
  number,
  osisVoteHandler,
  osisValue,
}: OsisCardProps) => {
  const selected = osisValue === id;

  return (
    <button
      type="button"
      onClick={() => osisVoteHandler(id)}
      aria-pressed={selected}
      className={`relative flex flex-col w-full h-fit rounded-2xl pt-2 px-2 pb-0 overflow-hidden transition transform ease-in active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer ${
        selected
          ? "ring-2 ring-amber-300 shadow-[0_0_24px_rgba(252,211,77,0.35)] bg-gradient-to-b from-[#3a3f5c] to-[#1d2233]"
          : "ring-1 ring-white/10 hover:ring-amber-200/50 bg-gradient-to-b from-[#232741] to-[#161A20]"
      }`}
    >
      <span className="absolute top-2 left-2 z-10 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-200 text-amber-950 font-bodoni font-black text-base sm:text-lg">
        {number}
      </span>
      {selected && (
        <span className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-amber-300 text-amber-950">
          <Check size={18} strokeWidth={3} />
        </span>
      )}
      <p className="text-center font-semibold text-xl sm:text-2xl italic bg-[linear-gradient(224deg,#82B9C8_-14.26%,#648F9A_140.15%)] bg-clip-text text-transparent pt-1">
        {name}
      </p>
      <img src={`/assets/${osisImage(number)}`} alt={name} />
    </button>
  );
};

export default OsisCard;
