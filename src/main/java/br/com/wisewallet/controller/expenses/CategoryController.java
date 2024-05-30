package br.com.wisewallet.controller.expenses;

import br.com.wisewallet.controller.expenses.form.CreateCategoryForm;
import br.com.wisewallet.entity.Category;
import br.com.wisewallet.service.transactions.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Category API")
@RestController
@RequestMapping("/api/v1/category")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "Get all categorys")
    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategorys() {
        List<Category> categories = categoryService.findAll();
        return ResponseEntity.ok(categories);
    }

    @Operation(summary = "Creater a new category")
    @PostMapping("/new")
    public ResponseEntity<?> createNewCategory(@RequestBody CreateCategoryForm categoryForm) {

        return ResponseEntity.ok(categoryService.createCategory(categoryForm));
    }

    @Operation(summary = "Alter a existent category")
    @PutMapping("/alter")
    public ResponseEntity<?> alterCategory(@RequestBody CreateCategoryForm categoryForm) {

        return ResponseEntity.ok(categoryService.alterCategory(categoryForm));
    }

}
