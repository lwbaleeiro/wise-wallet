package br.com.wisewallet.service.expenses;

import br.com.wisewallet.entity.Expenses;

import java.util.List;

public interface ExpensesService {

    List<Expenses> findAll();
    List<Expenses> findByDateRange(String startDate, String endDate);
}
