package br.com.wisewallet.controller.authentication;

import br.com.wisewallet.controller.authentication.form.AuthenticationForm;
import br.com.wisewallet.controller.authentication.response.AuthenticationResponse;
import br.com.wisewallet.service.auth.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Tag(name = "Authentication controller")
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationForm authenticationForm) {
        try {
            String token = authService.authenticate(authenticationForm);
            return ResponseEntity.ok(new AuthenticationResponse(token, "Bearer"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}