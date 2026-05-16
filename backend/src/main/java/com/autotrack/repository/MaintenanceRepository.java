package com.autotrack.repository;

import com.autotrack.model.Maintenance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MaintenanceRepository extends MongoRepository<Maintenance, String> {
    List<Maintenance> findByUserId(String userId);
    List<Maintenance> findByVehicleId(String vehicleId);
    List<Maintenance> findByUserIdAndVehicleId(String userId, String vehicleId);
}

