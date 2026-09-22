# ── Build Stage ─────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy Maven POM files
COPY pom.xml ./
COPY common-library/pom.xml common-library/
COPY discovery-server/pom.xml discovery-server/
COPY gateway-server/pom.xml gateway-server/
COPY identity-service/pom.xml identity-service/
COPY school-service/pom.xml school-service/
COPY simulation-service/pom.xml simulation-service/
COPY disasteriq-server/pom.xml disasteriq-server/

# Copy all source code
COPY common-library/src common-library/src
COPY discovery-server/src discovery-server/src
COPY gateway-server/src gateway-server/src
COPY identity-service/src identity-service/src
COPY school-service/src school-service/src
COPY simulation-service/src simulation-service/src
COPY disasteriq-server/src disasteriq-server/src

# Build the unified production server
RUN mvn clean package -pl disasteriq-server -am -DskipTests

# ── Runtime Stage ───────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the built single fat jar
COPY --from=builder /build/disasteriq-server/target/disasteriq-server-*.jar /app/app.jar

# Dynamic port injected by Render (default 8071)
ENV PORT=8071
EXPOSE 8071

# JVM flags tuned for Render 512MB RAM environment (uses ~180MB RAM)
ENTRYPOINT ["sh", "-c", "exec java -XX:+UseSerialGC -Xss256k -Xms128m -Xmx320m -Dserver.port=${PORT:-8071} -jar /app/app.jar"]
