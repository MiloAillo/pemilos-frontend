import type { Dispatch } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

export interface SelectedCandidate {
  org: "OSIS" | "MPK";
  name: string;
  number: number;
  image: string;
  summary: string;
}

interface ConfirmationProps {
  osis: SelectedCandidate | null;
  mpk: SelectedCandidate | null;
  vote: () => void;
  setConfirmation: Dispatch<React.SetStateAction<boolean>>;
  isSent: boolean;
  isVoteNotAllowed: boolean;
  isNotAuthorized: boolean;
  submitError: string | null;
}

const SummaryRow = ({ candidate }: { candidate: SelectedCandidate }) => (
  <div className="flex gap-2.5 sm:gap-3 items-start rounded-xl border border-white/10 bg-white/[0.06] p-2.5 sm:p-3">
    <img
      src={`/assets/${candidate.image}`}
      alt={candidate.name}
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover object-top shrink-0"
    />
    <div className="min-w-0">
      <p className="font-bodoni font-bold text-[15px] sm:text-base text-amber-100">
        {candidate.number}. {candidate.name}
        <span className="ml-2 text-xs font-sans font-semibold uppercase tracking-widest text-amber-200/60">
          {candidate.org}
        </span>
      </p>
      <p className="text-[13px] sm:text-sm text-white/80 mt-1">{candidate.summary}</p>
      <a
        href={`/#${candidate.org}-${candidate.number}`}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-amber-200 underline underline-offset-2 hover:text-amber-100"
      >
        Lihat lengkap di katalog
      </a>
    </div>
  </div>
);

const Confirmation = ({
  osis,
  mpk,
  vote,
  setConfirmation,
  isSent,
  isVoteNotAllowed,
  isNotAuthorized,
  submitError,
}: ConfirmationProps) => {
  return (
    <div
      onClick={() => {
        if (!isSent) setConfirmation(false);
      }}
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-3 sm:p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1c1f2b] w-full max-w-lg max-h-[85vh] overflow-y-auto h-fit p-4 sm:p-6 rounded-2xl border border-amber-200/25 flex flex-col gap-3 sm:gap-4 shadow-2xl"
      >
        <div>
          <p className="font-bodoni font-black text-lg sm:text-2xl text-amber-100 uppercase">
            Konfirmasi Pilihanmu
          </p>
          <p className="text-[13px] sm:text-sm text-white/60 mt-1">
            Pastikan pilihanmu sudah sesuai. Suara tidak dapat diubah setelah
            dikirim.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {osis && <SummaryRow candidate={osis} />}
          {mpk && <SummaryRow candidate={mpk} />}
        </div>

        {(isVoteNotAllowed || isNotAuthorized || submitError) && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border-2 border-red-500/60 bg-red-500/15 p-4"
          >
            <TriangleAlert
              className="text-red-400 shrink-0 mt-0.5"
              size={22}
              strokeWidth={2.5}
            />
            <div className="text-sm font-semibold text-red-100">
              {isVoteNotAllowed && <p>Tidak diperbolehkan untuk vote.</p>}
              {isNotAuthorized && (
                <p>Token tidak valid, silakan login ulang.</p>
              )}
              {submitError && <p>{submitError}</p>}
            </div>
          </div>
        )}

        <div className="flex flex-row gap-3">
          <button
            onClick={() => setConfirmation(false)}
            disabled={isSent}
            className="flex-1 text-center rounded-lg p-2 sm:p-2.5 text-sm sm:text-base font-semibold border border-white/20 text-white hover:bg-white/10 transition disabled:opacity-40"
          >
            Sebentar
          </button>
          <button
            disabled={isSent}
            onClick={() => vote()}
            className="flex-1 flex items-center justify-center gap-2 text-center rounded-lg p-2 sm:p-2.5 text-sm sm:text-base font-bodoni font-bold uppercase tracking-widest bg-amber-200 text-amber-950 hover:bg-amber-100 transition disabled:opacity-60"
          >
            {isSent && <Loader2 size={18} className="animate-spin" />}
            {isSent ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
