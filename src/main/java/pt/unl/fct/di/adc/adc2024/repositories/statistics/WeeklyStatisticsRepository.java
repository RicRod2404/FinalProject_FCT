package pt.unl.fct.di.adc.adc2024.repositories.statistics;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import pt.unl.fct.di.adc.adc2024.daos.statistics.WeeklyStatistics;

import java.util.List;
import java.util.Optional;

public interface WeeklyStatisticsRepository extends DatastoreRepository<WeeklyStatistics, String>{

    Optional<WeeklyStatistics> findByUserIdAndWeekOfMonthAndMonthAndYear(String userId, int weekOfMonth, int month, int year);

    List<WeeklyStatistics> findByUserIdAndMonthAndYear(String userId, int month, int year);

}
