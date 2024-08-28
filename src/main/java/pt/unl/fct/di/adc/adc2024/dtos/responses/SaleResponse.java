package pt.unl.fct.di.adc.adc2024.dtos.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class SaleResponse implements Serializable {

    private String userId;

    private String email;

    private String internalCode;

    private String serialNumber;

    private String redeemCode;

    private int price;

    private LocalDateTime lastModifiedDate;
}
