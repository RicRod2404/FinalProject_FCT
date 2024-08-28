package pt.unl.fct.di.adc.adc2024.dtos.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.di.adc.adc2024.daos.ProductCategory;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class ProductResponse implements Serializable {

    private String name;

    private String photo;

    private String internalCode;

    private String description;

    private List<ProductCategory> category;

    private int price;

    private Map<String, String> serialNumbersAndRedeemCodes;

}
