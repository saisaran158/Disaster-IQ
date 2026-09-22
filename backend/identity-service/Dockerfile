FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml common-library/
COPY identity-service/pom.xml identity-service/

COPY common-library/src common-library/src
COPY identity-service/src identity-service/src

RUN mvn clean package -pl identity-service -am -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /build/identity-service/target/identity-service-*.jar app.jar

ENV PORT=8082
EXPOSE 8082

ENTRYPOINT ["sh", "-c", "java -XX:+UseSerialGC -Xss256k -Xms64m -Xmx192m -jar app.jar"]
