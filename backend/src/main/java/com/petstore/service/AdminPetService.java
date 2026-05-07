package com.petstore.service;

import com.petstore.dto.AdminPetDto;
import com.petstore.dto.CreatePetRequest;
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
@Transactional
public class AdminPetService {

    private final PetRepository petRepository;

    @Transactional(readOnly = true)
    public Page<AdminPetDto> findAll(PetFilterCriteria criteria, boolean includeDeleted) {
        String[] sortParts = criteria.getSort().split(",");
        Sort sort = Sort.by(Sort.Direction.fromString(sortParts[1]), sortParts[0]);
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);

        // Note: For including deleted, we'd need a custom repository method or filter disable
        // For MVP, we'll use the default filter which excludes deleted
        // In a real app, you'd use @FilterDef or a native query for "including deleted"
        Specification<Pet> spec = PetSpecification.withCriteria(criteria);
        
        return petRepository.findAll(spec, pageable).map(this::mapToAdminDto);
    }

    public AdminPetDto create(CreatePetRequest request) {
        Pet pet = Pet.builder()
                .name(request.getName())
                .species(request.getSpecies())
                .breed(request.getBreed())
                .ageMonths(request.getAgeMonths())
                .price(request.getPrice())
                .availabilityStatus(request.getAvailabilityStatus() != null ? request.getAvailabilityStatus() : "AVAILABLE")
                .photoUrl(request.getPhotoUrl())
                .description(request.getDescription())
                .build();
        
        return mapToAdminDto(petRepository.save(pet));
    }

    public AdminPetDto update(Long id, CreatePetRequest request) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet not found with id: " + id));

        pet.setName(request.getName());
        pet.setSpecies(request.getSpecies());
        pet.setBreed(request.getBreed());
        pet.setAgeMonths(request.getAgeMonths());
        pet.setPrice(request.getPrice());
        if (request.getAvailabilityStatus() != null) {
            pet.setAvailabilityStatus(request.getAvailabilityStatus());
        }
        pet.setPhotoUrl(request.getPhotoUrl());
        pet.setDescription(request.getDescription());

        return mapToAdminDto(petRepository.save(pet));
    }

    public void softDelete(Long id) {
        if (!petRepository.existsById(id)) {
            throw new EntityNotFoundException("Pet not found with id: " + id);
        }
        petRepository.deleteById(id);
    }

    private AdminPetDto mapToAdminDto(Pet pet) {
        return AdminPetDto.builder()
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
                .deletedAt(pet.getDeletedAt())
                .build();
    }
}
