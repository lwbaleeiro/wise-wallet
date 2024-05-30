package br.com.wisewallet.repository;

import br.com.wisewallet.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    Optional<List<Goal>> findByUserId(Long userId);
}
