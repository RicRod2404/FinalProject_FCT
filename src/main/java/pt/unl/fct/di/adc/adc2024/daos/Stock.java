package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "stock")
public class Stock extends DAO implements Serializable {

    private String internalCode;

    private int stock = 0;

    private Set<String> serialNumber = new HashSet<>();

    private Set<String> redeemCode = new HashSet<>();
}
