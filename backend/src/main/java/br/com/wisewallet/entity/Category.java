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

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Category {

    @Id
    @SequenceGenerator(name = "CATEGORY_SEQUENCE", sequenceName = "category_sequence_id", allocationSize = 1)
    @GeneratedValue(strategy = AUTO, generator = "CATEGORY_SEQUENCE")
    private Long id;
    private String description;
    private Boolean enabled;
    @ManyToOne
    private User user;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime lastUpdate;
}
