package br.com.wisewallet.controller.expenses;

import br.com.wisewallet.entity.Expenses;
import br.com.wisewallet.service.expenses.ExpensesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpensesController {
    @Autowired
    private ExpensesService expensesService;

    @GetMapping("/all")
    public ResponseEntity<List<Expenses>> getAllRecords() {
        List<Expenses> records = expensesService.findAll();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/date")
    public ResponseEntity<List<Expenses>> getAllRecordsByDate(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<Expenses> records = expensesService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(records);
    }
}

