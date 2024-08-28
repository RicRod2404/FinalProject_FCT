package pt.unl.fct.di.adc.adc2024.daos.statistics;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
abstract class AbstractStatistics {

    @Id
    private String id = UUID.randomUUID().toString();

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    @LastModifiedBy
    private String lastModifiedBy;

    private int treaps = 0;

    private double carbonFootprint = 0;

    private double distance = 0;

    private int steps = 0;

    private int stopsByFoot = 0;

    private int stopsByCar = 0;

    private int stopsByTransports = 0;

    private int stopsByBike = 0;
}
