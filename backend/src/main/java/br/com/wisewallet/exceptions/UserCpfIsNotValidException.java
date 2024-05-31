package br.com.wisewallet.exceptions;

import br.com.wisewallet.config.interceptor.BaseException;
import org.springframework.http.HttpStatus;

public class UserCpfIsNotValidException extends BaseException {
    @Override
    public String getCode() {
        return "wisewallet.user.validation.error.userCpfIsNotValidException";
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.BAD_REQUEST;
    }

    @Override
    public String getMessage() {
        return "The provided CPF is not valid.";
    }
}
