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
        log.info("Altering user");
        User user = userConverter.convert(createUserForm);

        Optional<User> optionalUser = userRepository.findById(user.getId());
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundByIdException();
        }
        validateUser(user, Boolean.FALSE);

        try {
            user.setLastUpdate(LocalDateTime.now());
            User alteredUser = userRepository.save(user);

            return new UserResponse(alteredUser.getId(),
                    alteredUser.getName(),
                    alteredUser.getCpf(),
                    alteredUser.getEmail());
        } catch (Exception error) {
            log.error("Error: {}", error.getMessage());
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
