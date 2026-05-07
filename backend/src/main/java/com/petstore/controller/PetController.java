package com.petstore.controller;

import com.petstore.dto.PetDto;
import com.petstore.filter.PetFilterCriteria;
import com.petstore.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping
    public ResponseEntity<Page<PetDto>> getPets(PetFilterCriteria criteria) {
        return ResponseEntity.ok(petService.findAllActive(criteria));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetDto> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.findActiveById(id));
    }
}
