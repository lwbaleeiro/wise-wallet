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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserConverter userConverter;
    private final EmailValidatorService emailValidatorService;
    private final ValidCpfService validCpfService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           UserConverter userConverter,
                           EmailValidatorService emailValidatorService,
                           ValidCpfService validCpfService) {
        this.userRepository = userRepository;
        this.userConverter = userConverter;
        this.emailValidatorService = emailValidatorService;
        this.validCpfService = validCpfService;
    }

    @Override
    public UserResponse createUser(CreateUserForm createUserForm) {
        log.info("Creating user");
        User user = userConverter.convert(createUserForm);

        validateUser(user);

        try {
            userRepository.save(user);
        } catch (Exception error) {
            log.error("Error: {}", error.getMessage());
            throw new CreateUserDatabaseException();
        }

        return new UserResponse(user.getId(), user.getName(), user.getCpf(), user.getEmail());
    }

    private void validateUser(User user) {
        if (!emailValidatorService.test(user.getEmail())) {
            throw new UserEmailNotValidException();
        }
        if (!validCpfService.valid(user.getCpf())) {
            throw new UserCpfIsNotValidException();
        }
        checkUserAlreadyExists(user);
    }

    private void checkUserAlreadyExists(User user) {
        if (userRepository.findByCpf(user.getCpf()).isPresent()) {
            throw new UserAlreadyExistsWithCpfException();
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserAlreadyExistsWithEmailException();
        }
    }

    @Override
    public UserResponse alterUser(CreateUserForm createUserForm) {
        // Implementar lógica de alteração de usuário
        return null;
    }

    @Override
    public UserResponse findUserById(String id) {
        // Implementar lógica de busca de usuário por ID
        return null;
    }

    @Override
    public List<UserResponse> findAll() {
        // Implementar lógica de busca de todos os usuários
        return null;
    }
}
