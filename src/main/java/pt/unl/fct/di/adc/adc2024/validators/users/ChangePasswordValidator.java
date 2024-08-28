package pt.unl.fct.di.adc.adc2024.validators.users;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserStatus;
import pt.unl.fct.di.adc.adc2024.dtos.forms.user.ChangePasswordForm;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;

@Component
@RequiredArgsConstructor
public class ChangePasswordValidator implements Validator {

    private final PasswordEncoder encoder;
    private final UserRepository users;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == ChangePasswordForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var form = (ChangePasswordForm) target;

        if (errors.hasErrors())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (!form.getNewPassword().equals(form.getConfirmPassword()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        var user = users.findByNicknameAndStatus(form.getNickname(), UserStatus.ACTIVE).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!encoder.matches(form.getOldPassword(), user.getPassword()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        if (!form.getNewPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
