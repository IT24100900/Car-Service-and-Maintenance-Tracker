package com.autotrack.controller;

import com.autotrack.dto.ApiResponse;
import com.autotrack.model.ShopProduct;
import com.autotrack.service.ShopService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shop")

public class ShopController{
  @Autowired
  private ShopService service;

  //READ
  @GetMapping
  public ResponseEntity<?> getAll(){

    //get all active products from service
    List<ShopProduct> products = service.getAll();

    return ResponseEntity.ok(products);
    }

  //CREATE
  @PostMapping
  public ResponseEntity<?> create(@RequestBody ShopProduct p){

  //try to save the new product to database
  try{

    //send product to service layer - handle saving
    ShopProduct savedProduct = service.create(p);

    //if saving successful return
    return ResponseEntity.ok(savedProduct);
  }
  catch(Exception e){
    //if some error occurs
    System.out.println("Error creating product: " + e.getMessage());
    return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

  //UPDATE 
  @PutMapping("/{id}")
  public ResponseEntity<?> update(@PathVariable String id, @RequestBody ShopProduct p){
    //try to update the product with given id
    try {
      //send id and updated data to service layer
      ShopProduct updatedProduct = service.update(id, p);
      return ResponseEntity.ok(updatedProduct);
    }
    catch(Exception e){
      //if any error occurs
      System.out.println("Error updating product: " + e.getMessage());
      return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

  //DELETE
  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable String id){
    //try to delete the product with the given ID
    try {
      //add a comment here
      service.delete(id);
      System.out.println("Product deleted successfully with id: " + id);
      return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully"));

    }
    catch (Exception e){
      //if any error occurs
      System.out.println("Error deleting product: " + e.getMessage());
      return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
