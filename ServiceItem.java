package com.autotrack.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "services")
public class ServiceItem {
    @Id
    private String id;
    private String name;
    private String description;
    private String category;
    private double price;
    private String duration;
    private String imageUrl;
    private boolean active = true;
}
