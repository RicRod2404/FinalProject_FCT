package pt.unl.fct.di.adc.adc2024.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.Product;
import pt.unl.fct.di.adc.adc2024.daos.Sales;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.daos.ProductCategory;
import pt.unl.fct.di.adc.adc2024.dtos.forms.products.SellProductForm;
import pt.unl.fct.di.adc.adc2024.repositories.ProductRepository;
import pt.unl.fct.di.adc.adc2024.repositories.SalesRepository;
import pt.unl.fct.di.adc.adc2024.repositories.StockRepository;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final UserRepository users;

    private final ProductRepository products;

    private final SalesRepository sales;

    private final StockRepository stocks;

    @Transactional
    public Optional<Sales> sell(SellProductForm form) {
        Product p = products.findByInternalCode(form.getInternalCode()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal.getLeafPoints() - p.getPrice() < 0)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        var stock = stocks.findByInternalCode(p.getInternalCode()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (stock.getStock() <= 0 || stock.getSerialNumber().isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);


        var serial = stock.getSerialNumber().iterator().next();
        stock.getSerialNumber().remove(serial);
        String code = "N/A";
        if (p.getCategory().stream().map(ProductCategory::getName).anyMatch("Cupão"::equals)) {
            if (!stock.getRedeemCode().isEmpty()) {
                code = stock.getRedeemCode().iterator().next();
                stock.getRedeemCode().remove(code);
            }
        }
        stock.setStock(stock.getStock() - 1);

        stocks.save(stock);
        var sale = sales.save(new Sales(p.getId(), form.getEmail(), form.getInternalCode(), serial, code, p.getPrice()));;

        principal.setLeafPoints(principal.getLeafPoints() - p.getPrice());
        users.save(principal);

        return Optional.of(sale);
    }

    @Async
    public Future<Page<Sales>> listAdmin(Integer page, Integer size) {
        var pageable = PageRequest.of(page, size);
        return CompletableFuture.completedFuture(sales.findAll(pageable));
    }

    @Async
    public Future<Page<Sales>> list(String email, Integer page, Integer size) {
        var user = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var pageable = PageRequest.of(page, size);
        return CompletableFuture.completedFuture(sales.findAllByUserId(user.getId(), pageable));
    }

}
