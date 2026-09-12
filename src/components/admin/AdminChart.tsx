import type { LiveCountType } from "@/schemas/livecount.schema";
import { Card, CardContent, CardTitle } from "../ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const AdminChart = ({
  titleChart,
  data,
}: {
  titleChart: string;
  data?: LiveCountType[];
}) => {
  return (
    <Card className="flex-1 flex flex-col bg-gradient-to-br from-neutral-600/30 to-neutral-700/20 border-white/10 shadow-xl">
      <CardTitle className="text-center text-xl font-bold tracking-wide text-white/90 pt-2">
        Live Count Voting {titleChart}
      </CardTitle>
      <CardContent className="flex-1">
        <Bar
          options={{
            maintainAspectRatio: true,
            responsive: true,
            plugins: {
              title: {
                display: false,
              },
              legend: {
                display: false,
              },
              datalabels: {
                anchor: "end",
                align: "top",
                color: "#FFFFFF",
                font: {
                  size: 16,
                  weight: "bold",
                },
                formatter: (value) => value,
                // backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: 6,
                padding: {
                  top: 4,
                  bottom: 4,
                  left: 8,
                  right: 8,
                },
              },
              tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                titleColor: "#FFFFFF",
                bodyColor: "#E5E5E5",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                titleFont: {
                  size: 14,
                  weight: "bold",
                },
                bodyFont: {
                  size: 13,
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#E5E5E5",
                  font: {
                    size: 13,
                    weight: "bold",
                  },
                },
                border: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
              },
              y: {
                grid: {
                  color: "rgba(255, 255, 255, 0.05)",
                },
                ticks: {
                  display: false,
                  color: "#A0A0A0",
                },
                border: {
                  display: false,
                },
                grace: "5%",
              },
            },
          }}
          data={{
            labels: (data ?? []).map((res) => res.name),
            datasets: [
              {
                label: titleChart,
                data: (data ?? []).map((res) => res.count),
                backgroundColor: [
                  "rgba(56, 189, 248, 0.85)", // Sky blue - more vibrant
                  "rgba(251, 113, 133, 0.85)", // Rose pink - more vibrant
                  "rgba(52, 211, 153, 0.85)", // Emerald - more vibrant
                  "rgba(167, 139, 250, 0.85)", // Purple - more vibrant
                  "rgba(251, 146, 60, 0.85)", // Orange - more vibrant
                ],
                borderColor: [
                  "rgba(56, 189, 248, 1)",
                  "rgba(251, 113, 133, 1)",
                  "rgba(52, 211, 153, 1)",
                  "rgba(167, 139, 250, 1)",
                  "rgba(251, 146, 60, 1)",
                ],
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: [
                  "rgba(56, 189, 248, 1)",
                  "rgba(251, 113, 133, 1)",
                  "rgba(52, 211, 153, 1)",
                  "rgba(167, 139, 250, 1)",
                  "rgba(251, 146, 60, 1)",
                ],
              },
            ],
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AdminChart;
