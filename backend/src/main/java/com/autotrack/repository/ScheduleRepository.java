package com.autotrack.repository;

import com.autotrack.model.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository extends MongoRepository<Schedule, String> {
    List<Schedule> findByUserId(String userId);
    List<Schedule> findByServiceDate(LocalDate serviceDate);
    List<Schedule> findByUserIdAndVehicleId(String userId, String vehicleId);
}
