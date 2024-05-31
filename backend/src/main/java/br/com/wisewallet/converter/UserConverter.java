package br.com.wisewallet.converter;

import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserConverter {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserConverter(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public User convert(CreateUserForm createUserForm) {
        return User.builder()
                .id(createUserForm.id())
                .cpf(createUserForm.cpf())
                .name(createUserForm.name())
                .email(createUserForm.email())
                .password(passwordEncoder.encode(createUserForm.password()))
                .enabled(createUserForm.enabled())
                .build();
    }
}