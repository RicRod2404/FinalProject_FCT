package pt.unl.fct.di.adc.adc2024;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import pt.unl.fct.di.adc.adc2024.daos.Ranking;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.daos.enums.Role;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserStatus;
import pt.unl.fct.di.adc.adc2024.repositories.CommunityRepository;
import pt.unl.fct.di.adc.adc2024.repositories.RankingRepository;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;
import pt.unl.fct.di.adc.adc2024.services.EmailService;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.HashSet;

@SpringBootApplication
public class Adc2024Application implements CommandLineRunner {

    @Autowired
    UserRepository users;

    @Autowired
    RankingRepository rankings;

    @Autowired
    EmailService email;

    public static void main(String[] args) {
        SpringApplication.run(Adc2024Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        if (!users.existsByNickname("root")) {
            var root = new User("root", null, "root", "rs.albuquerque@campus.fct.unl.pt", "+351964051933",
                    UserStatus.ACTIVE, new BigInteger(650, new SecureRandom()).toString(32), Role.SU, true, null, null,
                    null,
                    null, null, new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(),
                    999999, 30, 0, Integer.MAX_VALUE,
                    true);

            rankings.save(new Ranking(true, root.getId(), root.getNickname(), 0, 0, 0));

            users.save(root);
            email.sendHashEmail(root, "forgotPasswordEmail", "Password Reset");
        }
    }
}
