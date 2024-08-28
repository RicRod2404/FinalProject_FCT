package pt.unl.fct.di.adc.adc2024.dtos.forms.products;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class SellProductForm implements Serializable {

    @NotBlank
    private String email;

    @NotBlank
    private String internalCode;
}
