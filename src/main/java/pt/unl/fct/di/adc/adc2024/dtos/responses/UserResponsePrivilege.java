package pt.unl.fct.di.adc.adc2024.dtos.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.di.adc.adc2024.daos.enums.Role;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserStatus;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class UserResponsePrivilege extends UserResponse implements Serializable {

    private String email;

    private String phoneNum;

    private UserStatus status;

    private Role role;

    private String address;

    private String postalCode;

    private String nif;

    private int leafPoints;

    private boolean finishedRegister;
}
