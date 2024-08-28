import { useEffect, useState } from "react";
import { httpGet } from "../utils/http";
import { set } from "../store/snackbar";

export function useCarbonData() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [previousMonthData, setPreviousMonthData] = useState([
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ]);

  const [currentMonthData, setCurrentMonthData] = useState([
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ]);

  useEffect(() => {
    if (!isFetchingData) {
      console.log("Fetching data");
      onFetchMonthlyStats("previous");
      onFetchMonthlyStats("current");
    }
  }, [isFetchingData]);
  useEffect(() => {
    console.log("previousMonthData: ");
    console.log(previousMonthData);
    console.log("currentMonthData: ");
    console.log(currentMonthData);
  }, [previousMonthData, currentMonthData]);
  function onFetchMonthlyStats(flag) {
    console.log("Fetching data for the " + flag + " month");
    setIsFetchingData(true);
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    if (flag === "previous") {
      month = month === 1 ? 12 : month - 1;
      year = month === 12 ? year - 1 : year;
    }
    httpGet("/statistics/monthly", {
      month: month,
      year: year,
    })
      .then((res) => {
        if (res.data) {
          const {
            monthlyStatistics,
            firstWeek,
            secondWeek,
            thirdWeek,
            fourthWeek,
            fifthWeek,
            sixthWeek,
          } = res.data;
          const { carbonFootprint } = monthlyStatistics;
          console.log("carbonFootprint: ", carbonFootprint);
          console.log("firstWeek: ", firstWeek?.carbonFootprint);
          console.log("secondWeek: ", secondWeek?.carbonFootprint);
          console.log("thirdWeek: ", thirdWeek?.carbonFootprint);
          console.log("fourthWeek: ", fourthWeek?.carbonFootprint);
          console.log("fifthWeek: ", fifthWeek?.carbonFootprint);
          console.log("sixthWeek: ", sixthWeek?.carbonFootprint);
          let weeks = 0;
          if (firstWeek) {
            console.log("firstWeek");
            weeks = 1;
          }
          if (secondWeek) {
            console.log("secondWeek");
            weeks = 2;
          }
          if (thirdWeek) {
            console.log("thirdWeek");
            weeks = 3;
          }
          if (fourthWeek) {
            console.log("fourthWeek");
            weeks = 4;
          }
          if (fifthWeek) {
            console.log("fifthWeek");
            weeks = 5;
          }
          if (sixthWeek) {
            console.log("sixthWeek");
            weeks = 6;
          }
          fetchWeeklyStats(weeks, month, year, flag);
        } else {
          console.log("no res.data");
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          console.log("No statistics found for the month: " + month);
        }
      });
    setIsFetchingData(false);
  }
  function fetchWeeklyStats(weeks, month, year, flag) {
    console.log("weeks: ", weeks);
    for (let i = 0; i <= weeks; i++) {
      let week = i + 1;
      httpGet("/statistics/weekly", {
        weekOfMonth: week,
        month: month,
        year: year,
      })
        .then((res) => {
          console.log("res.data: ");
          console.log(res.data);
          if (res.data) {
            const days = {
              weeklyStatistics: res.data.weeklyStatistics,
              monday: res.data?.monday
                ? res.data?.monday
                : { carbonFootprint: 0 },
              tuesday: res.data?.tuesday
                ? res.data?.tuesday
                : { carbonFootprint: 0 },
              wednesday: res.data?.wednesday
                ? res.data?.wednesday
                : { carbonFootprint: 0 },
              thursday: res.data?.thursday
                ? res.data?.thursday
                : { carbonFootprint: 0 },
              friday: res.data?.friday
                ? res.data?.friday
                : { carbonFootprint: 0 },
              saturday: res.data?.saturday
                ? res.data?.saturday
                : { carbonFootprint: 0 },
              sunday: res.data?.sunday
                ? res.data?.sunday
                : { carbonFootprint: 0 },
            };
            console.log("AYYYYY: ");
            console.log(days);
            fetchWeekDaysStats(week, days, flag);
          }
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            console.log("No statistics found for the week: " + week);
          }
          console.log("error at fetchWeeklyStats: ", err);
          console.log("week: ", week);
        });
    }
  }
  function fetchWeekDaysStats(week, days, flag) {
    try {
      console("HEYYYYYY: ");
      console.log(tuesday);
      if (flag === "current") {
        setCurrentMonthData((currentData) =>
          currentData.map((item, index) => {
            console.log("day: ", index + (week - 1) * 7);
            switch (index + (week - 1) * 7) {
              case 0 || 7 || 14 || 21 || 28:
                return {
                  ...item,
                  value: days?.monday?.carbonFootprint
                    ? days.monday.carbonFootprint
                    : 0,
                };
              case 1 || 8 || 15 || 22 || 29:
                //"tuesday at   ");
                return {
                  ...item,
                  value: days?.tuesday?.carbonFootprint
                    ? days?.tuesday.carbonFootprint
                    : 0,
                };
              case 2 || 9 || 16 || 23 || 30:
                return {
                  ...item,
                  value: days?.wednesday?.carbonFootprint
                    ? days?.wednesday.carbonFootprint
                    : 0,
                };
              case 3 || 10 || 17 || 24 || 31:
                return {
                  ...item,
                  value: days?.thursday?.carbonFootprint
                    ? days?.thursday.carbonFootprint
                    : 0,
                };
              case 4 || 11 || 18 || 25:
                return {
                  ...item,
                  value: days?.friday?.carbonFootprint
                    ? days?.friday.carbonFootprint
                    : 0,
                };
              case 5 || 12 || 19 || 26:
                return {
                  ...item,
                  value: days?.saturday?.carbonFootprint
                    ? days?.saturday.carbonFootprint
                    : 0,
                };
              case 6 || 13 || 20 || 27:
                return {
                  ...item,
                  value: days?.sunday?.carbonFootprint
                    ? days?.sunday.carbonFootprint
                    : 0,
                };
              default:
                return item;
            }
          })
        );
      } else if (flag === "previous") {
        setPreviousMonthData((previousData) =>
          previousData.map((item, index) => {
            /* console.log("index: ", index);
            console.log("week: ", week); */
            switch (index * week) {
              case 0 || 7 || 14 || 21 || 28:
                return {
                  ...item,
                  value: days?.monday?.carbonFootprint
                    ? days?.monday.carbonFootprint
                    : 0,
                };
              case 1 || 8 || 15 || 22 || 29:
                return {
                  ...item,
                  value: days?.tuesday?.carbonFootprint
                    ? days?.tuesday.carbonFootprint
                    : 0,
                };
              case 2 || 9 || 16 || 23 || 30:
                return {
                  ...item,
                  value: days?.wednesday?.carbonFootprint
                    ? days?.wednesday.carbonFootprint
                    : 0,
                };
              case 3 || 10 || 17 || 24 || 31:
                return {
                  ...item,
                  value: days?.thursday?.carbonFootprint
                    ? days?.thursday.carbonFootprint
                    : 0,
                };
              case 4 || 11 || 18 || 25:
                return {
                  ...item,
                  value: days?.friday?.carbonFootprint
                    ? days?.friday.carbonFootprint
                    : 0,
                };
              case 5 || 12 || 19 || 26:
                return {
                  ...item,
                  value: days?.saturday?.carbonFootprint
                    ? days?.saturday.carbonFootprint
                    : 0,
                };
              case 6 || 13 || 20 || 27:
                return {
                  ...item,
                  value: days?.sunday?.carbonFootprint
                    ? days?.sunday.carbonFootprint
                    : 0,
                };
              default:
                return item;
            }
          })
        );
      } else {
        console.log("Flag not valid: " + flag);
      }
    } catch (e) {
      console.log("error at fetchWeekDaysStats: ", e);
    }
  }
  return {
    isFetchingData,
    previousMonthData,
    currentMonthData,
  };
}
