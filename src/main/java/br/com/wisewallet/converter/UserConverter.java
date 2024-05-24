package br.com.wisewallet.converter;

import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.entity.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public record UserConverter(BCryptPasswordEncoder bCryptPasswordEncoder) {

    public User convert(CreateUserForm createUserForm) {

        return User
                .builder()
                .id(createUserForm.id())
                .cpf(createUserForm.cpf())
                .name(createUserForm.name())
                .email(createUserForm.email())
                .password(bCryptPasswordEncoder.encode(createUserForm.password()))
                .enabled(Boolean.FALSE)
                .build();
    }
}
