package br.com.wisewallet.service.auth;

import br.com.wisewallet.controller.authentication.form.AuthenticationForm;
import br.com.wisewallet.entity.User;
import br.com.wisewallet.service.user.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Value("${security.jwt.expiration}")
    private String SECRET_KEY;
    @Value("${security.jwt.expiration}")
    private long EXPIRATION_TIME;

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public String authenticate(AuthenticationForm authenticationForm) {
        if (isValidUser(authenticationForm)) {
            return Jwts.builder()
                    .setSubject(authenticationForm.email())
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                    .signWith(SignatureAlgorithm.HS512, SECRET_KEY.getBytes())
                    .compact();
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
