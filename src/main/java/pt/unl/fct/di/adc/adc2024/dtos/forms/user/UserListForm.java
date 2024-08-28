package pt.unl.fct.di.adc.adc2024.dtos.forms.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserStatus;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class UserListForm implements Serializable {
    // Search list

    @NotBlank
    private String nickname;

    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private UserStatus status;

}
