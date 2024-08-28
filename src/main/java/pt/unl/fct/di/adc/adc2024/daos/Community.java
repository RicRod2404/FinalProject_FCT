package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import com.google.cloud.spring.data.datastore.core.mapping.Unindexed;
import lombok.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import static pt.unl.fct.di.adc.adc2024.daos.enums.CommunityLevels.LEVEL_1;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "communities")
public class Community extends DAO implements Serializable {

    private String leaderId;

    private String leaderNickname;

    private String name;

    @Unindexed
    private String description;

    @Unindexed
    private String communityPic;

    private int communityLevel = 1;

    @Unindexed
    private int communityExp = 0;

    @Unindexed
    private int communityExpToNextLevel = LEVEL_1.getExpRequiredLevelUp();

    private int minLevelToJoin = 1;

    private int currentMembers = 1;

    @Unindexed
    private int maxMembers = LEVEL_1.getMaxNumOfMembers();

    private Set<String> membersId = new HashSet<>();

    private Set<String> moderatorsId = new HashSet<>();

    private Set<String> requests = new HashSet<>();

    @Unindexed
    private boolean isPublic = true;
}
