import DashboardHeader from "@/components/admin/DashboardHeader";
import AdminChart from "@/components/admin/AdminChart";
import VoterParticipation from "@/components/admin/VoterParticipation";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import type { CountArrayType } from "@/schemas/livecount.schema";
import type { VoterStatsType } from "@/schemas/voterStats.schema";
import axios from "axios";
import { apiUrl } from "@/lib/api";
import { RefreshCw, TriangleAlert, WifiOff } from "lucide-react";

const LiveDisplay = () => {
  const [count, setCount] = useState<CountArrayType | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [voteStatus, setVoteStatus] = useState<boolean | null>(null);
  const [voterStats, setVoterStats] = useState<VoterStatsType | null>(null);

  const [isPusherEnvFound, setIsPusherEnvFound] = useState<boolean>(false);
  const [isFetchVoteCountFailed, setIsFetchVoteCountFailed] = useState<boolean>(false);
  const [isFetchVoteStatusFailed, setIsFetchVoteStatusFailed] = useState<boolean>(false);
  const [isFetchVoterStatsFailed, setIsFetchVoterStatsFailed] = useState<boolean>(false);

  const displayToken = import.meta.env.VITE_DISPLAY_TOKEN || localStorage.getItem("Authorization");

  const fetchVoteCount = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/live/count`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: displayToken,
        },
      });

      setCount(res.data.data);
      setIsFetchVoteCountFailed(false);
    } catch (error) {
      setIsFetchVoteCountFailed(true);
      console.error("Failed to fetch vote count:", error);
    }
  };

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

  const fetchVoterStats = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/count`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: displayToken,
        },
      });

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

  const refreshAllData = () => {
    fetchVoteCount();
    fetchVoteStatus();
    fetchVoterStats();
  };

  useEffect(() => {
    refreshAllData();

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

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
      refreshAllData();
    });

    return () => {
      clearInterval(clockInterval);
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 's'))
      ) {
        e.preventDefault();
      }
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('selectstart', handleSelectStart);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  useEffect(() => {
    let devtoolsOpen = false;

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #000; color: #fff; font-family: sans-serif; text-align: center; padding: 20px;">
              <div>
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">🔒 Display Only</h1>
                <p style="font-size: 1.5rem; color: #999;">Admin access required to continue</p>
              </div>
            </div>
          `;
        }
      }
    };

    const interval = setInterval(detectDevTools, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-foreground p-4 md:p-6 lg:p-8">
      <section className="space-y-6 md:space-y-8 max-w-[1800px] mx-auto">
        <DashboardHeader
          currentTime={currentTime}
          voteStatus={voteStatus}
          isFetchVoteStatusFailed={isFetchVoteStatusFailed}
          onRetryVoteStatus={fetchVoteStatus}
        />

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <AdminChart 
              key="osis-display"
              titleChart="OSIS" 
              data={count?.osis} 
            />
            <AdminChart 
              key="mpk-display"
              titleChart="MPK" 
              data={count?.mpk} 
            />
          </div>

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

        <VoterParticipation
          voterStats={voterStats}
          isFetchVoterStatsFailed={isFetchVoterStatsFailed}
          onRetryVoterStats={fetchVoterStats}
        />

        {!isPusherEnvFound && (
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-red-500/15 border-2 border-red-500/30 rounded-xl">
            <TriangleAlert className="text-red-400 flex-shrink-0 mt-0.5 sm:mt-0" size={22} strokeWidth={2.5} />
            <p className="text-red-100 text-sm font-semibold">
              Kredensial Pusher tidak ditemukan. Pembaruan data real-time dinonaktifkan. Silakan konfigurasikan environment variables dengan benar.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default LiveDisplay;
