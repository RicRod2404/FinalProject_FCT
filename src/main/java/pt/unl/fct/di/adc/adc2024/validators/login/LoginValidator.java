package pt.unl.fct.di.adc.adc2024.validators.login;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserStatus;
import pt.unl.fct.di.adc.adc2024.dtos.forms.user.LoginForm;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;

@Component
@RequiredArgsConstructor
public class LoginValidator implements Validator {

    private final UserRepository users;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == LoginForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var form = (LoginForm) target;

        if (errors.hasErrors())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        var user = users.findByEmail(form.getEmail().trim().toLowerCase()).orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));

        if (user.getStatus() == UserStatus.INACTIVE)
            throw new ResponseStatusException(HttpStatus.LOCKED);
    }
}
