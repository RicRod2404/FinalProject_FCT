package pt.unl.fct.di.adc.adc2024.validators.community;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.dtos.forms.community.DemoteMemberForm;
import pt.unl.fct.di.adc.adc2024.repositories.CommunityRepository;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;

import static pt.unl.fct.di.adc.adc2024.daos.enums.Role.GA;
import static pt.unl.fct.di.adc.adc2024.daos.enums.Role.GC;

@Component
@RequiredArgsConstructor
public class DemoteMemberValidator implements Validator {

    private final CommunityRepository communities;

    private final UserRepository users;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == DemoteMemberForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var form = (DemoteMemberForm) target;

        if (errors.hasErrors())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        var community = communities.findByName(form.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!community.getModeratorsId().contains(user.getId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        if (user.getId().equals(community.getLeaderId()) || community.getMembersId().contains(user.getId()))
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);

        if (!isAppAdmin(principal) && !principal.getId().equals(community.getLeaderId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }

    private boolean isAppAdmin(User principal) {
        return (principal.getRole() == GC || principal.getRole().getCredentialLevel() >= GA.getCredentialLevel());
    }
}
