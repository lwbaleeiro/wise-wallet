package br.com.wisewallet.repository;

import br.com.wisewallet.entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface TransactionsRepository extends JpaRepository<Transactions, Long> {

    List<Transactions> findByDateBetween(String startDate, String endDate);
    List<Transactions> findByAmountLessThan(double valor);
    List<Transactions> findByAmountGreaterThan(double valor);
    List<Transactions> findByDateBetweenAndAmountGreaterThan(String startDate, String endDate, double valor);
    List<Transactions> findByDateBetweenAndAmountLessThan(String startDate, String endDate, double valor);
}
