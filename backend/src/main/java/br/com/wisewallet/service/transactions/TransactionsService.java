package br.com.wisewallet.service.transactions;

import br.com.wisewallet.entity.Transactions;

import java.util.List;

public interface TransactionsService {

    List<Transactions> findAll();
    List<Transactions> findByDataBetween(String startDate, String endDate);
    List<Transactions> findByValorGreaterThan();

    List<Transactions> findByValorLessThan();

    List<Transactions> findIncomingByDate(String startDate, String endDate);

    List<Transactions> findExpensesByDate(String startDate, String endDate);
}
