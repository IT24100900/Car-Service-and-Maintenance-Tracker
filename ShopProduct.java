package com.autotrack.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class ShopProduct {
    @Id
    private String id;
    private String name;
    private String description;
    private String category;
    private double price;
    private int stock;
    private String imageUrl;
    private double rating = 4.5;
    private boolean active = true;
}
