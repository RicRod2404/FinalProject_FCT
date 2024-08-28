package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import pt.unl.fct.di.adc.adc2024.daos.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends DatastoreRepository<Product, String> {
    Optional<Product> findByInternalCode(String internalCode);

    List<Product> findAll();
}
