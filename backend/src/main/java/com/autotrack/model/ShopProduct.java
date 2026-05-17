package com.autotrack.model;

//import lombok.Data;
//import lombok.NoArgsConstructor;
//import lombok.AllArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor

// telling mongoDB  which collection to store documents
@Document(collection = "products")
public class ShopProduct {

    //mongoDB id field (primary key)
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

    //default constructor
    public ShopProduct() {
    }

    //parameterized constructor
    public ShopProduct(String id, String name, String description, String category, double price, int stock, String imageUrl, double rating, boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.active = active;
    }

    //getters & setters

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }
    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getRating() {
        return rating;
    }
    public void setRating(double rating) {
        this.rating = rating;
    }

    public boolean isActive() {
        return active;
    }
    public void setActive(boolean active) {
        this.active = active;
    }

    // @Data also generates toString(), equals(), hashCode()
    /*
    optional printing line 
    @Override
    public String toString() {
        return "ShopProduct{id='" + id + "', name='" + name + "', price=" + price + "}";
    }
     */

}
