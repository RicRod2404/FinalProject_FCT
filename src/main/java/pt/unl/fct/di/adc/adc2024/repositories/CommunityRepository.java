package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import com.google.cloud.spring.data.datastore.repository.query.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import pt.unl.fct.di.adc.adc2024.daos.Community;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends DatastoreRepository<Community, String> {

    boolean existsByName(String name);

    Optional<Community> findByName(String name);

    List<Community> findAll();

    @Query("SELECT * FROM communities WHERE name >= @start AND name < @end")
    List<Community> findByNameLike(@Param("start") String start, @Param("end") String end, Pageable pageable);
}
