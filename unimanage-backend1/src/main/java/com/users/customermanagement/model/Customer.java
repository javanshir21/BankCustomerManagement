package com.users.customermanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false)
    private String name;

    @Column(name = "customer_surname", nullable = false)
    private String surname;

    @Column(name = "customer_username", nullable = false, unique = true)
    private String username;

    @Column(name = "customer_email", nullable = false, unique = true)
    private String email;

    @Column(name = "customer_phone")
    private String phone;

    @Column(name = "customer_address")
    private String address;

    // NEW FIELDS FOR BANK/LOAN
    @Column(name = "monthly_salary")
    private BigDecimal monthlySalary;

    @Column(name = "credit_score")
    private Integer creditScore;  // e.g., 300-850

    @Column(name = "employment_status")
    private String employmentStatus;  // e.g., "Employed", "Self-Employed", "Unemployed"

    @Column(name = "loan_eligible")
    private Boolean loanEligible;

    @Column(name = "max_loan_amount")
    private BigDecimal maxLoanAmount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime updatedAt;
}