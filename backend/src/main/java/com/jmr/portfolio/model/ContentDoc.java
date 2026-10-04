package com.jmr.portfolio.model;

import jakarta.persistence.*;

/** One JSON document (a skill box, experience, project or achievement). Primary key: "&lt;collection&gt;:&lt;clientId&gt;". */
@Entity
@Table(name = "content_docs", indexes = @Index(name = "idx_content_collection", columnList = "collection_name, seq"))
public class ContentDoc {

    @Id
    private String id;

    @Column(name = "collection_name", nullable = false)
    private String collection;

    /** Keeps the original insertion order stable across edits. */
    private long seq;

    @Lob
    @Column(nullable = false, length = 10_000_000)
    private String payload;

    protected ContentDoc() { }

    public ContentDoc(String id, String collection, long seq) {
        this.id = id;
        this.collection = collection;
        this.seq = seq;
    }

    public String getId() { return id; }
    public String getCollection() { return collection; }
    public long getSeq() { return seq; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
}
