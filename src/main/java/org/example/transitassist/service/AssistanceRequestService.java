package org.example.transitassist.service;

import org.example.transitassist.entity.AssistanceRequest;
import org.example.transitassist.entity.RequestStatus;
import org.example.transitassist.entity.User;
import org.example.transitassist.repository.AssistanceRequestRepository;
import org.example.transitassist.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AssistanceRequestService {

    private final AssistanceRequestRepository assistanceRequestRepository;
    private final UserRepository userRepository;

    public AssistanceRequestService(
            AssistanceRequestRepository assistanceRequestRepository,
            UserRepository userRepository) {

        this.assistanceRequestRepository = assistanceRequestRepository;
        this.userRepository = userRepository;
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
}