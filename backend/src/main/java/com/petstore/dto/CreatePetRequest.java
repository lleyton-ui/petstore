package com.petstore.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePetRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Species is required")
    @Size(max = 50)
    private String species;

    @NotBlank(message = "Breed is required")
    @Size(max = 100)
    private String breed;

    @NotNull(message = "Age is required")
    @Min(0)
    private Integer ageMonths;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;

    @Size(max = 20)
    private String availabilityStatus;

    @Size(max = 500)
    private String photoUrl;

    private String description;
}
