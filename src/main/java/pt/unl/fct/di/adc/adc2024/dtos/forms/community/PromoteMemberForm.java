package pt.unl.fct.di.adc.adc2024.dtos.forms.community;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class PromoteMemberForm implements Serializable {

    @NotBlank
    private String name;

    @NotBlank
    private String nickname;
}
