package com.autotrack.controller;

import com.autotrack.dto.ApiResponse;
import com.autotrack.model.Vehicle;
import com.autotrack.security.JwtUtil;
import com.autotrack.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    @Autowired private VehicleService vehicleService;
    @Autowired private JwtUtil jwtUtil;

    private String getUserId(String header) {
        return jwtUtil.extractUserId(header.substring(7));
    }

    @GetMapping
    public ResponseEntity<?> getVehicles(@RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(vehicleService.getByUser(getUserId(auth)));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestHeader("Authorization") String auth,
                                    @RequestBody Vehicle vehicle) {
        try {
            return ResponseEntity.ok(vehicleService.create(vehicle, getUserId(auth)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestHeader("Authorization") String auth,
                                    @PathVariable String id, @RequestBody Vehicle vehicle) {
        try {
            return ResponseEntity.ok(vehicleService.update(id, vehicle, getUserId(auth)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@RequestHeader("Authorization") String auth,
                                    @PathVariable String id) {
        try {
            vehicleService.delete(id, getUserId(auth));
            return ResponseEntity.ok(new ApiResponse(true, "Vehicle deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
