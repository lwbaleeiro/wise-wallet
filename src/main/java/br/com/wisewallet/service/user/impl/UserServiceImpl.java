package br.com.wisewallet.service.user.impl;

import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.controller.user.response.UserResponse;
import br.com.wisewallet.converter.UserConverter;
import br.com.wisewallet.entity.User;
import br.com.wisewallet.exceptions.*;
import br.com.wisewallet.repository.UserRepository;
import br.com.wisewallet.service.user.EmailValidatorService;
import br.com.wisewallet.service.user.UserService;
import br.com.wisewallet.service.user.ValidCpfService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserConverter userConverter;
    private final EmailValidatorService emailValidatorService;
    private final ValidCpfService validCpfService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           UserConverter userConverter,
                           EmailValidatorService emailValidatorService,
                           ValidCpfService validCpfService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userConverter = userConverter;
        this.emailValidatorService = emailValidatorService;
        this.validCpfService = validCpfService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse createUser(CreateUserForm createUserForm) {
        log.info("Creating user");
        User user = userConverter.convert(createUserForm);

        validateUser(user, Boolean.TRUE);
        try {
            user.setEnabled(Boolean.TRUE);
            userRepository.save(user);

            return new UserResponse(user.getId(),
                    user.getName(),
                    user.getCpf(),
                    user.getEmail());
        } catch (Exception error) {
            log.error("Error: {}", error.getMessage());
            throw new CreateUserDatabaseException();
        }
    }

    @Override
    public UserResponse alterUser(CreateUserForm createUserForm) {
        log.info("Altering user with ID: {}", createUserForm.id());

        User existingUser = userRepository.findById(createUserForm.id()).orElseThrow(UserNotFoundByIdException::new);

        try {
            existingUser.setName(createUserForm.name());
            existingUser.setCpf(createUserForm.cpf());
            existingUser.setEmail(createUserForm.email());
            existingUser.setPassword(passwordEncoder.encode(createUserForm.password()));
            existingUser.setEnabled(createUserForm.enabled());
            existingUser.setLastUpdate(LocalDateTime.now());

            validateUser(existingUser, Boolean.FALSE);

            User alteredUser = userRepository.save(existingUser);

            return new UserResponse(alteredUser.getId(),
                    alteredUser.getName(),
                    alteredUser.getCpf(),
                    alteredUser.getEmail());

        } catch (Exception error) {
            log.error("Error altering user with ID {} | {}", createUserForm.id(), error.getMessage());
            throw new AlterUserDatabaseException();
        }
    }

    @Override
    public UserResponse findUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return new UserResponse(user.get().getId(), user.get().getName(), user.get().getCpf(), user.get().getEmail());
        } else {
            throw new UserNotFoundException();
        }
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return user;
        } else {
            throw new UserNotFoundException();
        }
    }

    @Override
    public List<UserResponse> findAll() {
        List<UserResponse> userResponseList = new ArrayList<>();
        List<User> users = userRepository.findAll();
        for (User user : users) {
            userResponseList.add(new UserResponse(user.getId(), user.getName(), user.getCpf(), user.getEmail()));
        }

        return userResponseList;
    }

    private void validateUser(User user, Boolean newUser) {
        String email = user.getEmail();
        if (!emailValidatorService.test(email)) {
            throw new UserEmailNotValidException();
        }
        if (!validCpfService.valid(user.getCpf())) {
            throw new UserCpfIsNotValidException();
        }
        if (newUser) checkUserAlreadyExists(user);
    }

    private void checkUserAlreadyExists(User user) {
        if (userRepository.findByCpf(user.getCpf()).isPresent()) {
            throw new UserAlreadyExistsWithCpfException();
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserAlreadyExistsWithEmailException();
        }
    }
}