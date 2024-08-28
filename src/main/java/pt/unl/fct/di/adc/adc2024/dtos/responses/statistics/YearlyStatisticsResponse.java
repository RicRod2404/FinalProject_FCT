package pt.unl.fct.di.adc.adc2024.dtos.responses.statistics;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.di.adc.adc2024.daos.statistics.MonthlyStatistics;
import pt.unl.fct.di.adc.adc2024.daos.statistics.YearlyStatistics;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class YearlyStatisticsResponse implements Serializable {

    YearlyStatistics yearlyStatistics;

    MonthlyStatistics january;

    MonthlyStatistics february;

    MonthlyStatistics march;

    MonthlyStatistics april;

    MonthlyStatistics may;

    MonthlyStatistics june;

    MonthlyStatistics july;

    MonthlyStatistics august;

    MonthlyStatistics september;

    MonthlyStatistics october;

    MonthlyStatistics november;

    MonthlyStatistics december;

}
