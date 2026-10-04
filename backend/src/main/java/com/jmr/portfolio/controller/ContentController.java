package com.jmr.portfolio.controller;

import com.jmr.portfolio.service.ContentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

/** Public: GET list. Owner only (X-Admin-Key): PUT upsert and DELETE. */
@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentService service;

    public ContentController(ContentService service) { this.service = service; }

    @GetMapping(value = "/{collection}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String list(@PathVariable String collection) { return service.listAsJsonArray(collection); }

    @PutMapping("/{collection}/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void upsert(@PathVariable String collection, @PathVariable String id, @RequestBody String payload) {
        service.upsert(collection, id, payload);
    }

    @DeleteMapping("/{collection}/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String collection, @PathVariable String id) { service.delete(collection, id); }
}
