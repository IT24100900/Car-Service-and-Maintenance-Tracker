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
@Document(collection = "schedules")
public class Schedule {
    @Id
    private String id;
    private String userId;
    private String vehicleId;
    private LocalDate serviceDate;
    private String serviceTime;
    private String serviceType;
    private String status = "PENDING";
    private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();
}
