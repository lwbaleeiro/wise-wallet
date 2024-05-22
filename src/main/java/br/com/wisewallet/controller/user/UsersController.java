package br.com.wisewallet.controller.user;

import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.controller.user.response.UserResponse;
import br.com.wisewallet.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Tag(name = "User API")
@RequestMapping("/api/v1/user")
public class UsersController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Create a new user")
    @PostMapping("/create")
    public ResponseEntity<UserResponse> create(final @RequestBody @Valid CreateUserForm createUserForm) {

        log.info(" request user creation");

        return ResponseEntity.ok(userService.createUser(createUserForm));
    }
}
