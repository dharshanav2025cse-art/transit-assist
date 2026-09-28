package org.example.transitassist.controller;

import org.example.transitassist.entity.Helper;
import org.example.transitassist.service.HelperService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/helpers")
public class HelperController {

    private final HelperService helperService;

    public HelperController(HelperService helperService) {
        this.helperService = helperService;
    }

    @PostMapping
    public Helper createHelper(@Valid @RequestBody Helper helper){
        return helperService.createHelper(helper);
    }
    @GetMapping
    public List<Helper> getAllHelpers() {
        return helperService.getAllHelpers();
    }
}