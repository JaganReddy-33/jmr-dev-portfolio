package com.jmr.portfolio.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.jmr.portfolio.dto.ContactRequest;
import com.jmr.portfolio.model.ContactMessage;
import com.jmr.portfolio.repository.ContactMessageRepository;

@Service
public class ContactService {

    private final ContactMessageRepository repository;
    private final NotificationService notifier;

    public ContactService(ContactMessageRepository repository, NotificationService notifier) {
        this.repository = repository;
        this.notifier = notifier;
    }

    public ContactMessage save(ContactRequest r) {
        ContactMessage saved = repository.save(new ContactMessage(r.name().trim(), r.email().trim(), r.subject(), r.message().trim()));
        notifier.newMessage(saved); // async, failures are logged only
        return saved;
    }

    @Transactional(readOnly = true)
    public List<ContactMessage> inbox() { return repository.findAllByOrderByCreatedAtDesc(); }

    @Transactional
    public void setSeen(Long id, boolean seen) {
        repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found")).setSeen(seen);
    }

    @Transactional
    public int markAllSeen() { return repository.markAllSeen(); }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found");
        repository.deleteById(id);
    }
}