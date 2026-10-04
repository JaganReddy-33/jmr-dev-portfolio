package com.jmr.portfolio.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100) private String name;
    @Column(nullable = false) private String email;
    @Column(length = 150) private String subject;
    @Column(nullable = false, length = 3000) private String message;
    @Column(nullable = false) private Instant createdAt = Instant.now();
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean seen;

    protected ContactMessage() { }

    public ContactMessage(String name, String email, String subject, String message) {
        this.name = name; this.email = email; this.subject = subject; this.message = message;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getSubject() { return subject; }
    public String getMessage() { return message; }
    public Instant getCreatedAt() { return createdAt; }
    public boolean isSeen() { return seen; }
    public void setSeen(boolean seen) { this.seen = seen; }
}