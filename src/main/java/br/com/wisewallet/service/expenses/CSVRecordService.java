package br.com.wisewallet.service.expenses;

import br.com.wisewallet.entity.CSVRecordEntity;

import java.util.List;

public interface CSVRecordService {


    List<CSVRecordEntity> findAll();
    List<CSVRecordEntity> findByDateRange(String startDate, String endDate);
}
