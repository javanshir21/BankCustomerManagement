package com.users.customermanagement.service;

import com.users.customermanagement.model.Customer;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class LoanCalculationService {

    // Loan calculation logic based on salary
    public BigDecimal calculateMaxLoanAmount(Customer customer) {
        if (customer.getMonthlySalary() == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal salary = customer.getMonthlySalary();
        Integer creditScore = customer.getCreditScore() != null ? customer.getCreditScore() : 0;

        // Base multiplier: salary * 12 months * multiplier
        BigDecimal multiplier;

        if (creditScore >= 750) {
            multiplier = new BigDecimal("6");  // Excellent credit: 6x annual salary
        } else if (creditScore >= 650) {
            multiplier = new BigDecimal("4");  // Good credit: 4x annual salary
        } else if (creditScore >= 550) {
            multiplier = new BigDecimal("2");  // Fair credit: 2x annual salary
        } else {
            multiplier = new BigDecimal("1");  // Poor credit: 1x annual salary
        }

        BigDecimal annualSalary = salary.multiply(new BigDecimal("12"));
        return annualSalary.multiply(multiplier);
    }

    public boolean isLoanEligible(Customer customer) {
        if (customer.getMonthlySalary() == null) {
            return false;
        }

        BigDecimal minSalary = new BigDecimal("1000");  // Minimum salary requirement
        Integer minCreditScore = 500;  // Minimum credit score

        boolean salaryCheck = customer.getMonthlySalary().compareTo(minSalary) >= 0;
        boolean creditCheck = customer.getCreditScore() != null && customer.getCreditScore() >= minCreditScore;
        boolean employmentCheck = "Employed".equals(customer.getEmploymentStatus()) ||
                "Self-Employed".equals(customer.getEmploymentStatus());

        return salaryCheck && creditCheck && employmentCheck;
    }
}