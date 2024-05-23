package br.com.wisewallet.config.interceptor;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@Slf4j
@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ControllerExceptionHandler {

    @ExceptionHandler({BaseException.class})
    @ResponseBody
    public ResponseEntity<ExceptionJson> saoException(final BaseException e, final HttpServletResponse response) {

        log.error(e.getMessage(), e);
        final ExceptionJson exceptionJson = new ExceptionJson(e);

        return new ResponseEntity<>(exceptionJson, new HttpHeaders(), e.getHttpStatus());
    }
}
