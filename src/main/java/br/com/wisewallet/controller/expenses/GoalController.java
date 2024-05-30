package br.com.wisewallet.controller.expenses;

import br.com.wisewallet.controller.expenses.form.CreateGoalForm;
import br.com.wisewallet.controller.expenses.response.GoalResponse;
import br.com.wisewallet.service.transactions.GoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Goal API")
@RestController
@RequestMapping("/api/v1/goal")
public class GoalController {

    private final GoalService goalService;

    @Autowired
    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @Operation(summary = "Get all goals by user")
    @GetMapping("/all")
    public ResponseEntity<?> getAllGoalsByUser(@RequestParam String userId) {
        List<GoalResponse> goals = goalService.findAll(Long.valueOf(userId));
        return ResponseEntity.ok(goals);
    }

    @Operation(summary = "Creater a new goal")
    @PostMapping("/new")
    public ResponseEntity<?> createNewGoal(@RequestBody CreateGoalForm createGoalForm) {

        return ResponseEntity.ok(goalService.createGoal(createGoalForm));
    }

    @Operation(summary = "Alter a existent goal")
    @PutMapping("/alter")
    public ResponseEntity<?> alterGoal(@RequestBody CreateGoalForm createGoalForm) {

        return ResponseEntity.ok(goalService.alterGoal(createGoalForm));
    }

}
