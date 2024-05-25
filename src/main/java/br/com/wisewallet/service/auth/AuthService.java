package br.com.wisewallet.service.auth;

import br.com.wisewallet.config.security.JwtUtil;
import br.com.wisewallet.controller.authentication.form.AuthenticationForm;
import br.com.wisewallet.entity.User;
import br.com.wisewallet.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public String authenticate(AuthenticationForm authenticationForm) {
        if (isValidUser(authenticationForm)) {
            return JwtUtil.generateToken(authenticationForm.email());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public boolean isValidUser(AuthenticationForm authenticationForm) {
        Optional<User> userOpt = userService.findUserByEmail(authenticationForm.email());

        return userOpt.filter(user ->
                passwordEncoder.matches(authenticationForm.password(), user.getPassword())).isPresent();

    }
}
