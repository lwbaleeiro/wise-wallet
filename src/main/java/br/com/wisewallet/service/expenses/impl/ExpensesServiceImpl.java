package br.com.wisewallet.service.expenses.impl;

import br.com.wisewallet.entity.Expenses;
import br.com.wisewallet.repository.ExpensesRepository;
import br.com.wisewallet.service.expenses.ExpensesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpensesServiceImpl implements ExpensesService {

    @Autowired
    ExpensesRepository expensesRepository;

    @Override
    public List<Expenses> findAll() {
        return expensesRepository.findAll();
    }

    @Override
    public List<Expenses> findByDateRange(String startDate, String endDate) {
        return expensesRepository.findByDataBetween(startDate, endDate);
    }
}
