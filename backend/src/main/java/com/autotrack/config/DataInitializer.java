package com.autotrack.config;

import com.autotrack.model.*;
import com.autotrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired private UserRepository userRepo;
    @Autowired private ServiceItemRepository serviceRepo;
    @Autowired private ShopProductRepository shopRepo;
    @Autowired private PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedServices();
        seedProducts();
    }

    private void seedAdmin() {
        if (userRepo.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(encoder.encode("@Admin69"));
            admin.setPhone("0000000000");
            admin.setAddress("AutoTrack HQ");
            admin.setRole("ADMIN");
            userRepo.save(admin);
            System.out.println("Admin seeded");
        }
    }

    private void seedServices() {
        if (serviceRepo.count() == 0) {
            List<ServiceItem> services = Arrays.asList(
                createService("Full Oil Change", "Complete engine oil and filter replacement", "Preventive Maintenance", 4500, "45 min"),
                createService("Tire Rotation & Balance", "Professional tire rotation and wheel balancing", "Preventive Maintenance", 3500, "60 min"),
                createService("Brake Inspection", "Full brake system inspection and pad check", "Preventive Maintenance", 2500, "30 min"),
                createService("Interior Deep Clean", "Full interior vacuum, wipe-down, and sanitization", "Auto Detailing & Care", 8000, "3 hrs"),
                createService("Exterior Polish & Wax", "Clay bar, machine polish, and carnauba wax", "Auto Detailing & Care", 12000, "4 hrs"),
                createService("Engine Overhaul", "Complete engine inspection, cleaning, and tune-up", "Mechanical Services", 35000, "1-2 days"),
                createService("Clutch Replacement", "Full clutch system replacement with quality parts", "Mechanical Services", 28000, "4-6 hrs"),
                createService("Battery Diagnostics", "Full electrical system and battery health check", "Electrical Diagnostics", 3500, "1 hr"),
                createService("ECU Scanning", "Computer diagnostics with OBD-II scanner", "Electrical Diagnostics", 5000, "45 min"),
                createService("Panel Beating", "Dent removal and body panel restoration", "Body & Paint Services", 15000, "1-3 days"),
                createService("Full Respray", "Complete vehicle respray with premium paint", "Body & Paint Services", 75000, "3-5 days")
            );
            serviceRepo.saveAll(services);
            System.out.println("Services seeded");
        }
    }

    private void seedProducts() {
        if (shopRepo.count() == 0) {
            List<ShopProduct> products = Arrays.asList(
                createProduct("Castrol GTX 10W-40 Engine Oil (4L)", "High performance mineral engine oil", "Engine Oils", 3200, 50),
                createProduct("Mobil 1 5W-30 Synthetic Oil (4L)", "Full synthetic premium engine oil", "Engine Oils", 7500, 30),
                createProduct("Bosch Oil Filter", "OEM-quality spin-on oil filter", "Filters", 850, 100),
                createProduct("K&N Air Filter", "High-flow washable air filter for performance", "Filters", 4500, 25),
                createProduct("Bosch S4 Car Battery 60Ah", "Maintenance-free sealed lead-acid battery", "Batteries", 18500, 15),
                createProduct("Amaron Go 55B24L Battery", "Reliable starting battery for small cars", "Batteries", 14000, 20),
                createProduct("Continental SportContact 6 (205/55 R16)", "High-performance summer tyre", "Tyres", 22000, 40),
                createProduct("Michelin Pilot Sport 4 (225/45 R17)", "Ultra-high performance tyre", "Tyres", 28500, 20),
                createProduct("NGK Spark Plug Set (4pcs)", "Iridium IX spark plugs for better ignition", "Spark Plugs", 3200, 80),
                createProduct("3M Car Wax Polish", "Professional grade carnauba wax for shine", "Care Products", 1800, 60),
                createProduct("Meguiar's Ultimate Compound", "Heavy-cut paint correction compound", "Care Products", 4200, 35),
                createProduct("Bosch Aerotwin Wiper Blade Set", "Flat beam wiper blades, all-season", "Accessories", 2800, 45)
            );
            shopRepo.saveAll(products);
            System.out.println("Products seeded");
        }
    }

    private ServiceItem createService(String name, String desc, String cat, double price, String duration) {
        ServiceItem s = new ServiceItem();
        s.setName(name); s.setDescription(desc); s.setCategory(cat);
        s.setPrice(price); s.setDuration(duration); s.setActive(true);
        return s;
    }

    private ShopProduct createProduct(String name, String desc, String cat, double price, int stock) {
        ShopProduct p = new ShopProduct();
        p.setName(name); p.setDescription(desc); p.setCategory(cat);
        p.setPrice(price); p.setStock(stock); p.setRating(4.5); p.setActive(true);
        return p;
    }
}
