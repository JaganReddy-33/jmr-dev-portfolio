package com.jmr.portfolio.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/** Requires the X-Admin-Key header for everything except public reads of /api/content. */
@Component
public class AdminKeyInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(AdminKeyInterceptor.class);
    private final byte[] adminKey;

    public AdminKeyInterceptor(@Value("${app.admin-key}") String adminKey) {
        this.adminKey = adminKey.getBytes(StandardCharsets.UTF_8);
        if ("change-me".equals(adminKey)) log.warn("ADMIN_KEY is not set: using the insecure default. Set ADMIN_KEY before deploying!");
    }

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        String method = req.getMethod();
        if ("OPTIONS".equals(method)) return true;
        if ("GET".equals(method) && req.getRequestURI().startsWith("/api/content/")) return true;
        String key = req.getHeader("X-Admin-Key");
        if (key != null && MessageDigest.isEqual(key.getBytes(StandardCharsets.UTF_8), adminKey)) return true;
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return false;
    }
}
