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
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Goal {

    @Id
    @SequenceGenerator(name = "GOAL_SEQUENCE", sequenceName = "goal_sequence_id", allocationSize = 1)
    @GeneratedValue(strategy = AUTO, generator = "GOAL_SEQUENCE")
    private Long id;
    private String description;
    private Double value;
    private LocalDateTime userEstimate;
    private LocalDateTime lastCalculatedEstimate;
    @ManyToOne
    private User user;
    private Boolean enabled;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime lastUpdate;
}
