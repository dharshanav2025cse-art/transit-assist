package org.example.transitassist.service;

import org.example.transitassist.entity.Helper;
import org.example.transitassist.repository.HelperRepository;
import org.springframework.stereotype.Service;

@Service
public class HelperService {

    private final HelperRepository helperRepository;

    public HelperService(HelperRepository helperRepository) {
        this.helperRepository = helperRepository;
    }
    public Helper createHelper(Helper helper) {
        return helperRepository.save(helper);
    }
}