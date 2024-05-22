package br.com.wisewallet.config.interceptor;

import org.springframework.http.HttpStatus;

public abstract class BaseException extends RuntimeException {
    public abstract String getCode();
    public abstract HttpStatus getHttpStatus();
    public abstract String getMessage();

}
