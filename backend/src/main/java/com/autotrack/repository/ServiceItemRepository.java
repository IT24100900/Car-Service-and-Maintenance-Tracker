package com.autotrack.repository;

import com.autotrack.model.ServiceItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ServiceItemRepository extends MongoRepository<ServiceItem, String> {
    List<ServiceItem> findByActiveTrue();
    List<ServiceItem> findByCategory(String category);
}
