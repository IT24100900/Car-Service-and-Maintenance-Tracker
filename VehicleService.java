package com.autotrack.service;

import com.autotrack.model.Vehicle;
import com.autotrack.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VehicleService {
    @Autowired private VehicleRepository vehicleRepo;

    public List<Vehicle> getByUser(String userId) { return vehicleRepo.findByUserId(userId); }

    public Vehicle create(Vehicle v, String userId) {
        v.setUserId(userId);
        return vehicleRepo.save(v);
    }

    public Vehicle update(String id, Vehicle v, String userId) {
        Vehicle existing = vehicleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        if (!existing.getUserId().equals(userId))
            throw new RuntimeException("Unauthorized");
        v.setId(id);
        v.setUserId(userId);
        return vehicleRepo.save(v);
    }

    public void delete(String id, String userId) {
        Vehicle v = vehicleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        if (!v.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");
        vehicleRepo.deleteById(id);
    }

    public List<Vehicle> getAll() { return vehicleRepo.findAll(); }
}
