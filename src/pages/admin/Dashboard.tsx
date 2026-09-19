import AdminChart from "@/components/admin/AdminChart";
import DashboardHeader from "@/components/admin/DashboardHeader";
import VoterParticipation from "@/components/admin/VoterParticipation";
import KioskPinModal from "@/components/admin/KioskPinModal";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import type { CountArrayType } from "@/schemas/livecount.schema";
import type { VoterStatsType } from "@/schemas/voterStats.schema";
import axios from "axios";
import { apiUrl } from "@/lib/api";
import { RefreshCw, TriangleAlert, WifiOff, Maximize2, Minimize2, Lock, MonitorPlay } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useKioskProtection } from "@/hooks/useKioskProtection";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get('fullscreen') === 'true';
  const isKiosk = searchParams.get('kiosk') === 'true';
  const { activateKioskMode, deactivateKioskMode } = useKioskProtection();
  
  const [showExitKioskModal, setShowExitKioskModal] = useState(false);

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

  // ESC key listener untuk keluar dari fullscreen (disabled in kiosk mode)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (isKiosk) {
          // In kiosk mode, ESC requires PIN
          e.preventDefault();
          setShowExitKioskModal(true);
        } else {
          // Normal fullscreen, ESC works normally
          navigate('/admin');
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen, isKiosk, navigate]);

  // Disable right-click in kiosk mode
  useEffect(() => {
    if (isKiosk) {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };
      window.addEventListener('contextmenu', handleContextMenu);
      return () => window.removeEventListener('contextmenu', handleContextMenu);
    }
  }, [isKiosk]);

  // Block DevTools keyboard shortcuts in kiosk mode
  useEffect(() => {
    if (isKiosk) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // F12
        if (e.key === 'F12') {
          e.preventDefault();
          setShowExitKioskModal(true);
          return;
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
          e.preventDefault();
          setShowExitKioskModal(true);
          return;
        }
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
          e.preventDefault();
          setShowExitKioskModal(true);
          return;
        }
        
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
          e.preventDefault();
          setShowExitKioskModal(true);
          return;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
          e.preventDefault();
          setShowExitKioskModal(true);
          return;
        }

        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          return;
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isKiosk]);

  // Detect DevTools opening via size detection in kiosk mode
  useEffect(() => {
    if (isKiosk) {
      let devtoolsOpen = false;
      
      const detectDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
          if (!devtoolsOpen) {
            devtoolsOpen = true;
            setShowExitKioskModal(true);
          }
        } else {
          devtoolsOpen = false;
        }
      };
      
      const interval = setInterval(detectDevTools, 1000);
      return () => clearInterval(interval);
    }
  }, [isKiosk]);

  // Activate kiosk mode when kiosk param is present
  useEffect(() => {
    if (isKiosk) {
      activateKioskMode();
    }
  }, [isKiosk, activateKioskMode]);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      if (isKiosk) {
        // Exit kiosk requires PIN
        setShowExitKioskModal(true);
      } else {
        // Normal fullscreen exit
        navigate('/admin');
      }
    } else {
      navigate('/admin?fullscreen=true');
    }
  };

  const enterKioskMode = () => {
    navigate('/admin?fullscreen=true&kiosk=true');
  };

  const handleExitKiosk = () => {
    setShowExitKioskModal(false);
    deactivateKioskMode();
  };

  return (
    <section className="space-y-6 md:space-y-8 relative">
      {/* Kiosk Exit PIN Modal */}
      <KioskPinModal
        isOpen={showExitKioskModal}
        onCorrectPin={handleExitKiosk}
        onCancel={() => setShowExitKioskModal(false)}
      />

      {/* Header Halaman - hidden in fullscreen */}
      {!isFullscreen && (
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4 md:mb-8">
          Dashboard
        </h1>
      )}

      {/* Floating Fullscreen Button */}
      {!isKiosk && (
        <button
          onClick={toggleFullscreen}
          className="fixed bottom-4 right-4 md:bottom-0 md:right-8 z-50 p-3 md:p-4 bg-sky-500/20 hover:bg-sky-600/20 border-sky-100/10 border-2 backdrop-blur-[10px] text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          title={isFullscreen ? "Keluar Fullscreen (ESC)" : "Masuk Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 size={20} strokeWidth={2.5} className="md:size-6" />
          ) : (
            <Maximize2 size={20} strokeWidth={2.5} className="md:size-6" />
          )}
        </button>
      )}

      {/* Floating Kiosk Mode Button - only in fullscreen (not kiosk) */}
      {isFullscreen && !isKiosk && (
        <button
          onClick={enterKioskMode}
          className="fixed bottom-4 right-20 md:bottom-0 md:right-28 z-50 p-3 md:p-4 bg-purple-500/20 hover:bg-purple-600/20 border-purple-100/10 border-2 backdrop-blur-[10px] text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Aktifkan Mode Kiosk"
        >
          <MonitorPlay size={20} strokeWidth={2.5} className="md:size-6" />
        </button>
      )}

      {/* Floating Lock Button - only in kiosk mode */}
      {isKiosk && (
        <button
          onClick={() => setShowExitKioskModal(true)}
          className="fixed bottom-4 right-4 md:bottom-0 md:right-8 z-50 p-3 md:p-4 bg-red-500/20 hover:bg-red-600/20 border-red-100/10 border-2 backdrop-blur-[10px] text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Keluar Mode Kiosk (Perlu PIN)"
        >
          <Lock size={20} strokeWidth={2.5} className="md:size-6" />
        </button>
      )}

      {/* Kiosk Mode Indicator */}
      {isKiosk && (
        <div className="fixed top-4 right-4 z-40 px-4 py-2 bg-red-500/20 border-2 border-red-500/50 backdrop-blur-[10px] rounded-lg">
          <p className="text-red-200 text-sm font-semibold flex items-center gap-2">
            <Lock size={16} />
            Mode Kiosk Aktif
          </p>
        </div>
      )}

      {/* Jam Real-time & Status Voting */}
      <DashboardHeader
        currentTime={currentTime}
        voteStatus={voteStatus}
        isFetchVoteStatusFailed={isFetchVoteStatusFailed}
        onRetryVoteStatus={fetchVoteStatus}
      />

      {/* Live Count Voting */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <AdminChart 
            key={`osis-${isFullscreen}`}
            titleChart="OSIS" 
            data={count?.osis} 
          />
          <AdminChart 
            key={`mpk-${isFullscreen}`}
            titleChart="MPK" 
            data={count?.mpk} 
          />
        </div>

        {/* Error banner untuk live count - muncul di bawah chart */}
        {isFetchVoteCountFailed && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-yellow-500/15 border-2 border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <WifiOff className="text-yellow-400 flex-shrink-0" size={22} strokeWidth={2.5} />
              <p className="text-yellow-100 text-sm font-semibold flex-1">
                Gagal memuat data jumlah suara. Silakan periksa koneksi Anda.
              </p>
            </div>
            <button
              onClick={fetchVoteCount}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-all duration-200 hover:scale-105 border border-yellow-500/40 w-full sm:w-auto"
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
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-red-500/15 border-2 border-red-500/30 rounded-xl">
          <TriangleAlert className="text-red-400 flex-shrink-0 mt-0.5 sm:mt-0" size={22} strokeWidth={2.5} />
          <p className="text-red-100 text-sm font-semibold">
            Kredensial Pusher tidak ditemukan. Pembaruan data real-time dinonaktifkan. Silakan konfigurasikan environment variables dengan benar.
          </p>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
