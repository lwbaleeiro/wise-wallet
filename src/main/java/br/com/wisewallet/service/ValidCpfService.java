package br.com.wisewallet.service;

import org.springframework.stereotype.Service;

@Service
public class ValidCpfService {

    private ValidCpfService() { }

    public static boolean valid(String CPF) {
        // Remover caracteres não numéricos
        CPF = CPF.replaceAll("\\D", "");

        // Verificar se o CPF possui 11 dígitos
        if (CPF.length() != 11) {
            return false;
        }

        // Verificar se todos os dígitos são iguais (ex.: 111.111.111-11)
        if (CPF.matches("(\\d)\\1{10}")) {
            return false;
        }

        // Calcular o primeiro dígito verificador
        int sum = 0;
        for (int i = 0; i < 9; i++) {
            sum += Character.getNumericValue(CPF.charAt(i)) * (10 - i);
        }
        int firstCheckDigit = 11 - (sum % 11);
        if (firstCheckDigit >= 10) {
            firstCheckDigit = 0;
        }

        // Calcular o segundo dígito verificador
        sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += Character.getNumericValue(CPF.charAt(i)) * (11 - i);
        }
        int secondCheckDigit = 11 - (sum % 11);
        if (secondCheckDigit >= 10) {
            secondCheckDigit = 0;
        }

        // Verificar se os dígitos verificadores são iguais aos do CPF informado
        return CPF.charAt(9) == Character.forDigit(firstCheckDigit, 10) &&
                CPF.charAt(10) == Character.forDigit(secondCheckDigit, 10);
    }
}
