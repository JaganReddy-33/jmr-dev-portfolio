package com.jmr.portfolio.config;

import java.io.InputStream;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jmr.portfolio.model.ContentDoc;
import com.jmr.portfolio.repository.ContentDocRepository;

/** Fills an empty database from src/main/resources/seed/content.json (optional file). */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final List<String> COLLECTIONS = List.of("skills", "experience", "projects", "ach");

    private final ContentDocRepository repository;
    private final ObjectMapper mapper;

    public DataSeeder(ContentDocRepository repository, ObjectMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() > 0) return;
        ClassPathResource file = new ClassPathResource("seed/content.json");
        if (!file.exists()) {
            log.info("No seed/content.json found, skipping seeding.");
            return;
        }
        try (InputStream in = file.getInputStream()) {
            JsonNode root = mapper.readTree(in);
            long seq = System.currentTimeMillis() * 1_000_000L;
            for (String collection : COLLECTIONS) {
                for (JsonNode item : root.path(collection)) {
                    String id = item.path("id").asText("");
                    if (!id.matches("[A-Za-z0-9_-]{1,40}")) continue;
                    ContentDoc doc = new ContentDoc(collection + ":" + id, collection, seq++);
                    doc.setPayload(item.toString());
                    repository.save(doc);
                }
            }
            log.info("Seeded content from seed/content.json");
        }
    }
}
