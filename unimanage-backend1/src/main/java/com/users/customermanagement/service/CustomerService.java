package com.users.customermanagement.service;

import com.users.customermanagement.model.Customer;

import java.util.List;

public interface CustomerService {

    List<Customer> getAll();
    Customer getById(Long id);
    Customer update(Customer customerRequest,Long id);
    void delete(Long id);
    Customer save(Customer customerRequest);
}

