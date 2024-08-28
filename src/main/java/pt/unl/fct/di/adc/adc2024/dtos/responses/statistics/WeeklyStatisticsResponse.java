package pt.unl.fct.di.adc.adc2024.dtos.responses.statistics;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.di.adc.adc2024.daos.statistics.DailyStatistics;
import pt.unl.fct.di.adc.adc2024.daos.statistics.WeeklyStatistics;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class WeeklyStatisticsResponse implements Serializable {

    WeeklyStatistics weeklyStatistics;

    DailyStatistics monday;

    DailyStatistics tuesday;

    DailyStatistics wednesday;

    DailyStatistics thursday;

    DailyStatistics friday;

    DailyStatistics saturday;

    DailyStatistics sunday;
}
