package pt.unl.fct.di.adc.adc2024.dtos.forms.products;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import pt.unl.fct.di.adc.adc2024.daos.ProductCategory;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class ProductForm implements Serializable {

    @NotBlank
    @Size(max = 64)
    private String name;

    @NotBlank
    @Size(max = 32)
    private String internalCode;

    @NotBlank
    @Size(max = 2560)
    private String description;

    @NotEmpty
    @Size(max = 64)
    private List<ProductCategory> category;

    @NotNull
    private int price;

    private boolean profilePicDeleted;

}
