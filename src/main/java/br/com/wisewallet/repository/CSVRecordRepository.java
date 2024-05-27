package br.com.wisewallet.repository;

import br.com.wisewallet.entity.CSVRecordEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CSVRecordRepository extends MongoRepository<CSVRecordEntity, String> {
}
