package com.carwash.auth.config;

import com.carwash.auth.entity.User;
import com.carwash.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DefaultAdminConfig implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin_user")) {
            User admin = new User();
            admin.setUsername("admin_user");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin@123"));
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
        }
    }
}
