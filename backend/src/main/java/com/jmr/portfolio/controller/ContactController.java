package com.jmr.portfolio.controller;

import com.jmr.portfolio.dto.ContactRequest;
import com.jmr.portfolio.model.ContactMessage;
import com.jmr.portfolio.service.ContactService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) { this.service = service; }

    /** Public: anyone can send a message. */
    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> submit(@Valid @RequestBody ContactRequest request) {
        return Map.of("id", service.save(request).getId());
    }

    /** Owner only (X-Admin-Key). */
    @GetMapping("/messages")
    public List<ContactMessage> inbox() { return service.inbox(); }
}
