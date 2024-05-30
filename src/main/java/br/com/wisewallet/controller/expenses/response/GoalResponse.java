package br.com.wisewallet.controller.expenses.response;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record GoalResponse(Long id,

                           String description,
                           Double value,
                           LocalDateTime userEstimate,
                           Long userId,
                           Boolean enabled) {
}
