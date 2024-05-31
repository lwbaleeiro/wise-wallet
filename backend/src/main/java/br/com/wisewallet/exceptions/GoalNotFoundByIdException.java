package br.com.wisewallet.exceptions;

import br.com.wisewallet.config.interceptor.BaseException;
import org.springframework.http.HttpStatus;

public class GoalNotFoundByIdException extends BaseException {

    @Override
    public String getCode() {
        return "wisewallet.goal.database.error.goalNotFoundByIdException";
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.NOT_FOUND;
    }

    @Override
    public String getMessage() {
        return "Goal not found by the given Id";
    }
}
