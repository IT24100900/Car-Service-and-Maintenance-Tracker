package com.autotrack.controller;

import com.autotrack.dto.ApiResponse;
import com.autotrack.dto.EmailRequest;
import com.autotrack.model.*;
import com.autotrack.repository.*;
import com.autotrack.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired private VehicleService vehicleService;
    @Autowired private MaintenanceService maintenanceService;
    @Autowired private ScheduleService scheduleService;
    @Autowired private EmailService emailService;
    @Autowired private UserRepository userRepo;

    @GetMapping("/vehicles")
    public ResponseEntity<?> allVehicles() {
        return ResponseEntity.ok(vehicleService.getAll());
    }

    @GetMapping("/maintenance")
    public ResponseEntity<?> allMaintenance() {
        return ResponseEntity.ok(maintenanceService.getAll());
    }

    @GetMapping("/schedules")
    public ResponseEntity<?> allSchedules() {
        return ResponseEntity.ok(scheduleService.getAll());
    }

    @GetMapping("/schedules/today")
    public ResponseEntity<?> todaySchedules() {
        return ResponseEntity.ok(scheduleService.getToday());
    }

    @GetMapping("/users")
    public ResponseEntity<?> allUsers() {
        List<User> users = userRepo.findAll();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @PostMapping("/send-reminder")
    public ResponseEntity<?> sendReminder(@RequestBody EmailRequest req) {
        try {
            emailService.sendReminder(req.getTo(), req.getSubject(), req.getBody());
            return ResponseEntity.ok(new ApiResponse(true, "Email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
