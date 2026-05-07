package com.petstore.controller;

import com.petstore.dto.AdminPetDto;
import com.petstore.dto.CreatePetRequest;
import com.petstore.filter.PetFilterCriteria;
import com.petstore.service.AdminPetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/pets")
@RequiredArgsConstructor
public class AdminPetController {

    private final AdminPetService adminPetService;

    @GetMapping
    public ResponseEntity<Page<AdminPetDto>> getAllPets(
            PetFilterCriteria criteria,
            @RequestParam(defaultValue = "true") boolean includeDeleted) {
        return ResponseEntity.ok(adminPetService.findAll(criteria, includeDeleted));
    }

    @PostMapping
    public ResponseEntity<AdminPetDto> createPet(@Valid @RequestBody CreatePetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminPetService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminPetDto> updatePet(@PathVariable Long id, @Valid @RequestBody CreatePetRequest request) {
        return ResponseEntity.ok(adminPetService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        adminPetService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
