import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { httpGet } from "../../../utils/http";
import { useState } from "react";
import { Statistics } from "../../../types/StatisticsType";

const monthOfYear = {
  january: "Jan",
  february: "Fev",
  march: "Mar",
  april: "Abr",
  may: "Mai",
  june: "Jun",
  july: "Jul",
  august: "Ago",
  september: "Set",
  october: "Out",
  november: "Nov",
  december: "Dez",
};

export default function YearlyStatistics({
  activeSection,
  setError,
  error,
}: any) {
  const [yearlyData, setYearlyData] = useState<Statistics[]>([]);

  const CustomTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {payload.value}
      </text>
    </g>
  );

  useEffect(() => {
    httpGet("/statistics/yearly", {
      year: new Date().getFullYear(),
    })
      .then((res: any) => {
        if (res.data) {
          const { yearlyStatistics, ...monthlyData } = res.data;

          const transformedData: Statistics[] = Object.keys(monthOfYear).map((monthKey) => {
            const month = monthKey as keyof typeof monthOfYear;
            const stats = monthlyData[month] || {};
            return {
              dayWeekOrMonth: monthOfYear[month],
              Passos: stats.steps || 0,
              Distância: stats.distance || 0,
              Andar: stats.stopsByFoot || 0,
              Carro: stats.stopsByCar || 0,
              Transportes: stats.stopsByTransports || 0,
              Bicicleta: stats.stopsByBike || 0,
              Pegada: stats.carbonFootprint || 0,
            };
          });

          setYearlyData(transformedData);
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          setError("Ainda não tem estatísticas anuais");
        } else {
          console.error("Erro ao buscar estatísticas anuais:", error);
        }
      });
  }, [activeSection]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginTop: "3rem",
          width: "100%",
          height: "30rem",
          flexWrap: "wrap",
        }}
      >
        {!error && activeSection === "Ano" && (
          <>
            <ResponsiveContainer
              width="48%"
              height="70%"
              style={{ marginRight: "1rem", paddingBottom: "2rem" }}
            >
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayWeekOrMonth" tick={<CustomTick />} height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Pegada"
                  stroke="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer
              width="48%"
              height="70%"
              style={{ marginLeft: "1rem", paddingBottom: "2rem" }}
            >
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayWeekOrMonth" tick={<CustomTick />} height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Passos" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer
              width="48%"
              height="70%"
              style={{
                marginRight: "1rem",
                marginTop: "3rem",
                paddingBottom: "2rem",
              }}
            >
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayWeekOrMonth" tick={<CustomTick />} height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Distância" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer
              width="48%"
              height="70%"
              style={{
                display: "flex",
                marginLeft: "1rem",
                marginTop: "3rem",
                paddingBottom: "2rem",
              }}
            >
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayWeekOrMonth" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Andar"
                  stackId="a"
                  fill="#8884d8"
                  barSize={20}
                />
                <Bar
                  dataKey="Carro"
                  stackId="b"
                  fill="#82ca9d"
                  barSize={20}
                />
                <Bar
                  dataKey="Transportes"
                  stackId="c"
                  fill="#ffc658"
                  barSize={20}
                />
                <Bar
                  dataKey="Bicicleta"
                  stackId="d"
                  fill="#00C49F"
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </Box>
    </>
  );
}
