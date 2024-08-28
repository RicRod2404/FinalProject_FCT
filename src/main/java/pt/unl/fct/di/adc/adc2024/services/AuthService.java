package pt.unl.fct.di.adc.adc2024.services;

import io.jsonwebtoken.impl.DefaultClaims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.Session;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserStatus;
import pt.unl.fct.di.adc.adc2024.dtos.forms.user.LoginForm;
import pt.unl.fct.di.adc.adc2024.repositories.SessionRepository;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;
import pt.unl.fct.di.adc.adc2024.utils.AuthUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository users;

    private final SessionRepository sessions;

    private final PasswordEncoder encoder;

    @Value("${mapsApiKey}")
    private String mapsApiKey;

    public String getMapsApiKey() {
        return mapsApiKey;
    }

    @Override
    public User loadUserByUsername(String email) throws UsernameNotFoundException {
        return users.findByEmailAndStatus(email.toLowerCase(), UserStatus.ACTIVE).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public Session loadSession(String id) {
        return sessions.findById(id).orElseThrow( () -> new ResponseStatusException(HttpStatus.FORBIDDEN));
    }

    @Transactional
    public Optional<Void> login(LoginForm login, HttpServletRequest request, HttpServletResponse response) {
        var user = loadUserByUsername(login.getEmail().trim());
        if (!encoder.matches(login.getPassword(), user.getPassword()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        if (sessions.existsByUserAndEndedIsNull(user.getId())) {
            var session = sessions.findByUserAndEndedIsNull(user.getId()).get();
            session.setEnded(LocalDateTime.now());
            sessions.save(session);
        }

        var session = new Session(request.getHeader(HttpHeaders.USER_AGENT), null, user.getId());
        sessions.save(session);
        var claims = new HashMap<String, Object>();
        claims.put("email", user.getEmail());
        claims.put("nickname", user.getNickname());
        claims.put("profilePic", user.getProfilePic());
        claims.put("role", user.getRole().name());
        claims.put("agent", request.getHeader(HttpHeaders.USER_AGENT));
        claims.put("jti", session.getId());
        var token = AuthUtils.build(new DefaultClaims(claims));
        response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        return Optional.empty();
    }

    @Transactional
    public Optional<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        var token = request.getHeader(HttpHeaders.AUTHORIZATION);
        var claims = AuthUtils.parse(token);
        var session = loadSession( (String) claims.get("jti"));
        session.setEnded(LocalDateTime.now());
        response.setHeader(HttpHeaders.AUTHORIZATION, null);
        sessions.save(session);
        return Optional.empty();
    }


}
