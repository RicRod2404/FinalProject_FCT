package pt.unl.fct.di.adc.adc2024.dtos.responses;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class UserResponseReduced implements Serializable {

    String nickname;

    String profilePic;
}
