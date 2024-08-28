package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pt.unl.fct.di.adc.adc2024.daos.Treap;

import java.util.List;

public interface TreapRepository extends DatastoreRepository<Treap, String> {

    List<Treap> findAllByUserId(String userId);

    Page<Treap> findAllByUserId(String userId, Pageable pageable);
}
