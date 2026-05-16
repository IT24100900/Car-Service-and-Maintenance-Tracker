package com.autotrack.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "maintenance")
public class Maintenance {
    @Id
    private String id;
    private String userId;
    private String vehicleId;
    private String serviceType;
    private String description;
    private LocalDate serviceDate;
    private double currentMileage;
    private LocalDate nextServiceDate;
    private double nextServiceMileage;
    private boolean completed = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
