package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import pt.unl.fct.di.adc.adc2024.daos.ProductCategory;

import java.util.List;
import java.util.Optional;

public interface ProductCategoryRepository extends DatastoreRepository<ProductCategory, String> {

    List<ProductCategory> findAll();

    Optional<ProductCategory> findByName(String name);

    boolean existsByName(String name);
}
