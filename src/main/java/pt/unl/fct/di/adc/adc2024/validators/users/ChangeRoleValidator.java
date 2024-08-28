package pt.unl.fct.di.adc.adc2024.validators.users;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.dtos.forms.user.ChangeRoleForm;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;

import static pt.unl.fct.di.adc.adc2024.daos.enums.Role.*;

@Component
@RequiredArgsConstructor
public class ChangeRoleValidator implements Validator {

    private final UserRepository users;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == ChangeRoleForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var form = (ChangeRoleForm) target;

        if (errors.hasErrors())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        var user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal.getRole().getCredentialLevel() < GA.getCredentialLevel()) {
            if (!(principal.getRole() == GBO &&
                    user.getRole().getCredentialLevel() < GBO.getCredentialLevel() &&
                    form.getRole().getCredentialLevel() < GBO.getCredentialLevel()))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        } else {
            if ((user.getRole().getCredentialLevel() >= principal.getRole().getCredentialLevel() ||
                    form.getRole().getCredentialLevel() >= principal.getRole().getCredentialLevel()) && principal.getRole() != SU)
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}
