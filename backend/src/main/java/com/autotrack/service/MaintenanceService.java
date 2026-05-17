package com.autotrack.service;

import com.autotrack.model.Maintenance;
import com.autotrack.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MaintenanceService {
    @Autowired private MaintenanceRepository repo;

    public List<Maintenance> getByUser(String userId) { return repo.findByUserId(userId); }

    public Maintenance create(Maintenance m, String userId) {
        m.setUserId(userId);
        return repo.save(m);
    }

    public Maintenance update(String id, Maintenance m, String userId) {
        Maintenance existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (!existing.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");
        m.setId(id);
        m.setUserId(userId);
        return repo.save(m);
    }

    public void delete(String id, String userId) {
        Maintenance m = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (!m.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");
        repo.deleteById(id);
    }

    public List<Maintenance> getAll() { return repo.findAll(); }
}
