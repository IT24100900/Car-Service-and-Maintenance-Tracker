package com.autotrack.controller;

import com.autotrack.dto.ApiResponse;
import com.autotrack.model.Schedule;
import com.autotrack.security.JwtUtil;
import com.autotrack.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {
    @Autowired private ScheduleService service;
    @Autowired private JwtUtil jwtUtil;

    private String uid(String h) { return jwtUtil.extractUserId(h.substring(7)); }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(service.getByUser(uid(auth)));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestHeader("Authorization") String auth,
                                    @RequestBody Schedule s) {
        try { return ResponseEntity.ok(service.create(s, uid(auth))); }
        catch (Exception e) { return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestHeader("Authorization") String auth,
                                    @PathVariable String id, @RequestBody Schedule s) {
        try { return ResponseEntity.ok(service.update(id, s, uid(auth))); }
        catch (Exception e) { return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@RequestHeader("Authorization") String auth,
                                    @PathVariable String id) {
        try { service.delete(id, uid(auth)); return ResponseEntity.ok(new ApiResponse(true, "Deleted")); }
        catch (Exception e) { return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); }
    }
}
