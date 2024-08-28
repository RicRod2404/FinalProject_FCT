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
import { useEffect, useState } from "react";
import { httpGet } from "../../../utils/http";
import { Statistics } from "../../../types/StatisticsType";

/*type WeekStatistics = {
  week: string;
  steps: number;
  distance: number;
  stopsByFoot: number;
  stopsByCar: number;
  stopsByTransports: number;
  stopsByBike: number;
  carbonFootprint: number;
};*/

const weekOfMonth = {
  firstWeek: "Semana 1",
  secondWeek: "Semana 2",
  thirdWeek: "Semana 3",
  fourthWeek: "Semana 4",
  fifthWeek: "Semana 5",
  sixthWeek:"Semana6",
};

export default function MonthlyStatistics({ activeSection, error, setError }: any) {
  const [monthlyData, setMonthlyData] = useState<Statistics[]>([]);

  const CustomTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {payload.value}
      </text>
    </g>
  );

  useEffect(() => {
    httpGet("/statistics/monthly", {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    }).then((res: any) => {
      if (res.data) {
        const { monthlyStatistics, ...weeklyData } = res.data;

        const transformedData: Statistics[] = Object.keys(weekOfMonth).map((weekKey) => {
          const week = weekKey as keyof typeof weekOfMonth;
          const stats = weeklyData[week] || {};
          return {
            dayWeekOrMonth: weekOfMonth[week],
            Passos: stats.steps || 0,
            Distância: stats.distance || 0,
            Andar: stats.stopsByFoot || 0,
            Carro: stats.stopsByCar || 0,
            Transportes: stats.stopsByTransports || 0,
            Bicicleta: stats.stopsByBike || 0,
            Pegada: stats.carbonFootprint || 0,
          };
        });
        setMonthlyData(transformedData);
      }
    }).catch((error) => {
      if (error.status === 404) {
        setError("Ainda não tem estatísticas mensais");
      } else {
        console.error("Erro ao buscar estatísticas mensais:", error);
      }
    });
  }, [activeSection]);

  return (
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
      {!error && activeSection === "Mês" && (
        <>
          <ResponsiveContainer
            width="48%"
            height="70%"
            style={{ marginRight: "1rem", paddingBottom: "2rem" }}
          >
            <LineChart data={monthlyData}>
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
            <LineChart data={monthlyData}>
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
            <LineChart data={monthlyData}>
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
            <BarChart data={monthlyData}>
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
  );
}
