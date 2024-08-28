package pt.unl.fct.di.adc.adc2024.dtos.forms.products;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class AddStockForm implements Serializable {

    @NotBlank
    private String internalCode;

    @Size(min = 1)
    private int quantity;
}
