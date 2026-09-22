FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build

COPY pom.xml ./
COPY discovery-server/pom.xml discovery-server/
COPY discovery-server/src discovery-server/src

RUN mvn clean package -pl discovery-server -am -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /build/discovery-server/target/discovery-server-*.jar app.jar

ENV PORT=8761
EXPOSE 8761

ENTRYPOINT ["sh", "-c", "java -XX:+UseSerialGC -Xss256k -Xms48m -Xmx128m -jar app.jar"]
