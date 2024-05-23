package br.com.wisewallet.exceptions;

import br.com.wisewallet.config.interceptor.BaseException;
import org.springframework.http.HttpStatus;

public class UserEmailNotValidException extends BaseException {
    @Override
    public String getCode() {
        return "wisewallet.user.validation.error.userEmailNotValidException";
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.BAD_REQUEST;
    }

    @Override
    public String getMessage() {
        return "The provided email is not valid.";
    }
}

