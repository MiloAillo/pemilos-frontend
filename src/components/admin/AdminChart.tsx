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
    <Card className="flex-1 flex flex-col">
      <CardTitle className="text-center">Live Count Voting {titleChart}</CardTitle>
      <CardContent>
        <Bar
          options={{
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
                color: "#F0F0F0",
                font: {
                  size: 14,
                  weight: "bold",
                },
                formatter: (value) => value,
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#fff",
                },
              },
              y: {
                ticks: {
                  display: false,
                  color: "#8F8F8F",
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
                  "rgba(54, 162, 235, 0.8)",
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(153, 102, 255, 0.8)",
                  "rgba(255, 159, 64, 0.8)",
                ],
                borderColor: [
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AdminChart;
