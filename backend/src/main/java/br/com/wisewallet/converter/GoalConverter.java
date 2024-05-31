package br.com.wisewallet.converter;

import br.com.wisewallet.controller.expenses.form.CreateCategoryForm;
import br.com.wisewallet.controller.expenses.form.CreateGoalForm;
import br.com.wisewallet.entity.Goal;
import org.springframework.stereotype.Component;

@Component
public class GoalConverter {

    public Goal convert(CreateGoalForm goalForm) {
        return Goal.builder()
                .id(goalForm.id())
                .description(goalForm.description())
                .value(goalForm.value())
                .userEstimate(goalForm.userEstimate())
                .enabled(goalForm.enabled())
                .build();
    }
}
