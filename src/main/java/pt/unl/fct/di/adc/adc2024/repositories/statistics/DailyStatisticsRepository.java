package pt.unl.fct.di.adc.adc2024.repositories.statistics;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import pt.unl.fct.di.adc.adc2024.daos.statistics.DailyStatistics;

import java.util.List;
import java.util.Optional;

public interface DailyStatisticsRepository extends DatastoreRepository<DailyStatistics, String> {

    Optional<DailyStatistics> findByUserIdAndWeekDayAndWeekOfMonthAndMonthAndYear(String userId, int weekDay, int weekOfMonth, int month, int year);

    List<DailyStatistics> findByUserIdAndWeekOfMonthAndMonthAndYear(String userId, int weekOfMonth, int month, int year);
}
