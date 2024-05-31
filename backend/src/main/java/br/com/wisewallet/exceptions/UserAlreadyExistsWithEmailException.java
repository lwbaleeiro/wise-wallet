package br.com.wisewallet.exceptions;

import br.com.wisewallet.config.interceptor.BaseException;
import org.springframework.http.HttpStatus;

public class UserAlreadyExistsWithEmailException extends BaseException {
    @Override
    public String getCode() {
        return "wisewallet.user.database.error.userAlreadyExistsWithEmailException";
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.CONFLICT;
    }

    @Override
    public String getMessage() {
        return "A user with the provided email already exists.";
    }
}
