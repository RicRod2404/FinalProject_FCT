package pt.unl.fct.di.adc.adc2024.repositories.statistics;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import pt.unl.fct.di.adc.adc2024.daos.statistics.YearlyStatistics;

import java.util.Optional;

public interface YearlyStatisticsRepository extends DatastoreRepository<YearlyStatistics, String> {

    Optional<YearlyStatistics> findByUserIdAndYear(String userId, int year);

}
