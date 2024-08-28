package pt.unl.fct.di.adc.adc2024.controllers;

import com.google.common.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pt.unl.fct.di.adc.adc2024.daos.Treap;
import pt.unl.fct.di.adc.adc2024.dtos.forms.treaps.TreapForm;
import pt.unl.fct.di.adc.adc2024.dtos.responses.TreapResponse;
import pt.unl.fct.di.adc.adc2024.services.TreapService;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/treaps")
public class TreapController extends AbstractController {

    private final TreapService treapService;

    @PostMapping
    @PreAuthorize("authentication.principal.nickname == #form.nickname")
    public ResponseEntity<TreapResponse> create(@Validated @RequestBody TreapForm form) {
        return ok(treapService.create(convert(form, Treap.class)), TreapResponse.class);
    }

    @GetMapping
    public ResponseEntity<Page<TreapResponse>> list(@RequestParam String nickname, @RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) throws ExecutionException, InterruptedException {
        var token = new TypeToken<List<TreapResponse>>() {
        }.getType();
        Page<Treap> result = treapService.list(nickname, page, size).get();
        Page<TreapResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(),
                result.getTotalElements());
        return ok(res);
    }


    @GetMapping("/feed")
    @PreAuthorize("authentication.principal.nickname == #nickname")
    public ResponseEntity<List<TreapResponse>> feed(@RequestParam String nickname) throws ExecutionException, InterruptedException {
        return ok(treapService.feed(nickname));
    }
}
