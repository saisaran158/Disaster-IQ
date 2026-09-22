FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml common-library/
COPY simulation-service/pom.xml simulation-service/

COPY common-library/src common-library/src
COPY simulation-service/src simulation-service/src

RUN mvn clean package -pl simulation-service -am -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /build/simulation-service/target/simulation-service-*.jar app.jar

ENV PORT=8084
EXPOSE 8084

ENTRYPOINT ["sh", "-c", "java -XX:+UseSerialGC -Xss256k -Xms64m -Xmx192m -jar app.jar"]
