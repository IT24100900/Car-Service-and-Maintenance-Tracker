package com.autotrack.service;

import com.autotrack.model.ServiceItem;
import com.autotrack.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServiceItemService {
    @Autowired private ServiceItemRepository repo;

    public List<ServiceItem> getAll() { return repo.findByActiveTrue(); }

    public ServiceItem create(ServiceItem s) { return repo.save(s); }

    public ServiceItem update(String id, ServiceItem s) {
        s.setId(id);
        return repo.save(s);
    }

    public void delete(String id) {
        ServiceItem s = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        s.setActive(false);
        repo.save(s);
    }
}
