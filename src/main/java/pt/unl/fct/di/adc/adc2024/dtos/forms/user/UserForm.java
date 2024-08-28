package pt.unl.fct.di.adc.adc2024.dtos.forms.user;

import jakarta.validation.constraints.*;
import lombok.*;

import java.io.Serializable;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class UserForm implements Serializable {

    @NotBlank
    @Size(max = 64)
    private String nickname;

    @NotBlank
    @Size(max = 64)
    private String password;

    @NotBlank
    @Size(max = 64)
    private String confirmPassword;

    @NotBlank
    @Size(max = 64)
    @Email(regexp = ".+@.+\\..+")
    private String email;
}
