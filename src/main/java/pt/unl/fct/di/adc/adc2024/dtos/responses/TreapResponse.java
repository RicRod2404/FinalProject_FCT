package pt.unl.fct.di.adc.adc2024.dtos.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.di.adc.adc2024.daos.Point;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class TreapResponse implements Serializable {

    private String nickname;

    private String profilePic;

    private List<Point> pointList;

    private int leafPoints;

    private double duration;

    private double distance;

    private double carbonFootprint;

    private LocalDateTime lastModifiedDate;

}
