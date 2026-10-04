package com.jmr.portfolio.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    /** Reaching this method means the interceptor accepted the X-Admin-Key. */
    @GetMapping("/api/auth")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void check() { }
}
