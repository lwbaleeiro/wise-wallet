package br.com.wisewallet.service.impl;

import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.controller.user.response.UserResponse;
import br.com.wisewallet.converter.UserConverter;
import br.com.wisewallet.entity.User;
import br.com.wisewallet.exceptions.*;
import br.com.wisewallet.repository.UserRepository;
import br.com.wisewallet.service.EmailValidatorService;
import br.com.wisewallet.service.UserService;
import br.com.wisewallet.service.ValidCpfService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserConverter userConverter;
    private final EmailValidatorService emailValidatorService;

    public UserServiceImpl(UserRepository userRepository,
                           EmailValidatorService emailValidatorService) {
        this.userRepository = userRepository;
        this.userConverter = new UserConverter(new BCryptPasswordEncoder());
        this.emailValidatorService = emailValidatorService;
    }

    @Override
    public UserResponse createUser(CreateUserForm createUserForm) {

        log.info("Creating user");
        User user = userConverter.convert(createUserForm);

        this.checkUserEmailIsValid(user);
        this.checkUserCpfIsValid(user);

        Optional<User> optionalUser = userRepository.findByCpf(user.getCpf());
        this.checkUserAlreadyExistsCpf(optionalUser);

        Optional<User> optionalUserEmail = userRepository.findByEmail(user.getEmail());
        this.checkUserAlreadyExistsEmail(optionalUserEmail);

        try {

            userRepository.save(user);

        } catch (Exception error) {
            log.error("error: {}", error.getMessage());
            throw new CreateUserDatabaseException();
        }

        return new UserResponse(user.getId(),
                user.getName(),
                user.getCpf(),
                user.getEmail());
    }

    @Override
    public UserResponse alterUser(CreateUserForm createUserForm) {
        return null;
    }

    @Override
    public UserResponse findUserById(String id) {
        return null;
    }

    @Override
    public List<UserResponse> findAll() {
        return null;
    }

    private void checkUserAlreadyExistsEmail(Optional<User> optionalUserEmail) {
        if (optionalUserEmail.isPresent()) {
            throw new UserAlreadyExistsWithEmailException();
        }
    }

    private void checkUserAlreadyExistsCpf(Optional<User> optionalUser) {
        if (optionalUser.isPresent()) {
            throw new UserAlreadyExistsWithCpfException();
        }
    }
    private void checkUserEmailIsValid(User user) {
        if (!emailValidatorService.test(user.getEmail())) {
            throw new UserEmailNotValidException();
        }
    }

    private void checkUserCpfIsValid(User user) {
        if (!ValidCpfService.valid(user.getCpf())) {
            throw new UserCpfIsNotValidException();
        }
    }
}
