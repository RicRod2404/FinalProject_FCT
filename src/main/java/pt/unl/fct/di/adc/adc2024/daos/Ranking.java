package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "rankings")
public class Ranking extends DAO implements Serializable {

    boolean isUser;

    private String targetId;

    private String targetName;

    private int leafPoints;

    private int month;

    private int year;
}
