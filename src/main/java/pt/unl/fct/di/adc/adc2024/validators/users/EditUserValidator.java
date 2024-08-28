package pt.unl.fct.di.adc.adc2024.validators.users;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.dtos.forms.user.EditUserForm;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;

import static pt.unl.fct.di.adc.adc2024.daos.enums.Role.*;

@Component
@RequiredArgsConstructor
public class EditUserValidator implements Validator {

    private final UserRepository users;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == EditUserForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var form = (EditUserForm) target;

        if (errors.hasErrors())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (!form.getNif().matches("^\\d+$"))
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED);

        if (!form.getPostalCode().matches("^\\d{4}(-\\d{3})?$"))
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED);

        if (form.getPhoneNum() != null && !form.getPhoneNum().isEmpty() && !form.getPhoneNum().matches("^\\+(?:[0-9] ?){6,14}[0-9]$"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        User user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal.getRole().getCredentialLevel() < GBO.getCredentialLevel() &&
                !principal.getNickname().equals(user.getNickname()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
}
