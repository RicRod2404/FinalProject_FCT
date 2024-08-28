package pt.unl.fct.di.adc.adc2024.repositories.statistics;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import pt.unl.fct.di.adc.adc2024.daos.statistics.MonthlyStatistics;

import java.util.List;
import java.util.Optional;

public interface MonthlyStatisticsRepository extends DatastoreRepository<MonthlyStatistics, String>{

    Optional<MonthlyStatistics> findByUserIdAndMonthAndYear(String userId, int month, int year);

    List<MonthlyStatistics> findByUserIdAndYear(String userId, int year);

}
