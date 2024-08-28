package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true)
@Entity(name = "messages")
public class Message implements Serializable {

    @Id
    private String id = UUID.randomUUID().toString();

    private String chatId;

    private LocalDateTime timestamp = LocalDateTime.now();

    private String originNickname;

    @NotBlank
    private String message;
}
