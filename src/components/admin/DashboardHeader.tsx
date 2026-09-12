import { Lock, RefreshCw, Unlock } from "lucide-react";

interface DashboardHeaderProps {
  currentTime: Date;
  voteStatus: boolean | null;
  isFetchVoteStatusFailed: boolean;
  onRetryVoteStatus: () => void;
}

/**
 * Dashboard header component displaying real-time clock and voting status
 * Left side: Live clock in WIB timezone
 * Right side: Voting status indicator (open/closed)
 */
const DashboardHeader = ({
  currentTime,
  voteStatus,
  isFetchVoteStatusFailed,
  onRetryVoteStatus,
}: DashboardHeaderProps) => {
  // Format waktu dalam zona WIB (UTC+7)
  const formatTimeWIB = (date: Date): string => {
    return date.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).replace(/\./g, ':');
  };

  return (
    <div className="flex gap-6 mb-8 px-1 justify-between items-center">
      {/* Real-time clock - Primary focal point */}
      <div className="flex items-baseline gap-3">
        <p className="text-5xl font-bold tracking-tight text-white">
          {formatTimeWIB(currentTime)}
        </p>
        <span className="text-lg font-medium text-white/60 tracking-wide">
          WIB
        </span>
      </div>

      {isFetchVoteStatusFailed ? (
        // Error state: gagal mengambil status
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-yellow-500/15 border border-yellow-500/30">
          <span className="text-yellow-400 text-sm font-semibold">
            Gagal Mengambil Status Voting
          </span>
          <button
            onClick={onRetryVoteStatus}
            className="p-1.5 hover:bg-yellow-500/20 rounded-md transition-all duration-200 hover:scale-110"
            title="Coba lagi"
          >
            <RefreshCw size={16} className="text-yellow-400" />
          </button>
        </div>
      ) : voteStatus === null ? (
        // Loading state
        <span className="text-white/40 text-sm font-medium animate-pulse">
          Memuat status...
        </span>
      ) : (
        // Normal state: tampilkan status voting
        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-lg border-2 ${
          voteStatus 
            ? "bg-emerald-500/10 border-emerald-500/35" 
            : "bg-red-500/10 border-red-500/35"
        }`}>
          {voteStatus ? (
            <Unlock className="text-emerald-400" size={24} strokeWidth={2.5} />
          ) : (
            <Lock className="text-red-400" size={24} strokeWidth={2.5} />
          )}
          <span
            className={`text-base font-bold tracking-wide ${
              voteStatus ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {voteStatus ? "Pemilihan Dibuka" : "Pemilihan Ditutup"}
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
