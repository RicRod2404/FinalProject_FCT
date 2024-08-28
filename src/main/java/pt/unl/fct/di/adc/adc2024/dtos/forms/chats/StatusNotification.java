package pt.unl.fct.di.adc.adc2024.dtos.forms.chats;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class StatusNotification implements Serializable {

    private String user;
    private boolean writing;
}
