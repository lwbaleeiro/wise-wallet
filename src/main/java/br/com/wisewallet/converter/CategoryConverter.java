package br.com.wisewallet.converter;

import br.com.wisewallet.controller.expenses.form.CreateCategoryForm;
import br.com.wisewallet.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryConverter {

    public Category convert(CreateCategoryForm categoryForm) {
        return Category.builder()
                .id(categoryForm.id())
                .description(categoryForm.description())
                .enabled(categoryForm.enabled())
                .build();
    }

}