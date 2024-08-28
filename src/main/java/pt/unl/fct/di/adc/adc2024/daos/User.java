package pt.unl.fct.di.adc.adc2024.daos;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import com.google.cloud.spring.data.datastore.core.mapping.Unindexed;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pt.unl.fct.di.adc.adc2024.daos.enums.Role;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserStatus;

import java.io.Serializable;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static pt.unl.fct.di.adc.adc2024.daos.enums.UserLevels.LEVEL_1;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "users")
public class User extends DAO implements UserDetails, Serializable {

    private String nickname;

    @ToString.Exclude
    @Unindexed
    private String password;

    private String name;

    private String email;

    @Unindexed
    private String phoneNum;

    private UserStatus status = UserStatus.INACTIVE;

    private String verifyHash = new BigInteger(650, new SecureRandom()).toString(32);

    private Role role = Role.USER;

    private boolean isPublic = true;

    @Unindexed
    private String address;

    @Unindexed
    private String postalCode;

    @Unindexed
    private String nif;

    @Unindexed
    private String profilePic;

    @Unindexed
    private String bannerPic;

    private Set<String> friendRequests = new HashSet<>();

    private Set<String> friends = new HashSet<>();

    private Set<String> friendRequestsSent = new HashSet<>();

    private Set<String> communities = new HashSet<>();

    private Set<String> chats = new HashSet<>();

    @Unindexed
    private int leafPoints = 0;

    private int level = 1;

    @Unindexed
    private int levelExp = 0;

    @Unindexed
    private int levelExpToNextLevel = LEVEL_1.getExpRequiredLevelUp();

    @Unindexed
    private boolean finishedRegister = false;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    /**
     * RETURNS EMAIL, NOT USERNAME
     * 
     * @return EMAIL !!!
     */
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
