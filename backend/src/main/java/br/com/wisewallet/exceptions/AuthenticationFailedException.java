package br.com.wisewallet.exceptions;

import br.com.wisewallet.config.interceptor.BaseException;
import org.springframework.http.HttpStatus;

public class AuthenticationFailedException extends BaseException {

    @Override
    public String getCode() {
        return "wisewallet.authentication.error.authenticationFailedException";
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.UNAUTHORIZED;
    }

    @Override
    public String getMessage() {
        return "Failed to authenticate";
    }
}
