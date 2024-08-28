package pt.unl.fct.di.adc.adc2024.validators.community;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.dtos.forms.community.LeaveCommunityForm;
import pt.unl.fct.di.adc.adc2024.repositories.CommunityRepository;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;

@Component
@RequiredArgsConstructor
public class CommunityLeaveValidator implements Validator {

    private final CommunityRepository communities;

    private final UserRepository users;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == LeaveCommunityForm.class;
    }

    @Override
    public void validate(Object target, Errors errors) {
        var form = (LeaveCommunityForm) target;

        var user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var community = communities.findByName(form.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!community.getMembersId().contains(user.getId()) && !community.getModeratorsId().contains(user.getId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        if (user.getId().equals(community.getLeaderId()) || !user.getId().equals(principal.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

    }

}
