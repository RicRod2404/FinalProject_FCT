package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import com.google.cloud.spring.data.datastore.core.mapping.Unindexed;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "treaps")
public class Treap extends DAO implements Serializable {

    private String userId;

    private String nickname;

    @Unindexed
    private String profilePic;

    private List<Point> pointList;

    @Unindexed
    private int leafPoints;

    @Unindexed
    private double duration;

    @Unindexed
    private double distance;

    @Unindexed
    private double carbonFootprint;

}
