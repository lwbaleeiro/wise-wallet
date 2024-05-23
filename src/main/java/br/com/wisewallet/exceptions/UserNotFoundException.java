package br.com.wisewallet.exceptions;

import br.com.wisewallet.config.interceptor.BaseException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends BaseException {
    @Override
    public String getCode() {
        return "wisewallet.user.database.error.UserNotFoundException";
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.NOT_FOUND;
    }

    @Override
    public String getMessage() {
        return "User not found";
    }
}
