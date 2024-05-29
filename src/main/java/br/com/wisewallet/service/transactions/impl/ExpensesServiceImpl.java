package br.com.wisewallet.service.transactions.impl;

import br.com.wisewallet.entity.Transactions;
import br.com.wisewallet.repository.TransactionsRepository;
import br.com.wisewallet.service.transactions.TransactionsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ExpensesServiceImpl implements TransactionsService {

    private final TransactionsRepository transactionsRepository;

    @Autowired
    public ExpensesServiceImpl(TransactionsRepository transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }


    @Override
    public List<Transactions> findAll() {
        return transactionsRepository.findAll();
    }

    @Override
    public List<Transactions> findByDataBetween(String startDate, String endDate) {
        return transactionsRepository.findByDataBetween(startDate, endDate);
    }

    @Override
    public List<Transactions> findByValorGreaterThan() {
        return transactionsRepository.findByValorGreaterThan(0d);
    }

    @Override
    public List<Transactions> findIncomingByDate(String startDate, String endDate) {
        return transactionsRepository.findByDataBetweenAndValorGreaterThan(startDate, endDate, 0d);
    }

    @Override
    public List<Transactions> findByValorLessThan() {
        return transactionsRepository.findByValorLessThan(-0d);
    }

    @Override
    public List<Transactions> findExpensesByDate(String startDate, String endDate) {
        return transactionsRepository.findByDataBetweenAndValorLessThan(startDate, endDate, -0d);
    }
}
