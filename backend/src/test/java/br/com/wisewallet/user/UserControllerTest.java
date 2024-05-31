package br.com.wisewallet.user;

import br.com.wisewallet.controller.user.UsersController;
import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.controller.user.response.UserResponse;
import br.com.wisewallet.service.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UsersController usersController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateUser() {
        CreateUserForm form = new CreateUserForm(1L, "Test User", "274.152.030-54", "test@example.com", "123", Boolean.TRUE);
        UserResponse userResponse = new UserResponse(1L, "Test User", "274.152.030-54", "test@example.com");

        when(userService.createUser(any(CreateUserForm.class))).thenReturn(userResponse);

        ResponseEntity<UserResponse> response = usersController.create(form);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(userResponse);
    }

    @Test
    void testAlterUser() {
        CreateUserForm form = new CreateUserForm(1L, "Test User 2", "274.152.030-54", "test@example.com", "123", Boolean.TRUE); // Populate form with test data
        UserResponse userResponse = new UserResponse(1L, "Test User 2", "274.152.030-54", "test@example.com");

        when(userService.alterUser(any(CreateUserForm.class))).thenReturn(userResponse);

        ResponseEntity<UserResponse> response = usersController.alter(form);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(userResponse);
    }

    @Test
    void testGetById() {
        Long userId = 1L;
        UserResponse userResponse = new UserResponse(1L, "Test User", "12345678900", "test@example.com");

        when(userService.findUserById(userId)).thenReturn(userResponse);

        ResponseEntity<UserResponse> response = usersController.getById(userId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(userResponse);
    }

    @Test
    void testFindAll() {
        List<UserResponse> userResponses = Arrays.asList(
                new UserResponse(1L, "Test User 1", "12345678900", "test1@example.com"),
                new UserResponse(2L, "Test User 2", "09876543210", "test2@example.com")
        );

        when(userService.findAll()).thenReturn(userResponses);

        ResponseEntity<List<UserResponse>> response = usersController.findAll();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(userResponses);
    }
}
