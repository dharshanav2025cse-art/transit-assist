package org.example.transitassist.service;

import org.example.transitassist.entity.AssistanceRequest;
import org.example.transitassist.entity.Helper;
import org.example.transitassist.entity.RequestStatus;
import org.example.transitassist.entity.User;
import org.example.transitassist.repository.AssistanceRequestRepository;
import org.example.transitassist.repository.HelperRepository;
import org.example.transitassist.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AssistanceRequestService {

    private final AssistanceRequestRepository assistanceRequestRepository;
    private final UserRepository userRepository;
    private final HelperRepository helperRepository;

    public AssistanceRequestService(
            AssistanceRequestRepository assistanceRequestRepository,
            UserRepository userRepository,
            HelperRepository helperRepository) {

        this.assistanceRequestRepository = assistanceRequestRepository;
        this.userRepository = userRepository;
        this.helperRepository = helperRepository;
    }

    public AssistanceRequest createRequest(AssistanceRequest request) {

        User user = userRepository.findById(request.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        request.setUser(user);

        if (request.getAssistanceType() == null) {
            throw new IllegalArgumentException("Assistance type is required");
        }

        request.setStatus(RequestStatus.REQUESTED);

        return assistanceRequestRepository.save(request);
    }

    public AssistanceRequest assignHelper(Long requestId, Long helperId) {

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        Helper helper = helperRepository.findById(helperId)
                .orElseThrow(() -> new IllegalArgumentException("Helper not found"));

        if (request.getStatus() == RequestStatus.COMPLETED) {
            throw new IllegalArgumentException("Completed request cannot be reassigned");
        }

        if (!helper.isAvailable()) {
            throw new IllegalArgumentException("Helper is not available");
        }
        if (!assistanceRequestRepository
                .findByHelperAndTripTime(helper, request.getTripTime())
                .isEmpty()) {

            throw new IllegalArgumentException(
                    "Helper already has a request at this time");
        }

        request.setHelper(helper);
        request.setStatus(RequestStatus.ASSIGNED);

        return assistanceRequestRepository.save(request);
    }
    public AssistanceRequest completeRequest(Long requestId) {

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (request.getStatus() != RequestStatus.ASSIGNED) {
            throw new IllegalArgumentException("Only assigned requests can be completed");
        }

        request.setStatus(RequestStatus.COMPLETED);

        return assistanceRequestRepository.save(request);
    }
    public AssistanceRequest cancelRequest(Long requestId) {

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (request.getStatus() == RequestStatus.COMPLETED) {
            throw new IllegalArgumentException("Completed request cannot be cancelled");
        }

        request.setStatus(RequestStatus.CANCELLED);

        return assistanceRequestRepository.save(request);
    }
    public List<AssistanceRequest> getHelperWorkload(Long helperId) {

        Helper helper = helperRepository.findById(helperId)
                .orElseThrow(() -> new IllegalArgumentException("Helper not found"));

        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return assistanceRequestRepository
                .findByHelperAndTripTimeBetween(helper, start, end);
    }
}