package pt.unl.fct.di.adc.adc2024.dtos.responses.statistics;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.di.adc.adc2024.daos.statistics.MonthlyStatistics;
import pt.unl.fct.di.adc.adc2024.daos.statistics.WeeklyStatistics;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class MonthlyStatisticsResponse implements Serializable {

    MonthlyStatistics monthlyStatistics;

    WeeklyStatistics firstWeek;

    WeeklyStatistics secondWeek;

    WeeklyStatistics thirdWeek;

    WeeklyStatistics fourthWeek;

    WeeklyStatistics fifthWeek;

    WeeklyStatistics sixthWeek;
}
