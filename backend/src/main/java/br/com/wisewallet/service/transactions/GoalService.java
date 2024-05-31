package br.com.wisewallet.service.transactions;

import br.com.wisewallet.controller.expenses.form.CreateGoalForm;
import br.com.wisewallet.controller.expenses.response.GoalResponse;
import br.com.wisewallet.entity.Goal;

import java.util.List;

public interface GoalService {

    List<GoalResponse> findAll(Long id);
    GoalResponse createGoal(CreateGoalForm createGoalForm);
    GoalResponse alterGoal(CreateGoalForm createGoalForm);
}
