package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pt.unl.fct.di.adc.adc2024.daos.Sales;

public interface SalesRepository extends DatastoreRepository<Sales, String>{

    Page<Sales> findAllByUserId(String userId, Pageable pageable);
}
