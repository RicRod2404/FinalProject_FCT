package pt.unl.fct.di.adc.adc2024.dtos.forms.treaps;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import pt.unl.fct.di.adc.adc2024.daos.Point;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class TreapForm implements Serializable {

    @NotBlank
    @Size(max = 64)
    private String nickname;

    //private String profilePic; // Added in backend, so that frontend code doesn't need to be changed

    @NotNull
    private int leafPoints;

    @NotNull
    private double duration;

    @NotNull
    private double distance;

    @NotNull
    private double carbonFootprint;

    @NotNull
    private List<Point> pointList;
}
