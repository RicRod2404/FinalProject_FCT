package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import pt.unl.fct.di.adc.adc2024.daos.EmailChange;

import java.util.Optional;

public interface EmailChangeRepository extends DatastoreRepository<EmailChange, String> {

    Optional<EmailChange> findByVerifyHash(String verifyHash);
}
