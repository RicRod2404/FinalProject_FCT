package pt.unl.fct.di.adc.adc2024.dtos.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class ChatResponse implements Serializable {

    private String id;

    private String chatName;

    private String chatPic;
}
