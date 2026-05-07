package com.petstore.filter;

import com.petstore.model.Pet;
import org.springframework.data.jpa.domain.Specification;

public class PetSpecification {

    public static Specification<Pet> withCriteria(PetFilterCriteria criteria) {
        return Specification.where(hasSpecies(criteria.getSpecies()))
                .and(hasBreed(criteria.getBreed()))
                .and(hasAgeBetween(criteria.getMinAge(), criteria.getMaxAge()))
                .and(hasPriceBetween(criteria.getMinPrice(), criteria.getMaxPrice()));
    }

    private static Specification<Pet> hasSpecies(String species) {
        return (root, query, cb) -> species == null ? null : cb.equal(root.get("species"), species);
    }

    private static Specification<Pet> hasBreed(String breed) {
        return (root, query, cb) -> breed == null ? null : cb.like(cb.lower(root.get("breed")), "%" + breed.toLowerCase() + "%");
    }

    private static Specification<Pet> hasAgeBetween(Integer minAge, Integer maxAge) {
        return (root, query, cb) -> {
            if (minAge == null && maxAge == null) return null;
            if (minAge != null && maxAge != null) return cb.between(root.get("ageMonths"), minAge, maxAge);
            if (minAge != null) return cb.greaterThanOrEqualTo(root.get("ageMonths"), minAge);
            return cb.lessThanOrEqualTo(root.get("ageMonths"), maxAge);
        };
    }

    private static Specification<Pet> hasPriceBetween(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice != null && maxPrice != null) return cb.between(root.get("price"), minPrice, maxPrice);
            if (minPrice != null) return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }
}
