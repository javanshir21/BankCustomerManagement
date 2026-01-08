package com.users.customermanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @GetMapping("/health")
    public String healthCheck() {
        return "Server is running!";
    }

    @GetMapping("/info")
    public String appInfo() {
        return "Customer Management API v1.0";
    }
}