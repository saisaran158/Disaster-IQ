FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build

COPY pom.xml ./
COPY gateway-server/pom.xml gateway-server/
COPY gateway-server/src gateway-server/src

RUN mvn clean package -pl gateway-server -am -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /build/gateway-server/target/gateway-server-*.jar app.jar

ENV PORT=8071
EXPOSE 8071

ENTRYPOINT ["sh", "-c", "java -XX:+UseSerialGC -Xss256k -Xms64m -Xmx192m -jar app.jar"]
