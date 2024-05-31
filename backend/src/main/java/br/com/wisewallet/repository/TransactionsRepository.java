package br.com.wisewallet.repository;

import br.com.wisewallet.entity.Transactions;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface TransactionsRepository extends MongoRepository<Transactions, String> {

    List<Transactions> findByDataBetween(String startDate, String endDate);
    List<Transactions> findByValorLessThan(double valor);
    List<Transactions> findByValorGreaterThan(double valor);
    List<Transactions> findByDataBetweenAndValorGreaterThan(String startDate, String endDate, double valor);
    List<Transactions> findByDataBetweenAndValorLessThan(String startDate, String endDate, double valor);
}
