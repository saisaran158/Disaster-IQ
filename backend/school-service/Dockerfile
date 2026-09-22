FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml common-library/
COPY school-service/pom.xml school-service/

COPY common-library/src common-library/src
COPY school-service/src school-service/src

RUN mvn clean package -pl school-service -am -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /build/school-service/target/school-service-*.jar app.jar

ENV PORT=8083
EXPOSE 8083

ENTRYPOINT ["sh", "-c", "java -XX:+UseSerialGC -Xss256k -Xms64m -Xmx192m -jar app.jar"]
