package pt.unl.fct.di.adc.adc2024.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class CommunityRequestResponse implements Serializable {

    String nickname;

    String profilePic;
}
