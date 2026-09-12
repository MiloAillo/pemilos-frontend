import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "../ui/card";
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
  // Hitung persentase untuk progress bar
  const votedPercentage = voterStats
    ? Math.round((voterStats.voted / voterStats.total) * 100)
    : 0;
  const notVotedPercentage = voterStats
    ? Math.round((voterStats.notVoted / voterStats.total) * 100)
    : 0;

  return (
    <div className="my-4">
      {isFetchVoterStatsFailed ? (
        // Error state
        <div className="flex items-center gap-3 justify-center w-full text-center py-8 text-yellow-500">
          <p className="text-sm">
            Gagal memuat data partisipasi
          </p>
          <RefreshCw className="p-1 hover:bg-gray-700 rounded transition-colors" onClick={onRetryVoterStats} size={24} />
        </div>
      ) : !voterStats ? (
        // Loading state
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">Memuat data partisipasi...</p>
        </div>
      ) : (
        // Normal state: tampilkan statistik
        <>
          {/* Progress bar dua warna */}
          <div className="w-full h-20 flex rounded-lg overflow-hidden border border-gray-700">
            {/* Bagian kiri: Sudah memilih (hijau) */}
            <div
              className="bg-green-600 flex items-center justify-center px-4 text-white font-semibold transition-all duration-300"
              style={{ width: `${votedPercentage}%` }}
            >
              {votedPercentage >= 10 &&                
                <div className="text-center">
                  <p className="text-sm">Sudah Memilih</p>
                  <p className="text-lg font-bold">
                    {voterStats.voted} ({votedPercentage}%)
                  </p>
                </div>
              }
            </div>

            {/* Bagian kanan: Belum memilih (abu-abu) */}
            <div
              className="bg-gray-600 flex items-center justify-center px-4 text-white font-semibold transition-all duration-300"
              style={{ width: `${notVotedPercentage}%` }}
            >
              {notVotedPercentage >= 10 &&
                <div className="text-center">
                  <p className="text-sm">Belum Memilih</p>
                  <p className="text-lg font-bold">
                    {voterStats.notVoted} ({notVotedPercentage}%)
                  </p>
                </div>
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VoterParticipation;
