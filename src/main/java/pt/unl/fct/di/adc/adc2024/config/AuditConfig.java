package pt.unl.fct.di.adc.adc2024.config;


import com.google.cloud.spring.data.datastore.repository.config.EnableDatastoreAuditing;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import pt.unl.fct.di.adc.adc2024.daos.User;

import java.util.Optional;

@Configuration
@EnableDatastoreAuditing
public class AuditConfig {
    // This bean is used to set the user that is currently logged in as the auditor for the JPA entities.
    // This is used to set the createdBy and updatedBy fields in the entities.
    @Bean
    AuditorAware<String> auditorAware() {
        return () -> {
            // Get the current context.
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                // Get the principal from the context.
                var principal = auth.getPrincipal();
                if (principal instanceof User user) {
                    return Optional.of(user.getEmail());
                }
            }
            // If no user is logged in, the system is the auditor.
            return Optional.of("System");
        };
    }
}
