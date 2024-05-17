package com.akatsuki.pioms.frwarehouse.service;


import com.akatsuki.pioms.exchange.aggregate.Exchange;
import com.akatsuki.pioms.exchange.aggregate.ExchangeProduct;
import com.akatsuki.pioms.exchange.aggregate.RequestExchange;
import com.akatsuki.pioms.exchange.aggregate.ExchangeProductVO;
import com.akatsuki.pioms.frwarehouse.aggregate.FranchiseWarehouse;
import com.akatsuki.pioms.frwarehouse.aggregate.RequestFranchiseWarehouseUpdate;
import com.akatsuki.pioms.frwarehouse.aggregate.ResponseFranchiseWarehouseUpdate;
import com.akatsuki.pioms.frwarehouse.repository.FranchiseWarehouseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;


@Service
public class FranchiseWarehouseServiceImpl implements FranchiseWarehouseService{
    private final FranchiseWarehouseRepository franchiseWarehouseRepository;

    @Autowired
    public FranchiseWarehouseServiceImpl(FranchiseWarehouseRepository franchiseWarehouseRepository) {
        this.franchiseWarehouseRepository = franchiseWarehouseRepository;
    }

    @Transactional
    public void saveProduct(int productCode, int changeVal, int franchiseCode){
        FranchiseWarehouse franchiseWarehouse
                = franchiseWarehouseRepository.findByProductProductCodeAndFranchiseCode(productCode,franchiseCode);
        if(franchiseWarehouse == null){
            franchiseWarehouse = new FranchiseWarehouse(false,franchiseCode,productCode);
        }
        franchiseWarehouse.setFranchiseWarehouseTotal(franchiseWarehouse.getFranchiseWarehouseTotal()+changeVal);
        franchiseWarehouse.setFranchiseWarehouseCount(franchiseWarehouse.getFranchiseWarehouseCount()+changeVal);
        franchiseWarehouse.setFranchiseWarehouseEnable(franchiseWarehouse.getFranchiseWarehouseEnable()+changeVal);
        franchiseWarehouseRepository.save(franchiseWarehouse);
    }

    @Override
    @Transactional
    public void saveExchangeProduct(Exchange exchange, int franchiseCode) {
        if (exchange==null) return;
        List<ExchangeProduct> products = exchange.getProducts();
        products.forEach(product -> {
            int productCode = product.getProduct().getProductCode();
            int cnt = product.getExchangeProductNormalCount();
            saveProduct(productCode,cnt,franchiseCode);
        });
    }

    @Override
    @Transactional
    public boolean checkEnableToAddExchange(RequestExchange requestExchange) {

        for (int i = 0; i < requestExchange.getProducts().size(); i++) {
            ExchangeProductVO exchange =requestExchange.getProducts().get(i);

            FranchiseWarehouse franchiseWarehouse =
                    franchiseWarehouseRepository.findByProductProductCodeAndFranchiseCode(exchange.getProductCode(), requestExchange.getFranchiseCode());

            if(franchiseWarehouse==null || franchiseWarehouse.getFranchiseWarehouseEnable()< exchange.getExchangeProductCount()) {
                return false;
            }
        }
        editCountByPostExchange(requestExchange);
        return true;
    }

    @Override
    public List<FranchiseWarehouse> getAllWarehouse() {
        return franchiseWarehouseRepository.findAll();
    }

    @Override
    public FranchiseWarehouse getWarehouseByWarehouseCode(int franchiseWarehouseCode) {
        return franchiseWarehouseRepository.findById(franchiseWarehouseCode).orElseThrow(null);
    }

    @Override
    public ResponseEntity<String> updateWarehouseCount(int franchiseWarehouseCode, RequestFranchiseWarehouseUpdate request/*, int requesterAdminCode*/) {
        FranchiseWarehouse franchiseWarehouse = franchiseWarehouseRepository.findById(franchiseWarehouseCode)
                .orElseThrow(() -> new EntityNotFoundException("FranchiseWarehouse not found"));

        franchiseWarehouse.setFranchiseWarehouseTotal(request.getFranchiseWarehouseTotal());
        franchiseWarehouse.setFranchiseWarehouseEnable(request.getFranchiseWarehouseEnable());
        franchiseWarehouse.setFranchiseWarehouseCount(request.getFranchiseWarehouseCount());

        franchiseWarehouseRepository.save(franchiseWarehouse);
        return ResponseEntity.ok("재고 수정 완료!");

    }

    @Transactional
    public void editCountByPostExchange(RequestExchange requestExchange) {
        int cnt = requestExchange.getProducts().size();
        for (int i = 0; i < cnt; i++) {
            ExchangeProductVO exchange = requestExchange.getProducts().get(i);
            System.out.println(exchange);
            FranchiseWarehouse franchiseWarehouse =
                    franchiseWarehouseRepository.findByProductProductCodeAndFranchiseCode(exchange.getProductCode(),requestExchange.getFranchiseCode());
            System.out.println(franchiseWarehouse);
            if (franchiseWarehouse!=null) {
                franchiseWarehouse.setFranchiseWarehouseEnable(franchiseWarehouse.getFranchiseWarehouseEnable() - exchange.getExchangeProductCount());
                franchiseWarehouse.setFranchiseWarehouseCount(franchiseWarehouse.getFranchiseWarehouseCount() - exchange.getExchangeProductCount());
                franchiseWarehouseRepository.save(franchiseWarehouse);
            }
        }
    }
}
