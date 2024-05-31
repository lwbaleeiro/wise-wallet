package br.com.wisewallet.controller.expenses;

import br.com.wisewallet.entity.Transactions;
import br.com.wisewallet.service.transactions.TransactionsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@Tag(name = "Transactions API")
@RequestMapping("/api/v1/transactions")
public class TransactionsController {

    private final TransactionsService transactionsService;

    @Autowired
    public TransactionsController(TransactionsService transactionsService) {
        this.transactionsService = transactionsService;
    }

    @Operation(summary = "Get all transactions")
    @GetMapping("/all")
    public ResponseEntity<List<Transactions>> getAllRecords() {
        List<Transactions> records = transactionsService.findAll();
        return ResponseEntity.ok(records);
    }

    @Operation(summary = "Get all transactions by date")
    @GetMapping("/date")
    public ResponseEntity<List<Transactions>> getAllRecordsByDate(@RequestParam(required = false) String startDate,
                                                                  @RequestParam(required = false) String endDate) {

        List<Transactions> records = transactionsService.findByDataBetween(startDate, endDate);
        return ResponseEntity.ok(records);
    }

    @Operation(summary = "Get all incoming")
    @GetMapping("/incoming/all")
    public ResponseEntity<List<Transactions>> getAllIncoming() {

        List<Transactions> records = transactionsService.findByValorGreaterThan();
        return ResponseEntity.ok(records);
    }

    @Operation(summary = "Get incoming by date")
    @GetMapping("/incoming/date")
    public ResponseEntity<List<Transactions>> getIncomingByDate(@RequestParam(required = false) String startDate,
                                                                @RequestParam(required = false) String endDate) {

        List<Transactions> records = transactionsService.findIncomingByDate(startDate, endDate);
        return ResponseEntity.ok(records);
    }

    @Operation(summary = "Get all expenses")
    @GetMapping("/expenses/all")
    public ResponseEntity<List<Transactions>> getAllExpenses() {

        List<Transactions> records = transactionsService.findByValorLessThan();
        return ResponseEntity.ok(records);
    }

    @Operation(summary = "Get expenses by date")
    @GetMapping("/expenses/date")
    public ResponseEntity<List<Transactions>> getExpensesByDate(@RequestParam(required = false) String startDate,
                                                                @RequestParam(required = false) String endDate) {

        List<Transactions> records = transactionsService.findExpensesByDate(startDate, endDate);
        return ResponseEntity.ok(records);
    }
}

