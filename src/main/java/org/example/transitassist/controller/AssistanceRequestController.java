package org.example.transitassist.controller;

import org.example.transitassist.entity.AssistanceRequest;
import org.example.transitassist.service.AssistanceRequestService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/assistance-requests")
public class AssistanceRequestController {

    private final AssistanceRequestService assistanceRequestService;

    public AssistanceRequestController(AssistanceRequestService assistanceRequestService) {
        this.assistanceRequestService = assistanceRequestService;
    }

    @PostMapping
    public AssistanceRequest createRequest(
            @Valid @RequestBody AssistanceRequest request) {

        return assistanceRequestService.createRequest(request);
    }
    @PutMapping("/{requestId}/assign/{helperId}")
    public AssistanceRequest assignHelper(
            @PathVariable Long requestId,
            @PathVariable Long helperId) {

        return assistanceRequestService.assignHelper(requestId, helperId);
    }
    @PutMapping("/{requestId}/complete")
    public AssistanceRequest completeRequest(@PathVariable Long requestId) {
        return assistanceRequestService.completeRequest(requestId);
    }
    @PutMapping("/{requestId}/cancel")
    public AssistanceRequest cancelRequest(@PathVariable Long requestId) {
        return assistanceRequestService.cancelRequest(requestId);
    }
    @GetMapping("/helper/{helperId}/workload")
    public List<AssistanceRequest> getHelperWorkload(@PathVariable Long helperId) {
        return assistanceRequestService.getHelperWorkload(helperId);
    }
    @GetMapping("/{requestId}")
    public AssistanceRequest getRequest(@PathVariable Long requestId) {
        return assistanceRequestService.getRequest(requestId);
    }
    @GetMapping
    public List<AssistanceRequest> getAllRequests() {
        return assistanceRequestService.getAllRequests();
    }
}