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

export default function WeekStatistics({ activeSection, weeklyData }: any) {

  const CustomTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {payload.value}
      </text>
    </g>
  );

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
      {activeSection === "Semana" && (
        <>
          <ResponsiveContainer
            width="48%"
            height="70%"
            style={{ marginRight: "1rem", paddingBottom: "2rem" }}
          >
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dayWeekOrMonth" tick={<CustomTick />} height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Pegada" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer
            width="48%"
            height="70%"
            style={{ marginLeft: "1rem", paddingBottom: "2rem" }}
          >
            <LineChart data={weeklyData}>
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
            <LineChart data={weeklyData}>
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
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dayWeekOrMonth" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Andar" stackId="a" fill="#8884d8" barSize={20} />
              <Bar dataKey="Carro" stackId="b" fill="#82ca9d" barSize={20} />
              <Bar dataKey="Transportes" stackId="c" fill="#ffc658" barSize={20} />
              <Bar dataKey="Bicicleta" stackId="d" fill="#00C49F" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </Box>
  );
}
