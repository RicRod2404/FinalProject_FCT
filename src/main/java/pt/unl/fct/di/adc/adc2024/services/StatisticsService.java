package pt.unl.fct.di.adc.adc2024.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.dtos.responses.statistics.MonthlyStatisticsResponse;
import pt.unl.fct.di.adc.adc2024.dtos.responses.statistics.WeeklyStatisticsResponse;
import pt.unl.fct.di.adc.adc2024.dtos.responses.statistics.YearlyStatisticsResponse;
import pt.unl.fct.di.adc.adc2024.repositories.statistics.DailyStatisticsRepository;
import pt.unl.fct.di.adc.adc2024.repositories.statistics.MonthlyStatisticsRepository;
import pt.unl.fct.di.adc.adc2024.repositories.statistics.WeeklyStatisticsRepository;
import pt.unl.fct.di.adc.adc2024.repositories.statistics.YearlyStatisticsRepository;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final DailyStatisticsRepository dailyStats;

    private final WeeklyStatisticsRepository weeklyStats;

    private final MonthlyStatisticsRepository monthlyStats;

    private final YearlyStatisticsRepository yearlyStats;

    public WeeklyStatisticsResponse getWeeklyStatistics(int weekOfMonth, int month, int year) {
        var res = new WeeklyStatisticsResponse();
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var weekly = weeklyStats.findByUserIdAndWeekOfMonthAndMonthAndYear(principal.getId(), weekOfMonth, month, year)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        res.setWeeklyStatistics(weekly);

        var daysOfWeek = dailyStats.findByUserIdAndWeekOfMonthAndMonthAndYear(principal.getId(), weekOfMonth, month, year);
        for (var day : daysOfWeek) {
            switch (day.getWeekDay()) {
                case 1 -> res.setMonday(day);
                case 2 -> res.setTuesday(day);
                case 3 -> res.setWednesday(day);
                case 4 -> res.setThursday(day);
                case 5 -> res.setFriday(day);
                case 6 -> res.setSaturday(day);
                case 7 -> res.setSunday(day);
            }
        }

        return res;
    }

    public MonthlyStatisticsResponse getMonthlyStatistics(int month, int year) {
        var res = new MonthlyStatisticsResponse();
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var monthly = monthlyStats.findByUserIdAndMonthAndYear(principal.getId(), month, year)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        res.setMonthlyStatistics(monthly);

        var weeksOfMonth = weeklyStats.findByUserIdAndMonthAndYear(principal.getId(), month, year);
        for (var week : weeksOfMonth) {
            switch (week.getWeekOfMonth()) {
                case 1 -> res.setFirstWeek(week);
                case 2 -> res.setSecondWeek(week);
                case 3 -> res.setThirdWeek(week);
                case 4 -> res.setFourthWeek(week);
                case 5 -> res.setFifthWeek(week);
                case 6 -> res.setSixthWeek(week);
            }
        }

        return res;
    }

    public YearlyStatisticsResponse getYearlyStatistics(int year) {
        var res = new YearlyStatisticsResponse();
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var yearly = yearlyStats.findByUserIdAndYear(principal.getId(), year)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        res.setYearlyStatistics(yearly);

        var months = monthlyStats.findByUserIdAndYear(principal.getId(), year);
        for (var month : months) {
            switch (month.getMonth()) {
                case 1 -> res.setJanuary(month);
                case 2 -> res.setFebruary(month);
                case 3 -> res.setMarch(month);
                case 4 -> res.setApril(month);
                case 5 -> res.setMay(month);
                case 6 -> res.setJune(month);
                case 7 -> res.setJuly(month);
                case 8 -> res.setAugust(month);
                case 9 -> res.setSeptember(month);
                case 10 -> res.setOctober(month);
                case 11 -> res.setNovember(month);
                case 12 -> res.setDecember(month);
            }
        }

        return res;
    }
}
