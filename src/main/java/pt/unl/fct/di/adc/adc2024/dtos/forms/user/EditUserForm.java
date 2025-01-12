package pt.unl.fct.di.adc.adc2024.dtos.forms.user;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class EditUserForm implements Serializable {

    @Size(max = 64)
    private String nickname;

    @Size(max = 64)
    private String name;

    private String phoneNum;

    @Size(max = 64)
    private String address;

    @Size(max = 32)
    private String postalCode;

    @Size(max = 9)
    private String nif;

    private boolean profilePicDeleted;

}
