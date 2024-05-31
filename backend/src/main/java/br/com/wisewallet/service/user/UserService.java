package br.com.wisewallet.service.user;

import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.controller.user.response.UserResponse;
import br.com.wisewallet.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
        UserResponse createUser(CreateUserForm user);
        UserResponse alterUser(CreateUserForm createUserForm);
        UserResponse findUserById(Long id);

        Optional<User> findUserByEmail(String email);
        List<UserResponse> findAll();
}
