package br.com.wisewallet.controller.user.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;

@Builder
public record CreateUserForm(Long id,
                            @NotEmpty(message = "name cannot be empty!")
                             String name,
                             @NotEmpty(message = "cpf cannot be empty!")
                             String cpf,
                             @Email
                             @NotEmpty(message = "email cannot be empty!")
                             String email,
                             @NotEmpty(message = "password cannot be empty!")
                             String password) {

}