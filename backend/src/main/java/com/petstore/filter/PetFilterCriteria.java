package com.petstore.filter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetFilterCriteria {
    private String species;
    private String breed;
    private Integer minAge;
    private Integer maxAge;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer page = 0;
    private Integer size = 20;
    private String sort = "name,asc";
}
