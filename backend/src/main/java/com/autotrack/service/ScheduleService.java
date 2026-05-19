package com.autotrack.service;

import com.autotrack.model.Schedule;
import com.autotrack.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ScheduleService {
    @Autowired private ScheduleRepository repo;

    public List<Schedule> getByUser(String userId) { return repo.findByUserId(userId); }

    public Schedule create(Schedule s, String userId) {
        s.setUserId(userId);
        s.setStatus("PENDING");
        return repo.save(s);
    }

    public Schedule update(String id, Schedule s, String userId) {
        Schedule existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (!existing.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");
        s.setId(id);
        s.setUserId(userId);
        return repo.save(s);
    }

    public void delete(String id, String userId) {
        Schedule s = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (!s.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");
        repo.deleteById(id);
    }

    public List<Schedule> getToday() {
        return repo.findByServiceDate(LocalDate.now());
    }

    public List<Schedule> getAll() { return repo.findAll(); }
}
