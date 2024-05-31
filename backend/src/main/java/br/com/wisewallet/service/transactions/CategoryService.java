package br.com.wisewallet.service.transactions;

import br.com.wisewallet.controller.expenses.form.CreateCategoryForm;
import br.com.wisewallet.controller.expenses.response.CategoryResponse;
import br.com.wisewallet.entity.Category;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> findAll(Long userId);
    CategoryResponse createCategory(CreateCategoryForm categoryForm);
    CategoryResponse alterCategory(CreateCategoryForm categoryForm);
}
