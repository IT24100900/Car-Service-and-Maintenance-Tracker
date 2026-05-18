//communicates with mongoDB
package com.autotrack.repository;

import com.autotrack.model.ServiceItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ServiceItemRepository extends MongoRepository<ServiceItem, String> { //automatically gives save(),findAll(),deleteById(),findById()
    List<ServiceItem> findByActiveTrue(); //returns only active services
    List<ServiceItem> findByCategory(String category); //returns services by category
}
