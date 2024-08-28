package pt.unl.fct.di.adc.adc2024.dtos.forms.community;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class EditCommunityForm implements Serializable {

    String oldName;

    String name;

    String description;

    String communityPic;

    int minLevelToJoin;

    boolean isPublic;
}
