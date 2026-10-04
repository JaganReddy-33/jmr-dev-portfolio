package com.jmr.portfolio.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/** Requires the X-Admin-Key header for everything except public reads of /api/content. */
@Component
public class AdminKeyInterceptor implements HandlerInterceptor {

    private final byte[] adminKey;

    public AdminKeyInterceptor(@Value("${app.admin-key:}") String adminKey) {
        if (adminKey == null || adminKey.length() < 8) {
            throw new IllegalStateException("Set the ADMIN_KEY environment variable (at least 8 characters).");
        }
        this.adminKey = adminKey.getBytes(StandardCharsets.UTF_8);
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