package br.com.wisewallet.service;

import br.com.wisewallet.controller.user.form.CreateUserForm;
import br.com.wisewallet.controller.user.response.UserResponse;

import java.util.List;

public interface UserService {
        UserResponse createUser(CreateUserForm user);
        UserResponse alterUser(CreateUserForm createUserForm);
        UserResponse findUserById(String id);
        List<UserResponse> findAll();
}
