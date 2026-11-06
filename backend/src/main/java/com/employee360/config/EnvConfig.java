package com.employee360.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;

@Configuration
public class EnvConfig {

    private static final Logger log = LoggerFactory.getLogger(EnvConfig.class);

    @PostConstruct
    public void loadDotenv() {
        String[] candidatePaths = {
                ".env",
                "../.env",
                "backend/.env",
                System.getProperty("user.dir") + File.separator + ".env",
                System.getProperty("user.dir") + File.separator + ".." + File.separator + ".env"
        };

        File found = null;
        for (String p : candidatePaths) {
            File f = new File(p);
            if (f.exists() && f.isFile()) {
                found = f;
                break;
            }
        }

        if (found != null) {
            log.info("Loading environment configuration from: {}", found.getAbsolutePath());
            try (BufferedReader reader = new BufferedReader(new FileReader(found, StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
                        continue;
                    }
                    int idx = line.indexOf('=');
                    String key = line.substring(0, idx).trim();
                    String val = line.substring(idx + 1).trim();

                    // Strip surrounding quotes
                    if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.substring(1, val.length() - 1);
                    }

                    if (System.getProperty(key) == null && System.getenv(key) == null) {
                        System.setProperty(key, val);
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to load .env file: {}", e.getMessage());
            }
        } else {
            log.debug("No .env file found in standard search paths. Relying on system environment variables.");
        }
    }
}
