package com.autotrack.controller;

import com.autotrack.dto.ApiResponse;
import com.autotrack.model.ServiceItem;
import com.autotrack.service.ServiceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/services")
public class ServiceController {
    @Autowired private ServiceItemService service;

    @GetMapping
    public ResponseEntity<?> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ServiceItem s) {
        try { return ResponseEntity.ok(service.create(s)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody ServiceItem s) {
        try { return ResponseEntity.ok(service.update(id, s)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try { service.delete(id); return ResponseEntity.ok(new ApiResponse(true, "Deleted")); }
        catch (Exception e) { return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); }
    }
}
