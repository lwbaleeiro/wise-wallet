package br.com.wisewallet.controller.authentication.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record AuthenticationForm(@NotEmpty @Email(message = "e-mail cannot be empty!")
                                 String email,
                                 @NotEmpty(message = "password cannot be empty!")
                                 String password) {
}
