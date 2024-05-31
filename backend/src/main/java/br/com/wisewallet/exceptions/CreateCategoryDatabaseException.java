package br.com.wisewallet.exceptions;

import br.com.wisewallet.config.interceptor.BaseException;
import org.springframework.http.HttpStatus;

public class CreateCategoryDatabaseException extends BaseException {

    @Override
    public String getCode() {
        return "wisewallet.category.database.error.createCategoryDatabaseException";
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    @Override
    public String getMessage() {
        return "Error to create Category.";
    }
}