package br.com.wisewallet.service.transactions.impl;

import br.com.wisewallet.controller.expenses.form.CreateCategoryForm;
import br.com.wisewallet.controller.expenses.response.CategoryResponse;
import br.com.wisewallet.converter.CategoryConverter;
import br.com.wisewallet.entity.Category;
import br.com.wisewallet.entity.User;
import br.com.wisewallet.exceptions.AlterCategoryDatabaseException;
import br.com.wisewallet.exceptions.CategoryNotFoundByIdException;
import br.com.wisewallet.exceptions.CreateCategoryDatabaseException;
import br.com.wisewallet.exceptions.UserNotFoundByIdException;
import br.com.wisewallet.repository.CategoryRepository;
import br.com.wisewallet.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final CategoryConverter categoryConverter;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryConverter categoryConverter, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.categoryConverter = categoryConverter;
        this.userRepository = userRepository;
    }

    @Override
    public List<CategoryResponse> findAll(Long userId) {
        Optional<List<Category>> categoryList = categoryRepository.findByUserId(userId);
        if (categoryList.isPresent()) {

            return categoryList.get().stream()
                    .map(category -> new CategoryResponse(
                            category.getId(),
                            category.getDescription(),
                            category.getId(),
                            category.getEnabled()))
                    .toList();

        } else {
            throw new CategoryNotFoundByIdException();
        }

    }

    @Override
    public CategoryResponse createCategory(CreateCategoryForm categoryForm) {
        log.info("Creating category");
        Category category = categoryConverter.convert(categoryForm);

        Optional<User> optionalUser = userRepository.findById(categoryForm.userId());
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundByIdException();
        }

        try {
            category.setUser(optionalUser.get());
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
        log.info("Altering category with ID: {}", categoryForm.id());

        Category existingCategory = categoryRepository.findById(categoryForm.id()).orElseThrow(CategoryNotFoundByIdException::new);
        userRepository.findById(categoryForm.userId()).orElseThrow(UserNotFoundByIdException::new);

        try {

            existingCategory.setDescription(categoryForm.description());
            existingCategory.setEnabled(categoryForm.enabled());
            existingCategory.setLastUpdate(LocalDateTime.now());

            Category alteredCategory = categoryRepository.save(existingCategory);

            return CategoryResponse.builder()
                    .id(alteredCategory.getId())
                    .description(alteredCategory.getDescription())
                    .userId(alteredCategory.getUser().getId())
                    .enabled(alteredCategory.getEnabled())
                    .build();

        } catch (Exception error) {
            log.error("Error altering category with ID {} | {}", categoryForm.id(), error.getMessage());
            throw new AlterCategoryDatabaseException();
        }
    }
}
