import "bootstrap/dist/css/bootstrap.min.css";
import HomeBreadcrumb from "../../components/BackOffice/Home/HomeBreadcrumb";
import { useState, useEffect } from "react";
import { httpGet } from "../../utils/http";
import WeekStatistics from "../../components/BackOffice/Home/WeekStatistics";
import DailyStatistics from "../../components/BackOffice/Home/DailyStatistics";
import MonthlyStatistics from "../../components/BackOffice/Home/MonthlyStatistics";
import YearlyStatistics from "../../components/BackOffice/Home/YearlyStatistics";
import { Statistics } from "../../types/StatisticsType";

const daysOfWeek = {
  Monday: "Segunda",
  Tuesday: "Terça",
  Wednesday: "Quarta",
  Thursday: "Quinta",
  Friday: "Sexta",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

/*const response = {
  steps: "Passos",
  distance: "Distância",
  stopsByFoot: "Andar",
  stopsByCar: "Carro",
  stopsByTransports: "Transportes",
  stopsByBike: "Bicicleta",
  carbonFootprint: "Pegada",
};*/

export default function BackOfficeHP() {
  const [activeSection, setActiveSection] = useState("Semana");
  const [weeklyData, setWeeklyData] = useState<Statistics[]>([]);
  const [todaySteps, setTodaySteps] = useState(0);
  const [currentDayDistance, setCurrentDayDistance] = useState<number | null>(null);
  const [currentCarbonFootprint, setCurrentCarbonFootprint] = useState<number | null>(null);
  const [error, setError] = useState("");

  function getWeekOfMonth() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const diff = now.getTime() - startOfMonth.getTime() + (startOfMonth.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return Math.ceil((day + startOfMonth.getDay()) / 7);
  }

  useEffect(() => {
    if (activeSection === "Semana") {
      httpGet("/statistics/weekly", {
        weekOfMonth: getWeekOfMonth(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      }).then((res: any) => {
        if (res.data) {
          const { weeklyStatistics, ...dailyData } = res.data;

          setTodaySteps(weeklyStatistics.steps);
          setCurrentDayDistance(weeklyStatistics.distance);
          setCurrentCarbonFootprint(weeklyStatistics.carbonFootprint);

          const transformedData: Statistics[] = Object.keys(daysOfWeek).map((dayKey) => {
            const day = dayKey as keyof typeof daysOfWeek;
            const stats = dailyData[day.toLowerCase()] || {};
            return {
              dayWeekOrMonth: daysOfWeek[day],
              Passos: stats.steps|| 0,
              Distância: stats.distance || 0,
              Andar: stats.stopsByFoot || 0,
              Carro: stats.stopsByCar || 0,
              Transportes: stats.stopsByTransports || 0,
              Bicicleta: stats.stopsByBike|| 0,
              Pegada: stats.carbonFootprint || 0,
              
            };
          });
          setWeeklyData(transformedData);
        }
      }).catch((error) => {
        if (error.status === 404) {
          setError("Ainda não tem estatísticas semanais");
        } else {
          console.error("Erro ao buscar estatísticas semanais:", error);
        }
      });
    }
  }, [activeSection]);

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "6rem",
          marginLeft: "11rem",
          justifyContent: "center",
          alignItems: "center",
          width: "105%",
          flexDirection: "column",
        }}
      >
        <DailyStatistics
          currentCarbonFootprint={currentCarbonFootprint}
          todaySteps={todaySteps}
          currentDayDistance={currentDayDistance}
        />
        <HomeBreadcrumb
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        {error && (
          <div style={{ color: "var(--veronica)", marginTop: "4rem"}}>
            {error}
          </div>
        )}
        {!error && activeSection === "Semana" && (
          <WeekStatistics
            weeklyData={weeklyData}
            activeSection={activeSection}
          />
        )}
        {activeSection === "Mês" && (
          <MonthlyStatistics activeSection={activeSection} setError={setError} error={error}/>
        )}
        {activeSection === "Ano" && (
          <YearlyStatistics activeSection={activeSection} setError={setError} error={error}/>
        )}
      </div>
    </>
  );
}
