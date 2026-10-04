package com.jmr.portfolio;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {"spring.datasource.url=jdbc:h2:mem:test", "app.admin-key=test-key"})
@AutoConfigureMockMvc
class PortfolioApplicationTests {

    @Autowired MockMvc mvc;

    @Test void publicReadIsAllowed() throws Exception {
        mvc.perform(get("/api/content/projects")).andExpect(status().isOk());
    }

    @Test void writeWithoutKeyIsRejected() throws Exception {
        mvc.perform(put("/api/content/projects/p1").contentType(MediaType.APPLICATION_JSON).content("{\"id\":\"p1\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test void writeWithKeyIsAccepted() throws Exception {
        mvc.perform(put("/api/content/projects/p1").header("X-Admin-Key", "test-key")
                .contentType(MediaType.APPLICATION_JSON).content("{\"id\":\"p1\"}")).andExpect(status().isNoContent());
    }
}
