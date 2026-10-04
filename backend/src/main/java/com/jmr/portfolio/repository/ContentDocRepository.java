package com.jmr.portfolio.repository;

import com.jmr.portfolio.model.ContentDoc;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentDocRepository extends JpaRepository<ContentDoc, String> {
    List<ContentDoc> findByCollectionOrderBySeqAsc(String collection);
}
