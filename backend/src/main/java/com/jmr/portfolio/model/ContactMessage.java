package com.jmr.portfolio.model;

import jakarta.persistence.*;
import java.time.Instant;

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
}
