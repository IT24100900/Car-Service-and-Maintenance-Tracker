package com.autotrack.repository;

import com.autotrack.model.ShopProduct;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ShopProductRepository extends MongoRepository<ShopProduct, String> {
    List<ShopProduct> findByActiveTrue();
    List<ShopProduct> findByCategory(String category);
}
