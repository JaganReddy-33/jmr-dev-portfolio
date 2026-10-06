package com.jmr.portfolio.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jmr.portfolio.model.ContentDoc;
import com.jmr.portfolio.repository.ContentDocRepository;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ContentService {

    private static final Set<String> COLLECTIONS = Set.of("skills", "experience", "projects", "ach");
    private static final Pattern ID = Pattern.compile("[A-Za-z0-9_-]{1,40}");
    private static final int MAX_PAYLOAD = 2_000_000;

    private final ContentDocRepository repository;
    private final ObjectMapper mapper;

    public ContentService(ContentDocRepository repository, ObjectMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public String listAsJsonArray(String collection) {
        requireCollection(collection);
        return repository.findByCollectionOrderBySeqAsc(collection).stream()
                .map(ContentDoc::getPayload)
                .collect(Collectors.joining(",", "[", "]"));
    }

    @Transactional
    public void upsert(String collection, String id, String payload) {
        requireCollection(collection);
        requireId(id);
        requireJsonObject(payload);
        String key = collection + ":" + id;
        ContentDoc doc = repository.findById(key)
        .orElseGet(() -> new ContentDoc(key, collection, System.currentTimeMillis() * 1_000_000L));
        doc.setPayload(payload);
        repository.save(doc);
    }

    @Transactional
    public void delete(String collection, String id) {
        requireCollection(collection);
        requireId(id);
        repository.deleteById(collection + ":" + id);
    }

    private void requireCollection(String c) {
        if (!COLLECTIONS.contains(c)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown collection");
    }

    private void requireId(String id) {
        if (!ID.matcher(id).matches()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid id");
    }

    private void requireJsonObject(String payload) {
        if (payload == null || payload.length() > MAX_PAYLOAD) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payload");
        try {
            if (!mapper.readTree(payload).isObject()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payload must be a JSON object");
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payload is not valid JSON");
        }
    }
}
