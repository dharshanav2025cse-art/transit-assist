package org.example.transitassist.repository;

import org.example.transitassist.entity.AssistanceRequest;
import org.example.transitassist.entity.Helper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AssistanceRequestRepository
        extends JpaRepository<AssistanceRequest, Long> {

    List<AssistanceRequest> findByHelperAndTripTime(
            Helper helper,
            LocalDateTime tripTime);

    List<AssistanceRequest> findByHelperAndTripTimeBetween(
            Helper helper,
            LocalDateTime start,
            LocalDateTime end);
}