package br.com.wisewallet.user;

import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.controller.user.response.UserResponse;
import br.com.wisewallet.converter.UserConverter;
import br.com.wisewallet.entity.User;
import br.com.wisewallet.exceptions.*;
import br.com.wisewallet.repository.UserRepository;
import br.com.wisewallet.service.EmailValidatorService;
import br.com.wisewallet.service.ValidCpfService;
import br.com.wisewallet.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserConverter userConverter;

    @Mock
    private EmailValidatorService emailValidatorService;

    @Mock
    private ValidCpfService validCpfService;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateUser() {
        CreateUserForm form = new CreateUserForm(1L, "Test User", "274.152.030-54", "test@example.com", "password", Boolean.TRUE);

        User user = User.builder()
                .id(1L)
                .name("Test User")
                .cpf("274.152.030-54")
                .email("test@example.com")
                .password("password")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .lastUpdate(LocalDateTime.now())
                .build();

        UserResponse userResponse = new UserResponse(1L, "Test User", "274.152.030-54", "test@example.com");

        when(userConverter.convert(form)).thenReturn(user);
        when(emailValidatorService.test(anyString())).thenReturn(true);
        when(validCpfService.valid(anyString())).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = userService.createUser(form);

        assertThat(response).isEqualTo(userResponse);
        verify(userRepository, times(1)).save(any(User.class));
    }

//    @Test
//    void testAlterUser() {
//        CreateUserForm form = new CreateUserForm(1L, "Updated User", "274.152.030-54", "1234acb@bol.com", "newpassword", Boolean.TRUE);
//
//        User user = User.builder()
//                .id(1L)
//                .name("Updated User")
//                .cpf("274.152.030-54")
//                .email("1234acb@bol.com")
//                .password("newpassword")
//                .enabled(true)
//                .createdAt(LocalDateTime.now().minusDays(1))
//                .lastUpdate(LocalDateTime.now())
//                .build();
//
//        UserResponse userResponse = new UserResponse(1L, "Updated User", "274.152.030-54", "1234acb@bol.com");
//
//        when(userConverter.convert(form)).thenReturn(user);
//        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
//        when(userRepository.save(any(User.class))).thenReturn(user);
//
//        UserResponse response = userService.alterUser(form);
//
//        assertThat(response).isEqualTo(userResponse);
//        verify(userRepository, times(1)).save(any(User.class));
//    }

    @Test
    void testFindUserById() {
        Long userId = 1L;
        User user = User.builder()
                .id(1L)
                .name("Test User")
                .cpf("274.152.030-54")
                .email("test@example.com")
                .password("password")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .lastUpdate(LocalDateTime.now())
                .build();

        UserResponse userResponse = new UserResponse(1L, "Test User", "274.152.030-54", "test@example.com");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        UserResponse response = userService.findUserById(userId);

        assertThat(response).isEqualTo(userResponse);
    }

    @Test
    void testFindAll() {
        User user1 = User.builder()
                .id(1L)
                .name("Test User 1")
                .cpf("274.152.030-54")
                .email("test1@example.com")
                .password("password1")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .lastUpdate(LocalDateTime.now())
                .build();

        User user2 = User.builder()
                .id(2L)
                .name("Test User 2")
                .cpf("804.465.550-61")
                .email("test2@example.com")
                .password("password2")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .lastUpdate(LocalDateTime.now())
                .build();

        List<User> users = Arrays.asList(user1, user2);

        List<UserResponse> userResponses = Arrays.asList(
                new UserResponse(1L, "Test User 1", "274.152.030-54", "test1@example.com"),
                new UserResponse(2L, "Test User 2", "804.465.550-61", "test2@example.com")
        );

        when(userRepository.findAll()).thenReturn(users);

        List<UserResponse> responses = userService.findAll();

        assertThat(responses).isEqualTo(userResponses);
    }
}
