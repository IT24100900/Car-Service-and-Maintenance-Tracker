package com.autotrack.service;

import com.autotrack.model.ShopProduct;
import com.autotrack.repository.ShopProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShopService{
  @Autowired 
  private ShopProductRepository repo;

  //READ Product - gets all the active products from db
  //inactive ones are the deleted products (not showing)
    
  public List<ShopProduct> getAll(){
    //get all products from db
    List<ShopProduct> allProducts = repo.findAll();

    //create a new list to store only the active ones
    List<ShopProduct> activeProducts = new ArrayList<>();

    for(int i=0; i < allProducts.size(); i++){
      if(allProducts.get(i).isActive() == true){
        activeProducts.add(allProducts.get(i));
      }
    }
    return activeProducts;
  }

  //CREATE Prodcut
  public ShopProduct create(ShopProduct p){

    if (p.getName() == null || p.getName().isEmpty()) {
      throw new RuntimeException("Product name cannot be empty");
    }

    // price should not be negative
    if (p.getPrice() < 0) {
      throw new RuntimeException("Price cannot be negative");
    }

    // stock cannot be negative
    if (p.getStock() < 0) {
      throw new RuntimeException("Stock cannot be negative");
    }

    // save to database
    ShopProduct savedProduct = repo.save(p);

    //returning the saved product
    return savedProduct;
  }

  //UPDATE Products
  public ShopProduct update(String id, ShopProduct updateProduct){

    //if product doesn't exist - throwing RuntimeExecption with clear msg
    ShopProduct existingProduct = repo.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

    
  }
}
