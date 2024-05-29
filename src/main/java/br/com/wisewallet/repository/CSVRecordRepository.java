package br.com.wisewallet.repository;

import br.com.wisewallet.entity.CSVRecordEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CSVRecordRepository extends MongoRepository<CSVRecordEntity, String> {
    List<CSVRecordEntity> findByDataBetween(String startDate, String endDate);
}
