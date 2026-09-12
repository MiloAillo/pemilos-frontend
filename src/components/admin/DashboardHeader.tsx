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
    <div className="flex gap-4 mb-5 px-2 justify-between items-end">
      <p className="text-3xl font-semibold text-white/90">
        {formatTimeWIB(currentTime)} WIB
      </p>

      {isFetchVoteStatusFailed ? (
        // Error state: gagal mengambil status
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-sm font-medium">
            Gagal Mengambil Status Voting
          </span>
          <button
            onClick={onRetryVoteStatus}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Coba lagi"
          >
            <RefreshCw size={16} className="text-yellow-500" />
          </button>
        </div>
      ) : voteStatus === null ? (
        // Loading state
        <span className="text-gray-400 text-sm">Memuat status...</span>
      ) : (
        // Normal state: tampilkan status voting
        <div className="flex items-center gap-3">
          <span
            className={`text-lg font-semibold ${
              voteStatus ? "text-green-600" : "text-red-600"
            }`}
          >
            {voteStatus ? "Pemilihan Dibuka" : "Pemilihan Ditutup"}
          </span>
          {voteStatus && <Unlock className="text-green-600" size={23}/>}
          {!voteStatus && <Lock />}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
