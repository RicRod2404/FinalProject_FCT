package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Point implements Serializable {

    private double latitude;

    private double longitude;

    private String transport;
}
