# ── Build Stage ─────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy Maven POM files first for layer caching
COPY pom.xml ./
COPY common-library/pom.xml common-library/
COPY discovery-server/pom.xml discovery-server/
COPY gateway-server/pom.xml gateway-server/
COPY identity-service/pom.xml identity-service/
COPY school-service/pom.xml school-service/
COPY simulation-service/pom.xml simulation-service/

# Copy all source code
COPY common-library/src common-library/src
COPY discovery-server/src discovery-server/src
COPY gateway-server/src gateway-server/src
COPY identity-service/src identity-service/src
COPY school-service/src school-service/src
COPY simulation-service/src simulation-service/src

# Build and package all microservices
RUN mvn clean package -DskipTests

# ── Runtime Stage ───────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy built jars
COPY --from=builder /build/discovery-server/target/discovery-server-*.jar /app/discovery-server.jar
COPY --from=builder /build/gateway-server/target/gateway-server-*.jar /app/gateway-server.jar
COPY --from=builder /build/identity-service/target/identity-service-*.jar /app/identity-service.jar
COPY --from=builder /build/school-service/target/school-service-*.jar /app/school-service.jar
COPY --from=builder /build/simulation-service/target/simulation-service-*.jar /app/simulation-service.jar

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Render injects PORT (default 8071 for gateway)
EXPOSE 8071 8761 8082 8083 8084

ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
