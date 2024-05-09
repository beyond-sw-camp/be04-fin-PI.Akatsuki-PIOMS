package com.akatsuki.pioms.category.service;

import com.akatsuki.pioms.category.entity.CategorySecond;
import com.akatsuki.pioms.category.entity.CategoryThird;
import com.akatsuki.pioms.category.repository.CategoryThirdRepository;
import com.akatsuki.pioms.category.vo.RequestCategoryPost;
import com.akatsuki.pioms.category.vo.RequestCategoryUpdate;
import com.akatsuki.pioms.category.vo.ResponseCategoryPost;
import com.akatsuki.pioms.product.entity.Product;
import com.akatsuki.pioms.product.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryThirdServiceImpl implements CategoryThirdService{

    private CategoryThirdRepository categoryThirdRepository;
    private ProductRepository productRepository;

    @Autowired
    public CategoryThirdServiceImpl(CategoryThirdRepository categoryThirdRepository, ProductRepository productRepository) {
        this.categoryThirdRepository = categoryThirdRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<CategoryThird> getAllCategoryThird() {
        return categoryThirdRepository.findAll();
    }

    @Override
    public Optional<CategoryThird> findCategoryThirdByCode(int categoryThirdCode) {
        return categoryThirdRepository.findById(categoryThirdCode);
    }
    @Override
    @Transactional
    public ResponseCategoryPost postCategory(RequestCategoryPost request) {
        CategoryThird categoryThird = new CategoryThird();

        // CategorySecond 엔티티를 참조하는 필드에 해당 CategorySecond 엔티티를 설정
        CategorySecond categorySecond = new CategorySecond();
        categorySecond.setCategory_second_code(request.getCategory_second_code());
        categoryThird.setCategory_second_code(categorySecond);

        categoryThird.setCategory_third_name(request.getCategory_third_name());

        CategoryThird savedCategoryThird = categoryThirdRepository.save(categoryThird);

        ResponseCategoryPost responseValue = new ResponseCategoryPost(savedCategoryThird.getCategory_third_code(), savedCategoryThird.getCategory_third_name());
        return responseValue;
    }

    @Override
    @Transactional
    public ResponseCategoryPost updateCategory(int categoryThirdCode, RequestCategoryUpdate request) {
        CategoryThird categoryThird = categoryThirdRepository.findById(categoryThirdCode)
                .orElseThrow(() -> new EntityNotFoundException("CategoryThird not found"));

        categoryThird.setCategory_third_name(request.getCategory_third_name());

        CategoryThird updatedCategoryThird = categoryThirdRepository.save(categoryThird);

        ResponseCategoryPost responseValue = new ResponseCategoryPost(updatedCategoryThird.getCategory_third_code(), updatedCategoryThird.getCategory_third_name());
        return responseValue;
    }

    @Override
    @Transactional
    public CategoryThird deleteCategory(int categoryThirdCode) {
        categoryThirdRepository.deleteById(categoryThirdCode);
        return null;
    }
}
