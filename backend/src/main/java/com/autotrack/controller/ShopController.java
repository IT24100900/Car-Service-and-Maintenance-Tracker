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

  //
}
