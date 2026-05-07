package com.petstore.repository;

import com.petstore.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long>, JpaSpecificationExecutor<Pet> {

    @Query(value = "SELECT * FROM pets WHERE id = ?", nativeQuery = true)
    Optional<Pet> findByIdIncludingDeleted(Long id);
}
