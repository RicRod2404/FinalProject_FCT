package pt.unl.fct.di.adc.adc2024.controllers;

import com.google.common.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pt.unl.fct.di.adc.adc2024.daos.Sales;
import pt.unl.fct.di.adc.adc2024.dtos.forms.products.SellProductForm;
import pt.unl.fct.di.adc.adc2024.dtos.responses.SaleResponse;
import pt.unl.fct.di.adc.adc2024.services.SalesService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/sales")
public class SalesController extends AbstractController {

    private final SalesService salesService;

    @PutMapping
    @PreAuthorize("authentication.principal.username == #form.email")
    public ResponseEntity<SaleResponse> sellProduct(@Validated @RequestBody SellProductForm form) {
        return ok(salesService.sell(form), SaleResponse.class);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('SU', 'GS')")
    @SneakyThrows
    public ResponseEntity<Page<SaleResponse>> listAdmin(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
        var token = new TypeToken<List<SaleResponse>>(){}.getType();
        Page<Sales> result = salesService.listAdmin(page, size).get();
        Page<SaleResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(), result.getTotalElements());
        return ok(res);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SU', 'GS') or authentication.principal.username == #email")
    @SneakyThrows
    public ResponseEntity<Page<SaleResponse>> list(@RequestParam String email, @RequestParam(defaultValue = "0") Integer page,
                                                   @RequestParam(defaultValue = "10") Integer size) {
        var token = new TypeToken<List<SaleResponse>>(){}.getType();
        Page<Sales> result = salesService.list(email, page, size).get();
        Page<SaleResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(), result.getTotalElements());
        return ok(res);
    }


}
