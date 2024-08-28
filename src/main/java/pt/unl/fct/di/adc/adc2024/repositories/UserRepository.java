package pt.unl.fct.di.adc.adc2024.repositories;


import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import com.google.cloud.spring.data.datastore.repository.query.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserStatus;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends DatastoreRepository<User, String>{

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    Optional<User> findByVerifyHash(String verifyHash);

    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String nickname);

    Optional<User> findByNicknameAndStatus(String nickname, UserStatus status);

    Optional<User> findByEmailAndStatus(String email, UserStatus status);

    Page<User> findAll(Pageable pageable);

    @Query("SELECT * FROM users WHERE nickname >= @start AND nickname < @end")
    Page<User> findByNicknameLike(@Param("start") String start, @Param("end") String end, Pageable pageable);

    @Query("SELECT * FROM users WHERE nickname >= @start AND nickname < @end")
    List<User> findByNicknameLike2(@Param("start") String start, @Param("end") String end, Pageable pageable);
}
