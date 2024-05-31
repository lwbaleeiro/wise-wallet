package br.com.wisewallet.controller.user;

import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.controller.user.response.UserResponse;
import br.com.wisewallet.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@Tag(name = "User API")
@RequestMapping("/api/v1/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UsersController {

    private final UserService userService;
    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Create a new user")
    @PostMapping("/create")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserForm createUserForm) {

        log.info("Request to create a user");
        UserResponse response = userService.createUser(createUserForm);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Alter a user")
    @PutMapping("/alter")
    public ResponseEntity<UserResponse> alter(final @RequestBody @Valid CreateUserForm createUserForm) {

        log.info("Request to alter a user");
        UserResponse response = userService.alterUser(createUserForm);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Return an specific user by the id")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable @Valid Long id) {

        try {
            return ResponseEntity.ok(userService.findUserById(id));
        } catch (NumberFormatException e) {
            return (ResponseEntity<UserResponse>) ResponseEntity.badRequest();
        }
    }

    @Operation(summary = "Return a list of all users")
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> findAll() {
        log.info("Request to find all user");
        List<UserResponse> responses = userService.findAll();
        return ResponseEntity.ok(responses);
    }
}
