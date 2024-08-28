package pt.unl.fct.di.adc.adc2024.services;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.Product;
import pt.unl.fct.di.adc.adc2024.daos.ProductCategory;
import pt.unl.fct.di.adc.adc2024.daos.Stock;
import pt.unl.fct.di.adc.adc2024.dtos.forms.products.AddStockForm;
import pt.unl.fct.di.adc.adc2024.dtos.forms.products.ProductForm;
import pt.unl.fct.di.adc.adc2024.repositories.ProductCategoryRepository;
import pt.unl.fct.di.adc.adc2024.repositories.ProductRepository;
import pt.unl.fct.di.adc.adc2024.repositories.StockRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static pt.unl.fct.di.adc.adc2024.config.RedisConfig.PRODUCTS;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository products;

    private final ProductCategoryRepository categories;

    private final StorageService storage;

    private final StockRepository stocks;

    @Transactional
    @CacheEvict(value = PRODUCTS, key = "'list'")
    public Optional<Product> create(Product product, MultipartFile picture) throws ExecutionException, InterruptedException {
        product.setPhoto(storage.uploadFile(product.getId(), StorageService.Folder.PRODUCTS, picture).get());
        product.setInternalCode(product.getInternalCode().trim());
        product.setName(product.getName().trim());
        stocks.save(new Stock(product.getInternalCode(), 0, new HashSet<>(), new HashSet<>()));
        return Optional.of(products.save(product));
    }

    public Product get(String internalCode) throws ExecutionException, InterruptedException {
        return products.findByInternalCode(internalCode).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    @CacheEvict(value = PRODUCTS, key = "'list'")
    public Optional<Product> edit(ProductForm form, MultipartFile picture) throws ExecutionException, InterruptedException {
        Product p = products.findByInternalCode(form.getInternalCode()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        p.setName(form.getName().trim());
        p.setDescription(form.getDescription());
        p.setCategory(form.getCategory());
        p.setPrice(form.getPrice());

        if (form.isProfilePicDeleted()) {
            storage.deleteFile(p.getId(), StorageService.Folder.PRODUCTS);
            p.setPhoto(null);
        }

        if (!form.isProfilePicDeleted() && picture != null)
            p.setPhoto(storage.uploadFile(p.getId(), StorageService.Folder.PRODUCTS, picture).get());

        return Optional.of(products.save(p));
    }

    @Transactional
    @CacheEvict(value = PRODUCTS, key = "'list'")
    public Optional<Void> delete(String internalCode) {
        Product p = products.findByInternalCode(internalCode).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Stock s = stocks.findByInternalCode(p.getInternalCode()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        stocks.delete(s);
        products.delete(p);
        storage.deleteFile(p.getInternalCode(), StorageService.Folder.PRODUCTS);

        return Optional.empty();
    }

    @Cacheable(value = PRODUCTS, key = "'list'")
    public List<Product> list() {
        return products.findAll();
    }

    @Transactional
    public Optional<Stock> addStock(AddStockForm form) {
        Product p = products.findByInternalCode(form.getInternalCode()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Stock stock = stocks.findByInternalCode(p.getInternalCode()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        stock.setStock(stock.getStock() + form.getQuantity());

        if (p.getCategory().stream().map(ProductCategory::getName).anyMatch("Cupão"::equals)) {
            for (int i = 0; i < form.getQuantity(); i++) {
                stock.getRedeemCode().add(UUID.randomUUID().toString());
                stock.getSerialNumber().add(UUID.randomUUID().toString());
            }
        } else {
            for (int i = 0; i < form.getQuantity(); i++) {
                stock.getSerialNumber().add(UUID.randomUUID().toString());
            }
        }

        return Optional.of(stocks.save(stock));
    }

    @Transactional
    @CacheEvict(value = PRODUCTS, key = "'categories'")
    public Optional<ProductCategory> addCategory(String name) {
        if (categories.existsByName(name))
            throw new ResponseStatusException(HttpStatus.CONFLICT);

        return Optional.of(categories.save(new ProductCategory(name.trim())));
    }

    @Cacheable(value = PRODUCTS, key = "'categories'")
    public List<ProductCategory> getCategories() {
        return categories.findAll();
    }

    @Transactional
    @CacheEvict(value = PRODUCTS, key = "'categories'")
    public Optional<Void> deleteCategory(String name) {
        if (name.equals("Cupão"))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        ProductCategory c = categories.findByName(name).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var lp = products.findAll();

        for (Product p : lp) {
            if (p.getCategory().stream().anyMatch(productCategory -> productCategory.getName().equals(name))) {
                p.getCategory().removeIf(productCategory -> productCategory.getName().equals(name));
                products.save(p);
            }
        }

        categories.delete(c);
        return Optional.empty();
    }
}
