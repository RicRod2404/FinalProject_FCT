package pt.unl.fct.di.adc.adc2024.repositories;


import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import pt.unl.fct.di.adc.adc2024.daos.Session;

import java.util.Optional;

public interface SessionRepository extends DatastoreRepository<Session, String>{
    boolean existsByUserAndEndedIsNull(String user);
    Optional<Session> findByUserAndEndedIsNull(String user);
}
