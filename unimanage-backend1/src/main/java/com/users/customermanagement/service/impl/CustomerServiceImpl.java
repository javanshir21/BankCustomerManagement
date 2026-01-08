package com.users.customermanagement.service.impl;

import com.users.customermanagement.model.Customer;
import com.users.customermanagement.repository.CustomerRepository;
import com.users.customermanagement.service.CustomerService;
import com.users.customermanagement.service.LoanCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository repository;

    @Autowired
    private LoanCalculationService loanCalculationService;

    @Override
    public List<Customer> getAll() {
        return repository.findAll();
    }

    @Override
    public Customer getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    @Override
    public Customer update(Customer customerRequest, Long id) {
        Customer customer = repository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        customer.setId(id);
        customer.setName(customerRequest.getName());
        customer.setSurname(customerRequest.getSurname());
        customer.setUsername(customerRequest.getUsername());
        customer.setEmail(customerRequest.getEmail());
        customer.setPhone(customerRequest.getPhone());
        customer.setAddress(customerRequest.getAddress());
        customer.setMonthlySalary(customerRequest.getMonthlySalary());
        customer.setCreditScore(customerRequest.getCreditScore());
        customer.setEmploymentStatus(customerRequest.getEmploymentStatus());

        // Calculate loan eligibility and max amount
        boolean eligible = loanCalculationService.isLoanEligible(customer);
        BigDecimal maxLoan = loanCalculationService.calculateMaxLoanAmount(customer);

        customer.setLoanEligible(eligible);
        customer.setMaxLoanAmount(maxLoan);

        return repository.save(customer);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Customer save(Customer customerRequest) {
        // Calculate loan eligibility and max amount before saving
        boolean eligible = loanCalculationService.isLoanEligible(customerRequest);
        BigDecimal maxLoan = loanCalculationService.calculateMaxLoanAmount(customerRequest);

        customerRequest.setLoanEligible(eligible);
        customerRequest.setMaxLoanAmount(maxLoan);

        return repository.save(customerRequest);
    }
}