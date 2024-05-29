package br.com.wisewallet.repository;

import br.com.wisewallet.entity.Expenses;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpensesRepository extends MongoRepository<Expenses, String> {
    List<Expenses> findByDataBetween(String startDate, String endDate);
}
