package pt.unl.fct.di.adc.adc2024.daos;

import lombok.*;
import org.springframework.data.annotation.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public abstract class DAO {

    @Id
    private String id = UUID.randomUUID().toString();

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    @LastModifiedBy
    private String lastModifiedBy;
}
