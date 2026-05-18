package com.autotrack.repository;

import com.autotrack.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    List<Vehicle> findByUserId(String userId);
    boolean existsByRegistrationNumber(String registrationNumber);
}
