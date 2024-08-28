package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import lombok.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "chats")
public class Chat extends DAO implements Serializable {

    private String chatName;

    private String chatPic;

    private Set<String> users = new HashSet<>();

    private Set<String> hiddenUsers = new HashSet<>();

    private boolean isOwnerDeleted = false;
}
