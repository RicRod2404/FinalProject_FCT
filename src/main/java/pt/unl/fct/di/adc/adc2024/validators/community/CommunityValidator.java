package pt.unl.fct.di.adc.adc2024.validators.community;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.dtos.forms.community.CommunityForm;
import pt.unl.fct.di.adc.adc2024.repositories.CommunityRepository;

@Component
@RequiredArgsConstructor
public class CommunityValidator implements Validator {

    private final CommunityRepository communities;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == CommunityForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var community = (CommunityForm) target;

        if (errors.hasErrors())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (community.getMinLevelToJoin() < 1)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (community.getName().contains("-"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (communities.existsByName(community.getName().trim()))
            throw new ResponseStatusException(HttpStatus.CONFLICT);

    }
}
