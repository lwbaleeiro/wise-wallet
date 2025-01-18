package br.com.wisewallet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.AUTO;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Bank {

    @Id
    @SequenceGenerator(name = "BANK_SEQUENCE", sequenceName = "bank_sequence_id", allocationSize = 1)
    @GeneratedValue(strategy = AUTO, generator = "BANK_SEQUENCE")
    private Long id;
    private Long code;
    private String name;
    private Double initialBalance;
    private Double currentBalance;
    @ManyToOne
    private User user;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime lastUpdate;
}
