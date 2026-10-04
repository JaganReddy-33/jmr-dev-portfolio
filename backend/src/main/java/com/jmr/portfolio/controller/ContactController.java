package com.jmr.portfolio.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.jmr.portfolio.dto.ContactRequest;
import com.jmr.portfolio.model.ContactMessage;
import com.jmr.portfolio.service.ContactService;

import jakarta.validation.Valid;

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

    // ---- Owner only (X-Admin-Key) ----

    @GetMapping("/messages")
    public List<ContactMessage> inbox() { return service.inbox(); }

    @PutMapping("/messages/{id}/seen")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void seen(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        service.setSeen(id, Boolean.TRUE.equals(body.get("seen")));
    }

    @PostMapping("/messages/seen-all")
    public Map<String, Integer> seenAll() { return Map.of("updated", service.markAllSeen()); }

    @DeleteMapping("/messages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}