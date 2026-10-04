package com.jmr.portfolio.service;

import com.jmr.portfolio.dto.ContactRequest;
import com.jmr.portfolio.model.ContactMessage;
import com.jmr.portfolio.repository.ContactMessageRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactMessageRepository repository;

    public ContactService(ContactMessageRepository repository) { this.repository = repository; }

    public ContactMessage save(ContactRequest r) {
        return repository.save(new ContactMessage(r.name().trim(), r.email().trim(), r.subject(), r.message().trim()));
    }

    public List<ContactMessage> inbox() { return repository.findAllByOrderByCreatedAtDesc(); }
}
