package br.com.wisewallet.service;

import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailValidatorService implements Predicate<String> {

    private static final Logger log = LoggerFactory.getLogger(EmailValidatorService.class);
    private static final String EMAIL_PATTERN = "^[\\w.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
    private static final Pattern pattern = Pattern.compile(EMAIL_PATTERN, Pattern.CASE_INSENSITIVE);

    @Override
    public boolean test(String email) {
        log.info("Validating email: {}", email);
        if (email == null || email.isEmpty()) {
            return false;
        }
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
}
