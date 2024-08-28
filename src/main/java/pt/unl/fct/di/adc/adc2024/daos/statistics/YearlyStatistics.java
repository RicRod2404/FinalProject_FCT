package pt.unl.fct.di.adc.adc2024.daos.statistics;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "yearlystats")
public class YearlyStatistics extends AbstractStatistics implements Serializable {

    private String userId;

    private int year;


}
