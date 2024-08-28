package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import com.google.cloud.spring.data.datastore.core.mapping.Unindexed;
import lombok.*;

import java.io.Serializable;
import java.util.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "products")
public class Product extends DAO implements Serializable {

    private String name;

    private String internalCode;

    @Unindexed
    private String description;

    private List<ProductCategory> category = new ArrayList<>();

    @Unindexed
    private String photo;

    private int price;
}
