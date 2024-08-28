package pt.unl.fct.di.adc.adc2024.dtos.forms.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.di.adc.adc2024.daos.enums.Role;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class ChangeRoleForm implements Serializable {

    @NotBlank
    @Size(max = 64)
    private String nickname;

    @NotNull
    private Role role;
}
