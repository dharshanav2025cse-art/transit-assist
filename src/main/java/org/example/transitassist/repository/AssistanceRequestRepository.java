package org.example.transitassist.repository;

import org.example.transitassist.entity.AssistanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssistanceRequestRepository extends JpaRepository<AssistanceRequest, Long> {
}