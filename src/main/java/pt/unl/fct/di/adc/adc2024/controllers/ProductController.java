package pt.unl.fct.di.adc.adc2024.controllers;

import com.google.common.reflect.TypeToken;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pt.unl.fct.di.adc.adc2024.daos.Product;
import pt.unl.fct.di.adc.adc2024.daos.ProductCategory;
import pt.unl.fct.di.adc.adc2024.dtos.forms.products.AddStockForm;
import pt.unl.fct.di.adc.adc2024.dtos.forms.products.ProductForm;
import pt.unl.fct.di.adc.adc2024.dtos.responses.ProductResponse;
import pt.unl.fct.di.adc.adc2024.services.ProductService;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/products")
public class ProductController extends AbstractController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SU', 'GS', 'GA')")
    public ResponseEntity<ProductResponse> create(@Validated @RequestPart ProductForm form,
            @RequestPart(required = false) MultipartFile photo)
            throws ExecutionException, InterruptedException, MessagingException {
        return ok(productService.create(convert(form, Product.class), photo), ProductResponse.class);
    }

    @GetMapping("/{internalCode}")
    public ResponseEntity<ProductResponse> get(@PathVariable String internalCode)
            throws ExecutionException, InterruptedException {
        return ok(productService.get(internalCode), ProductResponse.class);
    }

    @DeleteMapping("/{internalCode}")
    @PreAuthorize("hasAnyRole('SU', 'GS')")
    public ResponseEntity<Void> delete(@PathVariable String internalCode)
            throws ExecutionException, InterruptedException {
        return ok(productService.delete(internalCode));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('SU', 'GS', 'GA')")
    public ResponseEntity<ProductResponse> edit(@Validated @RequestPart ProductForm form,
            @RequestPart(required = false) MultipartFile photo) throws ExecutionException, InterruptedException {
        return ok(productService.edit(form, photo), ProductResponse.class);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> list() throws ExecutionException, InterruptedException {
        var token = new TypeToken<List<ProductResponse>>() {
        }.getType();
        return ok(productService.list(), token);
    }

    @PutMapping("/stock")
    @PreAuthorize("hasAnyRole('SU', 'GS', 'GA')")
    public ResponseEntity<ProductResponse> addStock(@RequestBody AddStockForm form) {
        return ok(productService.addStock(form), ProductResponse.class);
    }

    @PostMapping("/category/{name}")
    @PreAuthorize("hasAnyRole('SU', 'GS', 'GA')")
    public ResponseEntity<ProductCategory> addCategory(@PathVariable String name) {
        return ok(productService.addCategory(name));
    }

    @GetMapping("/category")
    @SneakyThrows
    public List<ProductCategory> getCategories() {
        return productService.getCategories();
    }

    @DeleteMapping("/category/{name}")
    @PreAuthorize("hasAnyRole('SU', 'GS')")
    public ResponseEntity<Void> deleteCategory(@PathVariable String name) {
        return ok(productService.deleteCategory(name));
    }
}