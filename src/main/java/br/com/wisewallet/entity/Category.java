package br.com.wisewallet.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.AUTO;

@Data
@Builder
@Entity
public class Category {

    @Id
    @SequenceGenerator(name = "CATEGORY_SEQUENCE", sequenceName = "category_sequence_id", allocationSize = 1)
    @GeneratedValue(strategy = AUTO, generator = "CATEGORY_SEQUENCE")
    private Long id;
    private String description;
    private Boolean enabled;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime lastUpdate;
}
