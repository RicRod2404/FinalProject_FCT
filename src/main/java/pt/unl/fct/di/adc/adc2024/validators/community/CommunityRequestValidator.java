package pt.unl.fct.di.adc.adc2024.validators.community;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.dtos.forms.community.RequestCommunityForm;
import pt.unl.fct.di.adc.adc2024.repositories.CommunityRepository;

import static pt.unl.fct.di.adc.adc2024.daos.enums.Role.GA;
import static pt.unl.fct.di.adc.adc2024.daos.enums.Role.GC;

@Component
@RequiredArgsConstructor
public class CommunityRequestValidator implements Validator {

    private final CommunityRepository communities;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == RequestCommunityForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var form = (RequestCommunityForm) target;

        var community = communities.findByName(form.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal.getId().equals(community.getLeaderId()) || community.getModeratorsId().contains(principal.getId())) &&
                !(principal.getRole() == GC || principal.getRole().getCredentialLevel() >= GA.getCredentialLevel()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
}
