package br.com.wisewallet.service.expenses.impl;

import br.com.wisewallet.entity.CSVRecordEntity;
import br.com.wisewallet.repository.CSVRecordRepository;
import br.com.wisewallet.service.expenses.CSVRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CSVRecordServiceImpl implements CSVRecordService {

    @Autowired
    CSVRecordRepository csvRecordRepository;

    @Override
    public List<CSVRecordEntity> findAll() {
        return csvRecordRepository.findAll();
    }

    @Override
    public List<CSVRecordEntity> findByDateRange(String startDate, String endDate) {
        return csvRecordRepository.findByDataBetween(startDate, endDate);
    }
}
