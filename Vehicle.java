package com.autotrack.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vehicles")
public class Vehicle {
    @Id
    private String id;
    private String userId;
    private String registrationNumber;
    private String brand;
    private String model;
    private int yearOfManufacture;
    private int yearOfRegistration;
    private String engineType;
    private double mileage;
    private LocalDateTime createdAt = LocalDateTime.now();
}
