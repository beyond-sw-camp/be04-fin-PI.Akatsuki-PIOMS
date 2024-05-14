package com.akatsuki.pioms.exchange.dto;

import com.akatsuki.pioms.exchange.aggregate.EXCHANGE_STATUS;
import com.akatsuki.pioms.exchange.aggregate.Exchange;
import com.akatsuki.pioms.franchise.aggregate.Franchise;
import com.akatsuki.pioms.franchise.dto.FranchiseDTO;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeDTO {
    private int exchangeCode;

    private LocalDateTime exchangeDate;

    @Enumerated(EnumType.ORDINAL)
    private EXCHANGE_STATUS exchangeStatus;

    private FranchiseDTO franchise;
    private List<ExchangeProductDTO> exchangeProducts;

    public ExchangeDTO(Exchange exchange) {
        if (exchange !=null) {
            System.out.println(exchange);
            this.exchangeCode = exchange.getExchangeCode();
            this.exchangeDate = exchange.getExchangeDate();
            this.exchangeStatus = exchange.getExchangeStatus();
            this.franchise = new FranchiseDTO(exchange.getFranchise());
            this.exchangeProducts = new ArrayList<>();
            exchange.getProducts().forEach(exchangeProductEntity -> {
                exchangeProducts.add(new ExchangeProductDTO(exchangeProductEntity));
            });
        }
    }
}