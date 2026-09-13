import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { VoterStatsType } from "@/schemas/voterStats.schema";

interface VoterParticipationProps {
  voterStats: VoterStatsType | null;
  isFetchVoterStatsFailed: boolean;
  onRetryVoterStats: () => void;
}

/**
 * Komponen untuk menampilkan statistik partisipasi pemilih
 * Menampilkan total pemilih, jumlah yang sudah memilih, dan yang belum memilih
 * Visualisasi menggunakan progress bar dengan dua warna
 */
const VoterParticipation = ({
  voterStats,
  isFetchVoterStatsFailed,
  onRetryVoterStats,
}: VoterParticipationProps) => {
  const votedRef = useRef<HTMLDivElement>(null);
  const notVotedRef = useRef<HTMLDivElement>(null);
  const [showVotedText, setShowVotedText] = useState(false);
  const [showNotVotedText, setShowNotVotedText] = useState(false);

  // Hitung persentase untuk progress bar
  const votedPercentage = voterStats
    ? Math.round((voterStats.voted / voterStats.total) * 100)
    : 0;
  const notVotedPercentage = voterStats
    ? Math.round((voterStats.notVoted / voterStats.total) * 100)
    : 0;

  useEffect(() => {
    const checkTextFit = () => {
      if (votedRef.current) {
        const textContainer = votedRef.current.querySelector('[data-text-content]');
        if (textContainer) {
          const containerWidth = votedRef.current.clientWidth;
          const textWidth = (textContainer as HTMLElement).scrollWidth;
          const SAFETY_MARGIN = 20;
          setShowVotedText(textWidth + SAFETY_MARGIN <= containerWidth);
        }
      }

      if (notVotedRef.current) {
        const textContainer = notVotedRef.current.querySelector('[data-text-content]');
        if (textContainer) {
          const containerWidth = notVotedRef.current.clientWidth;
          const textWidth = (textContainer as HTMLElement).scrollWidth;
          const SAFETY_MARGIN = 20;
          setShowNotVotedText(textWidth + SAFETY_MARGIN <= containerWidth);
        }
      }
    };

    checkTextFit();

    window.addEventListener('resize', checkTextFit);
    return () => window.removeEventListener('resize', checkTextFit);
  }, [voterStats]);

  return (
    <div className="my-6">
      {isFetchVoterStatsFailed ? (
        // Error state
        <div className="flex items-center gap-4 justify-center w-full py-10 px-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-base font-semibold text-yellow-400">
            Gagal memuat data partisipasi
          </p>
          <button
            onClick={onRetryVoterStats}
            className="p-2 hover:bg-yellow-500/20 rounded-lg transition-all duration-200 hover:scale-110"
            title="Coba lagi"
          >
            <RefreshCw className="text-yellow-400" size={20} strokeWidth={2.5} />
          </button>
        </div>
      ) : !voterStats ? (
        // Loading state
        <div className="text-center py-10 text-white/40">
          <p className="text-base font-medium animate-pulse">Memuat data partisipasi...</p>
        </div>
      ) : (
        // Normal state: tampilkan statistik
        <>
          {/* Progress bar dua warna dengan visual hierarchy yang kuat */}
          <div className="w-full h-24 flex rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
            {/* Bagian kiri: Sudah memilih (biru - matching chart colors) */}
            <div
              ref={votedRef}
              className="bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center px-6 text-white transition-all duration-500 relative group"
              style={{ width: `${votedPercentage}%` }}
            >
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-sky-400/0 group-hover:bg-sky-400/10 transition-colors duration-300" />
              
              <div 
                data-text-content
                className={`text-center relative z-10 transition-opacity duration-300 ${
                  showVotedText ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-100 mb-1 whitespace-nowrap">
                  Sudah Memilih
                </p>
                <p className="text-2xl font-bold text-white drop-shadow-lg whitespace-nowrap">
                  {voterStats.voted}
                  <span className="pl-  1 text-sm font-bold text-sky-50 mt-0.5 whitespace-nowrap">
                    ({votedPercentage}%)
                  </span>
                </p>
              </div>
            </div>

            {/* Bagian kanan: Belum memilih (abu-abu netral) */}
            <div
              ref={notVotedRef}
              className="bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center px-6 text-white transition-all duration-500 relative group"
              style={{ width: `${notVotedPercentage}%` }}
            >
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-slate-500/0 group-hover:bg-slate-500/10 transition-colors duration-300" />
              
              <div 
                data-text-content
                className={`text-center relative z-10 transition-opacity duration-300 ${
                  showNotVotedText ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1 whitespace-nowrap">
                  Belum Memilih
                </p>
                <p className="text-2xl font-bold text-white drop-shadow-lg whitespace-nowrap">
                  {voterStats.notVoted}
                  <span className="pl-1 text-sm font-bold text-slate-100 mt-0.5">
                    ({notVotedPercentage}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VoterParticipation;
