package com.petstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PetDto {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private Integer ageMonths;
    private BigDecimal price;
    private String availabilityStatus;
    private String photoUrl;
    private String description;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
