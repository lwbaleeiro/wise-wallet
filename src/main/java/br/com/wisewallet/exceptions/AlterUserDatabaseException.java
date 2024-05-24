package br.com.wisewallet.exceptions;

import br.com.wisewallet.config.interceptor.BaseException;
import org.springframework.http.HttpStatus;

public class AlterUserDatabaseException extends BaseException {
    @Override
    public String getCode() {
        return "wisewallet.user.database.error.alterUserDatabaseException";
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    @Override
    public String getMessage() {
        return "Error to alter User.";
    }
}
