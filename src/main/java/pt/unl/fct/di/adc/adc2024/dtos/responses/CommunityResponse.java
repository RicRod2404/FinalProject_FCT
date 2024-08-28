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
public class CommunityResponse implements Serializable {

    String leaderNickname;

    String name;

    String description;

    String communityPic;

    int communityLevel;

    int communityExp;

    int communityExpToNextLevel;

    int minLevelToJoin;

    int currentMembers;

    int maxMembers;

    boolean isPublic;
}
