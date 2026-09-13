import AdminChart from "@/components/admin/AdminChart";
import DashboardHeader from "@/components/admin/DashboardHeader";
import VoterParticipation from "@/components/admin/VoterParticipation";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import type { CountArrayType } from "@/schemas/livecount.schema";
import type { VoterStatsType } from "@/schemas/voterStats.schema";
import axios from "axios";
import { apiUrl } from "@/lib/api";
import { RefreshCw, TriangleAlert, WifiOff } from "lucide-react";

const Dashboard = () => {
  // State untuk data live count (jumlah suara per kandidat)
  const [count, setCount] = useState<CountArrayType | null>(null);

  // State untuk jam real-time
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // State untuk status voting (terbuka/tutup)
  const [voteStatus, setVoteStatus] = useState<boolean | null>(null);

  // State untuk statistik partisipasi pemilih
  const [voterStats, setVoterStats] = useState<VoterStatsType | null>(null);

  // State untuk error handling
  const [isPusherEnvFound, setIsPusherEnvFound] = useState<boolean>(false);
  const [isFetchVoteCountFailed, setIsFetchVoteCountFailed] = useState<boolean>(false);
  const [isFetchVoteStatusFailed, setIsFetchVoteStatusFailed] = useState<boolean>(false);
  const [isFetchVoterStatsFailed, setIsFetchVoterStatsFailed] = useState<boolean>(false);

  /**
   * Fungsi untuk mengambil data live count (jumlah suara per kandidat)
   * Endpoint: GET /api/v1/admin/live/count
   */
  const fetchVoteCount = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/live/count`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `${localStorage.getItem("Authorization")}`,
        },
      });

      setCount(res.data.data);
      setIsFetchVoteCountFailed(false);
    } catch (error) {
      setIsFetchVoteCountFailed(true);
      console.error("Failed to fetch vote count:", error);
    }
  };

  /**
   * Fungsi untuk mengambil status voting (terbuka/tutup)
   * Endpoint: GET /api/v1/admin/vote/status
   */
  const fetchVoteStatus = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/vote/status`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      setVoteStatus(res.data.data.vote_status);
      setIsFetchVoteStatusFailed(false);
    } catch (error) {
      setIsFetchVoteStatusFailed(true);
      console.error("Failed to fetch vote status:", error);
    }
  };

  /**
   * Fungsi untuk mengambil statistik partisipasi pemilih
   * Endpoint: GET /api/v1/admin/count
   * Response: [{ _id: false, count: X }, { _id: true, count: Y }]
   */
  const fetchVoterStats = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/count`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `${localStorage.getItem("Authorization")}`,
        },
      });

      // Parse response: _id: true = sudah memilih, _id: false = belum memilih
      const data = res.data.data;
      const voted = data.find((item: { _id: boolean; count: number }) => item._id === true)?.count || 0;
      const notVoted = data.find((item: { _id: boolean; count: number }) => item._id === false)?.count || 0;

      setVoterStats({
        total: voted + notVoted,
        voted,
        notVoted,
      });
      setIsFetchVoterStatsFailed(false);
    } catch (error) {
      setIsFetchVoterStatsFailed(true);
      console.error("Failed to fetch voter stats:", error);
    }
  };

  /**
   * Fungsi untuk refresh semua data sekaligus
   * Dipanggil saat Pusher menerima event vote baru
   */
  const refreshAllData = () => {
    fetchVoteCount();
    fetchVoteStatus();
    fetchVoterStats();
  };

  useEffect(() => {
    // Fetch semua data pertama kali saat component mount
    refreshAllData();

    // Setup interval untuk update jam setiap detik
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Setup Pusher untuk real-time updates
    const pusherKey = import.meta.env.VITE_PUSHER_KEY;
    const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      setIsPusherEnvFound(false);
      return () => clearInterval(clockInterval);
    }

    setIsPusherEnvFound(true);

    Pusher.logToConsole = true;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe("pemilose");
    channel.bind("pemilolot", () => {
      // Refresh semua data saat ada vote baru
      refreshAllData();
    });

    return () => {
      clearInterval(clockInterval);
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return (
    <section className="space-y-8">
      {/* Header Halaman */}
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Dashboard</h1>

      {/* Jam Real-time & Status Voting */}
      <DashboardHeader
        currentTime={currentTime}
        voteStatus={voteStatus}
        isFetchVoteStatusFailed={isFetchVoteStatusFailed}
        onRetryVoteStatus={fetchVoteStatus}
      />

      {/* Live Count Voting */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <AdminChart titleChart="OSIS" data={count?.osis} />
          <AdminChart titleChart="MPK" data={count?.mpk} />
        </div>

        {/* Error banner untuk live count - muncul di bawah chart */}
        {isFetchVoteCountFailed && (
          <div className="flex items-center gap-4 p-5 bg-yellow-500/15 border-2 border-yellow-500/30 rounded-xl">
            <WifiOff className="text-yellow-400 flex-shrink-0" size={24} strokeWidth={2.5} />
            <p className="text-yellow-100 text-sm font-semibold flex-1">
              Gagal memuat data jumlah suara. Silakan periksa koneksi Anda.
            </p>
            <button
              onClick={fetchVoteCount}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-all duration-200 hover:scale-105 border border-yellow-500/40"
              title="Coba lagi"
            >
              <RefreshCw size={16} strokeWidth={2.5} />
              Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* Partisipasi Pemilih */}
      <VoterParticipation
        voterStats={voterStats}
        isFetchVoterStatsFailed={isFetchVoterStatsFailed}
        onRetryVoterStats={fetchVoterStats}
      />

      {/* Warning untuk Pusher env - muncul paling bawah karena mempengaruhi semua fitur real-time */}
      {!isPusherEnvFound && (
        <div className="flex items-center gap-4 p-5 bg-red-500/15 border-2 border-red-500/30 rounded-xl">
          <TriangleAlert className="text-red-400 flex-shrink-0" size={24} strokeWidth={2.5} />
          <p className="text-red-100 text-sm font-semibold">
            Kredensial Pusher tidak ditemukan. Pembaruan data real-time dinonaktifkan. Silakan konfigurasikan environment variables dengan benar.
          </p>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
