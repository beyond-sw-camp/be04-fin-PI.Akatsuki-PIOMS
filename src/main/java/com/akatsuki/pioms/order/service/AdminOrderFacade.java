package com.akatsuki.pioms.order.service;

import com.akatsuki.pioms.exchange.dto.ExchangeDTO;
import com.akatsuki.pioms.exchange.service.ExchangeService;
import com.akatsuki.pioms.franchise.aggregate.Franchise;
import com.akatsuki.pioms.franchise.service.FranchiseService;
import com.akatsuki.pioms.frwarehouse.service.FranchiseWarehouseService;
import com.akatsuki.pioms.invoice.dto.InvoiceDTO;
import com.akatsuki.pioms.invoice.service.InvoiceService;
import com.akatsuki.pioms.order.aggregate.Order;
import com.akatsuki.pioms.order.aggregate.RequestOrderVO;
import com.akatsuki.pioms.order.aggregate.RequestPutOrderCheck;
import com.akatsuki.pioms.order.dto.OrderDTO;
import com.akatsuki.pioms.order.dto.OrderProductDTO;
import com.akatsuki.pioms.order.etc.ORDER_CONDITION;
import com.akatsuki.pioms.product.service.ProductService;
import com.akatsuki.pioms.specs.service.SpecsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminOrderFacade {
    OrderService orderService;
    InvoiceService invoiceService;
    SpecsService specsService;
    ExchangeService exchangeService;
    ProductService productService;
    FranchiseService franchiseService;
    FranchiseWarehouseService franchiseWarehouseService;

    @Autowired
    public AdminOrderFacade(OrderService orderService, InvoiceService invoiceService, SpecsService specsService, ExchangeService exchangeService, ProductService productService, FranchiseService franchiseService, FranchiseWarehouseService franchiseWarehouseService) {
        this.orderService = orderService;
        this.invoiceService = invoiceService;
        this.specsService = specsService;
        this.exchangeService = exchangeService;
        this.productService = productService;
        this.franchiseService = franchiseService;
        this.franchiseWarehouseService =franchiseWarehouseService;
    }

    public List<OrderDTO> getOrderListByAdminCode(int adminCode){
        List<Order> orders =  orderService.getOrderListByAdminCode(adminCode);
        List<OrderDTO> orderDTOS = new ArrayList<>();
        orders.forEach(order -> {
            orderDTOS.add(new OrderDTO(order));
        });

        return orderDTOS;
    }
    public List<OrderDTO> getAdminUncheckedOrders(int adminCode){
        return orderService.getAdminUncheckesOrders(adminCode);
    }
    public OrderDTO getAdminOrder(int adminCode, int orderCode){
        return orderService.getAdminOrder(adminCode,orderCode);
    }

    //1. accept Order
    // return value
    // 0: This order's condition is not '승인대기' || find exchange to send franchise fail
    // 1: Fail Product logic
    // 2: Fail change order's conditions or put exchange to order
    // 3: Fail Specs logic
    // 4: Fail Invoice logic
    // 5: Fail Exchange logic
    // 6: Success!!
    @Transactional(readOnly = false)
    public int accpet(int orderCode, int adminCode){
        OrderDTO order;
        ExchangeDTO exchangeDTO;
        int success=0;

        try {
            order = orderService.getOrderById(orderCode);

            if (order.getOrderCondition() != ORDER_CONDITION.승인대기 ||
                    !productService.checkOrderEnable(convertListToMap(order.getOrderProductList()) ))
                throw new Exception("승인 대기가 아님");

            // find exchange to send to company
            exchangeDTO = exchangeService.findExchangeToSend(order.getFranchiseCode());
            success++; // 1
            // check enable to change exchange product
            if (exchangeDTO!=null || !productService.checkExchangeProduct(order,exchangeDTO)){
                exchangeDTO = null;
            }

            // change order condition '승인완료', add Exchange in order
            order = orderService.acceptOrder(adminCode,orderCode,exchangeDTO);
            if(order == null)
                throw new Exception("accpet Order problem occured!!");
            success++; // 2

            productService.exportProducts(order);
            success++; // 3
            // create new specs
            specsService.afterAcceptOrder(order);
            success++; // 4
            // create new invoice
            invoiceService.afterAcceptOrder(order);
            success++; // 5
            // change Exchange_STATUS of orders pending to be sent to the franchise
            // The quantity is changed at the time of delivery departure. Not now!!!!!
            exchangeService.afterAcceptOrder(order);
            success++; // 6
            return success;

        }catch (Exception e){
            return success;
        }
    }

    private Map<Integer, Integer> convertListToMap(List<OrderProductDTO> orderProductList) {
        Map<Integer,Integer> result = new HashMap<>();
        for (int i = 0; i < orderProductList.size(); i++) {
            OrderProductDTO orderProductDTO = orderProductList.get(i);
            result.put(orderProductDTO.getProductCode(),orderProductDTO.getRequestProductCount());
        }
        return result;
    }

    public OrderDTO denyOrder(int adminCode,int orderId, String denyMessage){
        return orderService.denyOrder(adminCode,orderId,denyMessage);
    }

}
