package pt.unl.fct.di.adc.adc2024.dtos.forms.community;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class CommunityForm implements Serializable {

    @NotBlank
    @Size(max = 64)
    String name;

    String description;

    int minLevelToJoin;

    boolean isPublic;
}
