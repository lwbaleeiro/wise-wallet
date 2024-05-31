package br.com.wisewallet.exceptions;

import br.com.wisewallet.config.interceptor.BaseException;
import org.springframework.http.HttpStatus;

public class CategoryNotFoundByIdException extends BaseException {

    @Override
    public String getCode() {
        return "wisewallet.category.database.error.categoryNotFoundByIdException";
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.NOT_FOUND;
    }

    @Override
    public String getMessage() {
        return "Category not found by the given Id";
    }
}
