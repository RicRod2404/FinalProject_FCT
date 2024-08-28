package pt.unl.fct.di.adc.adc2024.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pt.unl.fct.di.adc.adc2024.dtos.responses.statistics.MonthlyStatisticsResponse;
import pt.unl.fct.di.adc.adc2024.dtos.responses.statistics.WeeklyStatisticsResponse;
import pt.unl.fct.di.adc.adc2024.dtos.responses.statistics.YearlyStatisticsResponse;
import pt.unl.fct.di.adc.adc2024.services.StatisticsService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/statistics")
public class StatisticController extends AbstractController {

    private final StatisticsService statisticsService;

    @GetMapping("/weekly")
    public ResponseEntity<WeeklyStatisticsResponse> getWeeklyStatistics(@RequestParam int weekOfMonth, @RequestParam int month, @RequestParam int year) {
        return ok(statisticsService.getWeeklyStatistics(weekOfMonth, month, year));
    }

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyStatisticsResponse> getMonthlyStatistics(@RequestParam int month, @RequestParam int year) {
        return ok(statisticsService.getMonthlyStatistics(month, year));
    }

    @GetMapping("/yearly")
    public ResponseEntity<YearlyStatisticsResponse> getYearlyStatistics(@RequestParam int year) {
        return ok(statisticsService.getYearlyStatistics(year));
    }

}
