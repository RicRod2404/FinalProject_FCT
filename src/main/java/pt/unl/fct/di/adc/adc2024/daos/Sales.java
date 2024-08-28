package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "sales")
public class Sales extends DAO implements Serializable {

    private String userId;

    private String email;

    private String internalCode;

    private String serialNumber;

    private String redeemCode;

    private int price;
}
