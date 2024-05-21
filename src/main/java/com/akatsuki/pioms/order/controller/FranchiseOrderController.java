package com.akatsuki.pioms.order.controller;

import com.akatsuki.pioms.order.aggregate.*;
import com.akatsuki.pioms.order.dto.OrderDTO;
import com.akatsuki.pioms.order.service.AdminOrderFacade;
import com.akatsuki.pioms.order.service.FranchiseOrderFacade;
import com.akatsuki.pioms.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/franchise")
public class FranchiseOrderController {
    OrderService orderService;
    FranchiseOrderFacade franchiseOrderFacade;

    @Autowired
    public FranchiseOrderController(OrderService orderService, FranchiseOrderFacade franchiseOrderFacade) {
        this.orderService = orderService;
        this.franchiseOrderFacade = franchiseOrderFacade;
    }

    /**
     * <h2>발주 생성</h2>
     * */
    @PostMapping("/{franchiseCode}/order")
    public ResponseEntity<OrderDTO> postFranchiseOrder(@PathVariable int franchiseCode, @RequestBody RequestOrderVO orders){
        OrderDTO result = franchiseOrderFacade.postFranchiseOrder(franchiseCode,orders);
        if(result == null)
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        return ResponseEntity.ok().body(result);
    }
    @PutMapping("/{franchiseCode}/order")
    public ResponseEntity<String> putFranchiseOrder(@PathVariable int franchiseCode, @RequestBody RequestPutOrder order){
        boolean result = orderService.putFranchiseOrder(franchiseCode, order);
        if(!result)
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("put failed. check again");
        return ResponseEntity.ok("put finished");
    }
    @PutMapping("/{franchiseCode}/order/check")
    public ResponseEntity<String> putFranchiseOrderCheck(@PathVariable int franchiseCode, @RequestBody RequestPutOrderCheck requestPutOrder){
        boolean result = franchiseOrderFacade.putFranchiseOrderCheck(franchiseCode,requestPutOrder);
        if(!result)
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("put failed");
        return ResponseEntity.ok("put finished");
    }

    @GetMapping("/{franchiseCode}/orders")
    public ResponseEntity<OrderListVO> getFranchiseOrderList(@PathVariable int franchiseCode){
        return ResponseEntity.ok(new OrderListVO(franchiseOrderFacade.getOrderListByFranchiseCode(franchiseCode)));
    }

    @GetMapping("/{franchiseCode}/order/{orderCode}")
    public ResponseEntity<OrderVO> getOrder(@PathVariable int franchiseCode, @PathVariable int orderCode){
        OrderVO orderVO = new OrderVO(orderService.getOrder(franchiseCode,orderCode));
        if(orderVO==null)
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        return ResponseEntity.ok(orderVO);
    }
}
