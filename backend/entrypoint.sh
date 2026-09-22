#!/bin/sh
set -e

echo "=================================================="
echo "  DisasterIQ Microservices - Starting on Render   "
echo "=================================================="

# JVM optimizations for Render 512MB RAM environment
JVM_COMMON="-XX:+UseSerialGC -Xss256k -XX:TieredStopAtLevel=1"

echo "-> [1/5] Launching Eureka Discovery Server (Port 8761)..."
java $JVM_COMMON -Xms48m -Xmx70m -jar /app/discovery-server.jar > /tmp/discovery.log 2>&1 &
DISCOVERY_PID=$!

echo "Waiting for Eureka to be healthy..."
sleep 10

echo "-> [2/5] Launching Identity Service (Port 8082)..."
java $JVM_COMMON -Xms64m -Xmx90m -jar /app/identity-service.jar > /tmp/identity.log 2>&1 &
IDENTITY_PID=$!

echo "-> [3/5] Launching School Service (Port 8083)..."
java $JVM_COMMON -Xms64m -Xmx90m -jar /app/school-service.jar > /tmp/school.log 2>&1 &
SCHOOL_PID=$!

echo "-> [4/5] Launching Simulation Service (Port 8084)..."
java $JVM_COMMON -Xms64m -Xmx90m -jar /app/simulation-service.jar > /tmp/simulation.log 2>&1 &
SIMULATION_PID=$!

echo "Waiting for services to register with Eureka..."
sleep 10

echo "-> [5/5] Launching API Gateway Server on port ${PORT:-8071}..."
exec java $JVM_COMMON -Xms70m -Xmx110m -jar /app/gateway-server.jar
