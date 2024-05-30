package br.com.wisewallet.service.transactions.impl;

import br.com.wisewallet.controller.expenses.form.CreateCategoryForm;
import br.com.wisewallet.controller.expenses.response.CategoryResponse;
import br.com.wisewallet.controller.user.response.UserResponse;
import br.com.wisewallet.converter.CategoryConverter;
import br.com.wisewallet.entity.Category;
import br.com.wisewallet.entity.User;
import br.com.wisewallet.exceptions.*;
import br.com.wisewallet.repository.CategoryRepository;
import br.com.wisewallet.service.transactions.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryConverter categoryConverter;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryConverter categoryConverter) {
        this.categoryRepository = categoryRepository;
        this.categoryConverter = categoryConverter;
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public CategoryResponse createCategory(CreateCategoryForm categoryForm) {
        log.info("Creating category");
        Category category = categoryConverter.convert(categoryForm);

        try {
            category.setEnabled(Boolean.TRUE);
            category.setCreatedAt(LocalDateTime.now());
            categoryRepository.save(category);

            return CategoryResponse.builder()
                    .id(category.getId())
                    .description(category.getDescription())
                    .enabled(category.getEnabled())
                    .build();

        } catch (Exception error) {
            log.error("Error: {}", error.getMessage());
            throw new CreateCategoryDatabaseException();
        }
    }

    @Override
    public CategoryResponse alterCategory(CreateCategoryForm categoryForm) {
        log.info("Altering user");
        Category category = categoryConverter.convert(categoryForm);

        Optional<Category> optionalCategory = categoryRepository.findById(category.getId());
        if (optionalCategory.isEmpty()) {
            throw new CategoryNotFoundByIdException();
        }

        try {
            category.setLastUpdate(LocalDateTime.now());
            Category alteredCategory = categoryRepository.save(category);

            return CategoryResponse.builder()
                    .id(alteredCategory.getId())
                    .description(alteredCategory.getDescription())
                    .enabled(alteredCategory.getEnabled())
                    .build();

        } catch (Exception error) {
            log.error("Error: {}", error.getMessage());
            throw new AlterCategoryDatabaseException();
        }
    }
}
