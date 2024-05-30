package br.com.wisewallet.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("cSVRecordEntity")
@Data
@Builder
public class Transactions {

    @Id
    private String id;
    private String data;
    private double valor;
    private String identificador;
    private String descricao;
}
