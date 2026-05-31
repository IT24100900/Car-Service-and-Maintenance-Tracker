package com.autotrack.service;

import com.autotrack.model.Order;
import com.autotrack.model.ShopProduct;
import com.autotrack.repository.OrderRepository;
import com.autotrack.repository.ShopProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {
    @Autowired private OrderRepository orderRepo;
    @Autowired private ShopProductRepository productRepo;

    public Order placeOrder(Order order) {
        // Reduce stock for each item
        for (Order.OrderItem item : order.getItems()) {
            ShopProduct product = productRepo.findById(item.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductName()));
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + item.getProductName());
            }
            product.setStock(product.getStock() - item.getQuantity());
            productRepo.save(product);
        }
        order.setStatus("PENDING");
        return orderRepo.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getOrdersByUser(String userId) {
        return orderRepo.findByUserId(userId);
    }

    public Order confirmOrder(String orderId) {
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("CONFIRMED");
        return orderRepo.save(order);
    }
}
