package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import pt.unl.fct.di.adc.adc2024.daos.Stock;

import java.util.Optional;

public interface StockRepository extends DatastoreRepository<Stock, String> {

    Optional<Stock> findByInternalCode(String internalCode);
}
