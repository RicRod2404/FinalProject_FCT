package pt.unl.fct.di.adc.adc2024.dtos.responses;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class ListCommunityMembersResponse implements Serializable {

    String leaderNickname;

    String leaderProfilePic;

    List<UserResponseReduced> members;

    List<UserResponseReduced> moderators;

}
