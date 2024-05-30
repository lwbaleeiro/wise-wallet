package br.com.wisewallet.controller.expenses.form;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;

@Builder
public record CreateCategoryForm(Long id,
                                 @NotEmpty(message = "description cannot be empty!")
                                 String description,
                                 @NotEmpty(message = "User Id cannot be empty!")
                                 Long userId,
                                 Boolean enabled) {
}
