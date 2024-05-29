package br.com.wisewallet.controller.expenses;

import br.com.wisewallet.entity.CSVRecordEntity;
import br.com.wisewallet.repository.CSVRecordRepository;
import br.com.wisewallet.service.expenses.CSVRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpensesController {
    @Autowired
    private CSVRecordService csvRecordService;

    @GetMapping("/all")
    public ResponseEntity<List<CSVRecordEntity>> getAllRecords() {
        List<CSVRecordEntity> records = csvRecordService.findAll();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/date")
    public ResponseEntity<List<CSVRecordEntity>> getAllRecordsByDate(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<CSVRecordEntity> records = csvRecordService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(records);
    }
}

