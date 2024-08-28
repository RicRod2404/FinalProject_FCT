package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import com.google.cloud.spring.data.datastore.repository.query.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import pt.unl.fct.di.adc.adc2024.daos.Ranking;

import java.util.List;
import java.util.Optional;

public interface RankingRepository extends DatastoreRepository<Ranking, String> {

    @Query("SELECT * FROM rankings WHERE isUser = @isUser AND month = @month AND year = @year ORDER BY leafPoints DESC")
    Page<Ranking> findAllByUserAndMonthAndYearOrderByLeafPointsDesc(@Param("isUser") boolean isUser, @Param("month") int month, @Param("year") int year, Pageable pageable);

    @Query("SELECT * FROM rankings WHERE isUser = @isUser AND year = @year ORDER BY leafPoints DESC")
    Page<Ranking> findAllByUserAndYearOrderByLeafPointsDesc(@Param("isUser") boolean isUser, @Param("year") int year, Pageable pageable);

    Optional<Ranking> findByTargetIdAndMonthAndYear(String targetId, int month, int year);

    List<Ranking> findAllByTargetId(String targetId);
}
