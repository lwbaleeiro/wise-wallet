package br.com.wisewallet.service.transactions;

import br.com.wisewallet.entity.Transactions;

import java.util.List;

public interface TransactionsService {

    List<Transactions> findAll();
    List<Transactions> findByDateBetween(String startDate, String endDate);
    List<Transactions> findByAmountGreaterThan();

    List<Transactions> findByAmountLessThan();

    List<Transactions> findIncomingByDate(String startDate, String endDate);

    List<Transactions> findExpensesByDate(String startDate, String endDate);
}
