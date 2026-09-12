import AdminChart from "@/components/admin/AdminChart";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import type { CountArrayType } from "@/schemas/livecount.schema";
import axios from "axios";
import { apiUrl } from "@/lib/api";
import { TriangleAlert } from "lucide-react";

const Dashboard = () => {
  const [count, setCount] = useState<CountArrayType | null>(null);
  const [ isPusherEnvFound, setIsPusherEnvFound ] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await axios.get(`${apiUrl}/admin/live/count`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `${localStorage.getItem("Authorization")}`,
      },
    });
    setCount(res.data.data);
  };

  useEffect(() => {
    fetchData();

    const pusherKey = import.meta.env.VITE_PUSHER_KEY;
    const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      setIsPusherEnvFound(false);
      return;
    }

    setIsPusherEnvFound(true);

    Pusher.logToConsole = true;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe("pemilose");
    channel.bind("pemilolot", () => {
      fetchData();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  console.log(count);

  return (
    <section>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="flex gap-8 mt-4">
        <AdminChart titleChart="Osis" data={count?.osis} />
        <AdminChart titleChart="Mpk" data={count?.mpk} />
      </div>

      {!isPusherEnvFound && (
        <div className="flex items-center gap-3 mt-6 p-4 bg-red-500/10 border border-red-200/10 rounded-lg">
          <TriangleAlert className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-red-800 text-sm font-medium">
            Pusher credentials not found. Real-time vote count are disabled. Please configure the environment variables properly.
          </p>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
