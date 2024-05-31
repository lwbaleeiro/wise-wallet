package br.com.wisewallet.repository;

import br.com.wisewallet.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<List<Category>> findByUserId(Long userId);
}
