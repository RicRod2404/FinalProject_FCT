package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pt.unl.fct.di.adc.adc2024.daos.Message;

public interface MessageRepository extends DatastoreRepository<Message, String>{

    Page<Message> findAllByChatIdOrderByTimestampDesc(String chatId, Pageable pageable);
}
