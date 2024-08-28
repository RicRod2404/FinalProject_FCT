package pt.unl.fct.di.adc.adc2024.dtos.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class StatisticsResponse implements Serializable {

    private String nickname;

    private double carbonFootprint;

    private double distance;

    private int steps;

    private int stopsByFoot;

    private int stopsByCar;

    private int stopsByTransports;
}
