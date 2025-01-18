package br.com.wisewallet.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.AUTO;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Transactions {

    @Id
    @SequenceGenerator(name = "TRANSACTIONS_SEQUENCE", sequenceName = "transactions_sequence_id", allocationSize = 1)
    @GeneratedValue(strategy = AUTO, generator = "TRANSACTIONS_SEQUENCE")
    private Long id;
    private String date;
    private double amount;
    private String identification;
    private String description;
}
