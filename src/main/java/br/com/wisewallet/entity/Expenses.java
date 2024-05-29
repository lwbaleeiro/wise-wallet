package br.com.wisewallet.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Expenses {

    @Id
    private String id;
    private String data;
    private double valor;
    private String identificador;
    private String descricao;
}
