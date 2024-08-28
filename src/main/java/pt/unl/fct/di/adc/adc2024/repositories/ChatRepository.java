package pt.unl.fct.di.adc.adc2024.repositories;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import com.google.cloud.spring.data.datastore.repository.query.Query;
import org.springframework.data.repository.query.Param;
import pt.unl.fct.di.adc.adc2024.daos.Chat;

import java.util.List;

public interface ChatRepository extends DatastoreRepository<Chat, String> {

    boolean existsByChatName(String chatName);
    List<Chat> findAll();

    List<Chat> findAllByChatName(String chatName);

    Chat findByChatName(String chatName);

    @Query("SELECT * FROM chats WHERE chatName >= @start AND chatName < @end")
    List<Chat> findAllByChatNameLike(@Param("start") String start, @Param("end") String end);
}
