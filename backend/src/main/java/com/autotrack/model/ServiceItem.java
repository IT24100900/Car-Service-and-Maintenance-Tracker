package com.autotrack.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data //automatically creates getters, setters
@NoArgsConstructor //creates empty constructor
@AllArgsConstructor//creates constructor with all fields
    
@Document(collection = "services")
//store data inside MongoDB services collection
    
public class ServiceItem {
    @Id
    private String id;
    private String name;
    private String description;
    private String category;
    private double price;
    private String duration; //time needed 
    private String imageUrl; //img link
    private boolean active = true;
}
