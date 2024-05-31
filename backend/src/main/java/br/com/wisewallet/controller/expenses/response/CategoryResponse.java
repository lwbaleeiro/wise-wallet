package br.com.wisewallet.controller.expenses.response;

import lombok.Builder;

@Builder
public record CategoryResponse(Long id,
                               String description,
                               Long userId,
                               Boolean enabled) {
}
