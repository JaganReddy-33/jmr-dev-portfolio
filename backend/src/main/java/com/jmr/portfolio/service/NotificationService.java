package com.jmr.portfolio.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.HtmlUtils;

import com.jmr.portfolio.model.ContactMessage;


@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final RestClient http = RestClient.create();
    private final String apiKey, to, from, siteUrl;

    public NotificationService(@Value("${app.notify.resend-api-key:}") String apiKey,
                               @Value("${app.notify.to:}") String to,
                               @Value("${app.notify.from:Portfolio <onboarding@resend.dev>}") String from,
                               @Value("${app.notify.site-url:}") String siteUrl) {
        this.apiKey = apiKey; this.to = to; this.from = from; this.siteUrl = siteUrl;
        if (apiKey.isBlank() || to.isBlank()) log.info("Email notifications are off (set RESEND_API_KEY and NOTIFY_EMAIL to enable).");
    }

    @Async
    public void newMessage(ContactMessage m) {
        if (apiKey.isBlank() || to.isBlank()) return;
        try {
            String subject = "New portfolio message from " + m.getName()
                    + (m.getSubject() == null || m.getSubject().isBlank() ? "" : " - " + m.getSubject());
            http.post().uri("https://api.resend.com/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("User-Agent", "jmr-portfolio/1.0")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("from", from, "to", List.of(to), "reply_to", m.getEmail(),
                            "subject", subject.replaceAll("[\\r\\n]+", " "), "html", html(m)))
                    .retrieve().toBodilessEntity();
            log.info("Notification email sent for message {}", m.getId());
        } catch (Exception e) {
            log.warn("Notification email failed: {}", e.getMessage());
        }
    }

    private String html(ContactMessage m) {
        String email = esc(m.getEmail());
        String role = m.getSubject() == null || m.getSubject().isBlank() ? "-" : esc(m.getSubject());
        String body = esc(m.getMessage()).replace("\n", "<br>");
        String link = siteUrl.isBlank() ? "" : "<p style=\"font-size:13px\"><a href=\"" + esc(siteUrl) + "\">Open your portfolio inbox</a></p>";
        return """
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden">
              <div style="background:linear-gradient(135deg,#7c5cff,#ff5ca8);color:#fff;padding:18px 22px"><h2 style="margin:0;font-size:18px">New portfolio message</h2></div>
              <div style="padding:22px;color:#111827">
                <p style="margin:0 0 4px"><b>%s</b> &lt;<a href="mailto:%s">%s</a>&gt;</p>
                <p style="margin:0 0 14px;color:#6b7280">Role / subject: %s</p>
                <div style="background:#f5f3ff;border-left:4px solid #7c5cff;border-radius:8px;padding:14px;line-height:1.55">%s</div>
                <p style="color:#6b7280;font-size:13px;margin-top:16px">Just hit <b>Reply</b>: your answer goes straight to %s.</p>
                %s
              </div>
            </div>""".formatted(esc(m.getName()), email, email, role, body, email, link);
    }

    private static String esc(String s) { return HtmlUtils.htmlEscape(s == null ? "" : s); }
}