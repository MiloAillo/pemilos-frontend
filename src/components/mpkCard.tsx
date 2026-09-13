import { Check } from "lucide-react";

export function mpkImage(number: number): string {
  if (number === 1) return "Alden-1-aF0LkwjD.png";
  if (number === 2) return "Seva-2-CaMTsY6Q.png";
  if (number === 3) return "Attaya-3-B4QiY6bf.png";
  return "";
}

interface MpkCardProps {
  id: string;
  name: string;
  number: number;
  mpkVoteHandler: (id: string) => void;
  mpkValue: string | null;
}

const MpkCard = ({
  id,
  name,
  number,
  mpkVoteHandler,
  mpkValue,
}: MpkCardProps) => {
  const selected = mpkValue === id;

  return (
    <button
      type="button"
      onClick={() => mpkVoteHandler(id)}
      aria-pressed={selected}
      className={`relative flex flex-col w-full h-fit rounded-2xl pt-2 px-2 pb-0 overflow-hidden transition transform ease-in active:scale-99 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer ${
        selected
          ? "ring-2 ring-amber-300 shadow-[0_0_24px_rgba(252,211,77,0.35)] bg-gradient-to-b from-[#5c2f2f] to-[#2a1d1a]"
          : "ring-1 ring-white/10 hover:ring-amber-200/50 bg-gradient-to-b from-[#412323] to-[#201816]"
      }`}
    >
      <span className="absolute top-2 left-2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-amber-200 text-amber-950 font-bodoni font-black text-lg">
        {number}
      </span>
      {selected && (
        <span className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-amber-300 text-amber-950">
          <Check size={18} strokeWidth={3} />
        </span>
      )}
      <p className="text-center font-semibold text-2xl italic bg-[linear-gradient(224deg,#E58C8C_-14.26%,#A47272_140.15%)] bg-clip-text text-transparent pt-1">
        {name}
      </p>
      <img src={`/assets/${mpkImage(number)}`} alt={name} />
    </button>
  );
};

export default MpkCard;
