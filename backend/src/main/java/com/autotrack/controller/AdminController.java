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

    //get all vehicles
    @GetMapping("/vehicles")
    public ResponseEntity<?> allVehicles() {
        //get all vehicles from vehicle services
        List<Vehicle> vehicles = vehicalService.getAll();
        return ResponseEntity.ok(vehicles);  //return the list with HTTP 200   
    }

    //getting all maintenance records
    @GetMapping("/maintenance")
    public ResponseEntity<?> allMaintenance() {
        // get all maintenance records from maintenance service
        List<Maintenance> maintenanceList = maintenanceService.getAll();
        // return the list with HTTP 200
        return ResponseEntity.ok(maintenanceList);
    }

    //getting all schedules
    @GetMapping("/schedules")
    public ResponseEntity<?> allSchedules() {
        // get all schedules from schedule service
        List<Schedule> schedules = scheduleService.getAll();

        // return the list with HTTP 200
        return ResponseEntity.ok(schedules);
    }

    //getting todays schdules only
    @GetMapping("/schedules/today")
    public ResponseEntity<?> todaySchedules() {
        // get only todays schedules from schedule service
        List<Schedule> todaySchedules = scheduleService.getToday();

        // return the list with HTTP 200
        return ResponseEntity.ok(todaySchedules);
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
