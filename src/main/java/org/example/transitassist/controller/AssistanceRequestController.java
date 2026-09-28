package org.example.transitassist.controller;

import org.example.transitassist.entity.AssistanceRequest;
import org.example.transitassist.service.AssistanceRequestService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/assistance-requests")
public class AssistanceRequestController {

    private final AssistanceRequestService assistanceRequestService;

    public AssistanceRequestController(AssistanceRequestService assistanceRequestService) {
        this.assistanceRequestService = assistanceRequestService;
    }

    @PostMapping
    public AssistanceRequest createRequest(@RequestBody AssistanceRequest request) {
        return assistanceRequestService.createRequest(request);
    }
}