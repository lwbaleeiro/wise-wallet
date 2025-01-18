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
public class TransactionsServiceImpl implements TransactionsService {

    private final TransactionsRepository transactionsRepository;

    @Autowired
    public TransactionsServiceImpl(TransactionsRepository transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    @Override
    public List<Transactions> findAll() {
        return transactionsRepository.findAll();
    }

    @Override
    public List<Transactions> findByDateBetween(String startDate, String endDate) {
        return transactionsRepository.findByDateBetween(startDate, endDate);
    }

    @Override
    public List<Transactions> findByAmountGreaterThan() {
        return transactionsRepository.findByAmountGreaterThan(0d);
    }

    @Override
    public List<Transactions> findIncomingByDate(String startDate, String endDate) {
        return transactionsRepository.findByDateBetweenAndAmountGreaterThan(startDate, endDate, 0d);
    }

    @Override
    public List<Transactions> findByAmountLessThan() {
        return transactionsRepository.findByAmountLessThan(-0d);
    }

    @Override
    public List<Transactions> findExpensesByDate(String startDate, String endDate) {
        return transactionsRepository.findByDateBetweenAndAmountLessThan(startDate, endDate, -0d);
    }
}
