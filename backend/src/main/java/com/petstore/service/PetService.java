package com.petstore.service;

import com.petstore.dto.PetDto;
import com.petstore.filter.PetFilterCriteria;
import com.petstore.filter.PetSpecification;
import com.petstore.model.Pet;
import com.petstore.repository.PetRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PetService {

    private final PetRepository petRepository;

    public Page<PetDto> findAllActive(PetFilterCriteria criteria) {
        String[] sortParts = criteria.getSort().split(",");
        Sort sort = Sort.by(Sort.Direction.fromString(sortParts[1]), sortParts[0]);
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);
        
        Specification<Pet> spec = PetSpecification.withCriteria(criteria);
        
        return petRepository.findAll(spec, pageable).map(this::mapToDto);
    }

    public PetDto findActiveById(Long id) {
        return petRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new EntityNotFoundException("Pet not found or inactive with id: " + id));
    }

    private PetDto mapToDto(Pet pet) {
        return PetDto.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .breed(pet.getBreed())
                .ageMonths(pet.getAgeMonths())
                .price(pet.getPrice())
                .availabilityStatus(pet.getAvailabilityStatus())
                .photoUrl(pet.getPhotoUrl())
                .description(pet.getDescription())
                .createdAt(pet.getCreatedAt())
                .updatedAt(pet.getUpdatedAt())
                .build();
    }
}
