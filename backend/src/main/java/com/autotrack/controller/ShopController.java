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
  
}
