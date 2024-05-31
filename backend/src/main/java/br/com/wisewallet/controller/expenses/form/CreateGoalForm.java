package br.com.wisewallet.controller.expenses.form;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime;

public record CreateGoalForm(Long id,
                             @NotEmpty(message = "description cannot be empty!")
                             String description,
                             @NotEmpty(message = "value cannot be empty!")
                             Double value,
                             @NotEmpty(message = "Estimate cannot be empty!")
                             @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
                             LocalDateTime userEstimate,
                             @NotEmpty(message = "User Id cannot be empty!")
                             Long userId,
                             Boolean enabled) {
}
