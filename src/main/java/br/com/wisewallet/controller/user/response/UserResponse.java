package br.com.wisewallet.controller.user.response;

import lombok.Builder;

@Builder
public record UserResponse(Long id,
                           String name,
                           String cpf,
                           String email) {

}
