package pt.unl.fct.di.adc.adc2024.dtos.forms.chats;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class ChatForm implements Serializable {

    @NotBlank
    private String originNickname;

    @NotBlank
    private String message;
}
