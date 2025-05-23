# ── Base image with JRE 17 (matches Spring-Boot 3.x default) ────────────────
FROM eclipse-temurin:17-jre-alpine

# ── App lives in /app inside the container ──────────────────────────────────
WORKDIR /sales-savvy

# Copy the fat JAR that STS produced
 COPY target/Sales-Savvy-0.0.1.jar sales-savvy.jar

# Copy your application.properties so Spring can pick it up
 COPY src/main/resources/application.properties /app/config/application.properties

# Expose the port defined in application.properties
EXPOSE 9090

# Boot the app and tell Spring where the externalised properties live
ENTRYPOINT ["java","-jar","sales-savvy.jar","--spring.config.location=file:/app/config/application.properties"]