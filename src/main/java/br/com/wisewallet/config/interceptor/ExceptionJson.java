package br.com.wisewallet.config.interceptor;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public final class ExceptionJson {

    private final String code;
    private final String message;

    public ExceptionJson(final BaseException baseException) {
        this.code = baseException.getCode();
        this.message = baseException.getMessage();
    }
}
