-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: disasteriq_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `disasteriq_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `disasteriq_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `disasteriq_db`;

--
-- Table structure for table `ai_recommendations`
--

DROP TABLE IF EXISTS `ai_recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_recommendations` (
  `recommendation_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `recommendation` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `simulation_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`recommendation_id`),
  KEY `FKhdtffrtqgtdwuva3hnict33tt` (`simulation_id`),
  KEY `FKsrkixw0sckdtgpldj1658p575` (`student_id`),
  CONSTRAINT `FKhdtffrtqgtdwuva3hnict33tt` FOREIGN KEY (`simulation_id`) REFERENCES `simulations` (`simulation_id`),
  CONSTRAINT `FKsrkixw0sckdtgpldj1658p575` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_recommendations`
--

LOCK TABLES `ai_recommendations` WRITE;
/*!40000 ALTER TABLE `ai_recommendations` DISABLE KEYS */;
INSERT INTO `ai_recommendations` VALUES (1,'2026-09-22 16:52:24.329144','2026-09-22 16:52:24.329144','You need more practice. Revisit the simulation before attempting again.',3,1);
/*!40000 ALTER TABLE `ai_recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessment_results`
--

DROP TABLE IF EXISTS `assessment_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessment_results` (
  `result_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `passed` bit(1) DEFAULT NULL,
  `percentage` double DEFAULT NULL,
  `score` int DEFAULT NULL,
  `total_marks` int DEFAULT NULL,
  `assessment_id` bigint DEFAULT NULL,
  `assignment_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`result_id`),
  KEY `FKp1ml4sw7ygau1bm5hhcpo2hhu` (`assessment_id`),
  KEY `FKectpohff8x555jflk10l00lci` (`assignment_id`),
  KEY `FK8odlxtqrb7krn83rmy2opkeuy` (`student_id`),
  CONSTRAINT `FK8odlxtqrb7krn83rmy2opkeuy` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `FKectpohff8x555jflk10l00lci` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`assignment_id`),
  CONSTRAINT `FKp1ml4sw7ygau1bm5hhcpo2hhu` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`assessment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessment_results`
--

LOCK TABLES `assessment_results` WRITE;
/*!40000 ALTER TABLE `assessment_results` DISABLE KEYS */;
INSERT INTO `assessment_results` VALUES (1,'2026-09-22 16:52:24.184390','2026-09-22 16:52:24.390149',_binary '\0',33.33333333333333,5,15,3,1,1);
/*!40000 ALTER TABLE `assessment_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessments`
--

DROP TABLE IF EXISTS `assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessments` (
  `assessment_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `passing_marks` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_marks` int DEFAULT NULL,
  `simulation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`assessment_id`),
  UNIQUE KEY `UKm4iql7jv37pwja6nev4n60b3f` (`simulation_id`),
  CONSTRAINT `FK86xlwfpwkjs6dpi2wn2phaumu` FOREIGN KEY (`simulation_id`) REFERENCES `simulations` (`simulation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessments`
--

LOCK TABLES `assessments` WRITE;
/*!40000 ALTER TABLE `assessments` DISABLE KEYS */;
INSERT INTO `assessments` VALUES (1,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',10,10,'Earthquake Readiness Assessment',15,1),(2,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',8,10,'Fire Evacuation Assessment',15,2),(3,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',12,10,'Flood Response Assessment',15,3);
/*!40000 ALTER TABLE `assessments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `assignment_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `assigned_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `instructions` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('COMPLETED','IN_PROGRESS','OVERDUE','PENDING') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `simulation_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`assignment_id`),
  KEY `FKmtgb2gxevcfdl5ifq1g71qidv` (`class_id`),
  KEY `FKkhe8o668j72rueopdvlq67mh3` (`simulation_id`),
  KEY `FKthsv5nybgtij6aybrhfb6n6of` (`teacher_id`),
  CONSTRAINT `FKkhe8o668j72rueopdvlq67mh3` FOREIGN KEY (`simulation_id`) REFERENCES `simulations` (`simulation_id`),
  CONSTRAINT `FKmtgb2gxevcfdl5ifq1g71qidv` FOREIGN KEY (`class_id`) REFERENCES `school_classes` (`class_id`),
  CONSTRAINT `FKthsv5nybgtij6aybrhfb6n6of` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,'2026-09-22 16:51:54.491143','2026-09-22 16:51:54.491143','2026-09-22','2026-08-30','Please complete this simulation drill.','PENDING',1,3,1);
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `message` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('AI_RECOMMENDATION','ASSESSMENT','ASSIGNMENT','RESULT','SYSTEM') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parents`
--

DROP TABLE IF EXISTS `parents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parents` (
  `parent_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `occupation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relationship` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`parent_id`),
  UNIQUE KEY `UK8ilkpfgsi469y36w3wryrtrdg` (`student_id`),
  UNIQUE KEY `UKc1t2v6wf187l8w0yew9sph3l4` (`user_id`),
  CONSTRAINT `FKchh8tf8w072tapgqoijrahojk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKivc7hrl007b55xq6endc0bb58` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parents`
--

LOCK TABLES `parents` WRITE;
/*!40000 ALTER TABLE `parents` DISABLE KEYS */;
INSERT INTO `parents` VALUES (1,'2026-09-22 16:53:29.309906','2026-09-22 16:53:29.309906','Guardian','Parent',1,4);
/*!40000 ALTER TABLE `parents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_options`
--

DROP TABLE IF EXISTS `question_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_options` (
  `option_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `correct` bit(1) DEFAULT NULL,
  `option_text` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_id` bigint DEFAULT NULL,
  PRIMARY KEY (`option_id`),
  KEY `FKsb9v00wdrgc9qojtjkv7e1gkp` (`question_id`),
  CONSTRAINT `FKsb9v00wdrgc9qojtjkv7e1gkp` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_options`
--

LOCK TABLES `question_options` WRITE;
/*!40000 ALTER TABLE `question_options` DISABLE KEYS */;
INSERT INTO `question_options` VALUES (1,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Drop, Cover, Hold On',1),(2,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Doorway, Corridor, Hallway',1),(3,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Direction, Caution, Hazard',1),(4,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Direct, Control, Help',1),(5,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Beside an interior load-bearing wall',2),(6,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Under a heavy wooden desk',2),(7,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Directly beside or under a large glass window',2),(8,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Under a sturdy laboratory table',2),(9,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Elevators move too slowly',3),(10,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Power failure or counterweight derailment can trap occupants',3),(11,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Elevator doors open automatically on ground floor only',3),(12,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Elevators are reserved exclusively for emergency wardens',3),(13,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Directly under a concrete covered walkway',4),(14,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Beside the main electrical substation / transformer',4),(15,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','In the center of an open sports ground away from structures',4),(16,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Right next to the multi-story science block',4),(17,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Run as fast as possible down the stairs',5),(18,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Drop onto the steps, protect your head/neck with your arms, and hold the handrail',5),(19,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Jump over the railing to reach the landing below',5),(20,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Push through other students to reach the exterior exit door',5),(21,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Quickly pack up your books and laptop',6),(22,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Turn off open gas burners or heat sources if immediately accessible, then Drop, Cover, Hold On',6),(23,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Grab chemical bottles to prevent them from tipping over',6),(24,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Run to the hallway fire alarm pull station',6),(25,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Door frames are no stronger than other parts of modern buildings and swinging doors can cause severe impact injuries',7),(26,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Doorways attract electrical surges from wiring',7),(27,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Doorways collapse before exterior walls',7),(28,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Door frames block radio communications',7),(29,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Run inside the closest building for shelter',8),(30,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Move to an open area away from power lines, trees, streetlights, and brick masonry',8),(31,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Climb up onto the nearest boundary wall to see surrounding damage',8),(32,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Lie flat on your stomach directly against the school building wall',8),(33,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Stand tall with hands over your ears',9),(34,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Drop onto your hands and knees to prevent being knocked down and maintain crawling mobility',9),(35,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Lie completely flat on your back looking at the ceiling',9),(36,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Kneel upright with eyes closed',9),(37,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Dropping under sturdy desks is safer than crouching beside heavy objects where crushing hazards exist',10),(38,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Wearing a hard hat is dangerous',10),(39,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Leaving the building after shaking stops is wrong',10),(40,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Holding onto table legs causes them to break',10),(41,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Until the bell rings',11),(42,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Until the primary shaking completely stops and teachers assess that it is safe to move',11),(43,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Exactly 30 seconds regardless of shaking',11),(44,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Until the first siren sounds',11),(45,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Scream continuously at the top of your voice',12),(46,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Tap rhythmically on a metal pipe or wall with a hard object or stone',12),(47,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Light a match to illuminate your location',12),(48,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '\0','Shake surrounding rubble vigorously to break free',12),(49,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Main water filtration only',13),(50,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Main gas line and electrical circuit breakers to prevent secondary fires and explosions',13),(51,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Air conditioning vents only',13),(52,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Internet router and server rack power only',13),(53,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Heavy textbooks and spare stationery',14),(54,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','First aid supplies, emergency whistle, battery-powered flashlight, class roster, and emergency contact list',14),(55,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Decorative banners and classroom craft scissors',14),(56,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Extra sports uniforms and footballs',14),(57,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Sprint individually to reach the school gate fastest',15),(58,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Walk briskly in a single-file line protecting heads with bags/binders, remaining silent to hear teacher instructions',15),(59,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Hold hands across the entire width of the hallway',15),(60,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Stop in corridors to retrieve bags from personal lockers',15),(61,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Clean, cooler air and higher oxygen concentrations remain within the bottom 12 to 24 inches of the floor',16),(62,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Smoke sinks quickly to the floor within minutes',16),(63,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Crawling prevents tripping over electrical cables',16),(64,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Floor tiles absorb thermal radiation from flames',16),(65,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Push, Aim, Squeeze, Sweep',17),(66,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Pull the pin, Aim at the base of the fire, Squeeze the lever, Sweep side-to-side',17),(67,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Press the button, Activate alarm, Spray foam, Step back',17),(68,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Protect face, Alert staff, Stop airflow, Secure exit',17),(69,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Kick the door open quickly to escape',18),(70,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Keep the door firmly closed, seal gaps with damp cloth/jackets, and use a secondary escape window or signal from windows',18),(71,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Crack the door open 1 inch to check for flames',18),(72,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Pour a bottle of water on the metal handle and turn it',18),(73,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','100',19),(74,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','101',19),(75,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','102',19),(76,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','108',19),(77,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Run quickly to the nearest outdoor area to extinguish flames with wind',20),(78,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Stop immediately, Drop to the ground, and Roll back and forth covering your face with your hands',20),(79,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Wave your arms vigorously to fan the flames out',20),(80,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Search for a fire extinguisher to spray directly on yourself',20),(81,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Class A (Water)',21),(82,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Class C / Carbon Dioxide (CO2) or Clean Agent',21),(83,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Wet Chemical Class K',21),(84,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Foam extinguisher Class B',21),(85,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Windows cannot be broken by emergency firefighters',22),(86,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Open windows supply fresh oxygen that accelerates fire combustion and feeds smoke drafts',22),(87,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Closed windows block sound of fire engines',22),(88,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Glass windows melt instantly when air enters',22),(89,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Fight the fire using bucket water',23),(90,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Assist the teacher in leading students along primary evacuation routes and ensuring nobody is left behind in restrooms',23),(91,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Stay inside to collect classroom laptops and tablets',23),(92,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Silence the school fire alarm bell',23),(93,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Directly under the school front entrance canopy',24),(94,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','At the pre-designated Emergency Assembly Point at a safe distance from heat, smoke, and incoming fire engines',24),(95,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Beside the main electrical control panel',24),(96,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Near the kitchen or cafeteria service entrance',24),(97,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Water evaporates too quickly to extinguish flames',25),(98,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Water conducts electrical current and presents severe fatal electrocution risk to the operator',25),(99,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Water corrodes electronic circuit boards after fire is out',25),(100,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Water pressure shatters computer screens',25),(101,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Signal Red with a Black band/horn',26),(102,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Bright Blue label band',26),(103,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Cream or Yellow label band',26),(104,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Emerald Green cylinder',26),(105,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Within 10 to 15 minutes',27),(106,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Under 2 to 3 minutes',27),(107,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Within 30 seconds per student',27),(108,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Over 20 minutes for multi-story blocks',27),(109,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Walk in random directions until hitting an open space',28),(110,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Follow a continuous wall on one side using the back of your hand to feel direction toward exit doors',28),(111,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Stand upright and wave a white cloth',28),(112,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Crouch in the center of the hallway and call out names',28),(113,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Dismiss all students to go home',29),(114,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Take attendance using the physical roll roster and immediately report any missing students to the Incident Commander',29),(115,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Return to the building to fetch personal belongings',29),(116,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Allow students to wander around the campus perimeter',29),(117,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Direct contact with open flames',30),(118,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Inhalation of toxic smoke gases such as Carbon Monoxide (CO) and Hydrogen Cyanide',30),(119,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Structural roof collapse',30),(120,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Panic-induced stampedes on level ground',30),(121,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Just 6 inches of fast-moving water can knock an adult down, and 12-18 inches can sweep a vehicle away',31),(122,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Floodwater is safe if it looks clear',31),(123,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Walking in floodwater is safe if you hold a companion\'s hand',31),(124,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Vehicles float safely like boats in deep water',31),(125,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Running down to the basement to hide from rain',32),(126,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Moving all students, vital records, and first aid kits to upper floors or reinforced roof terraces above projected water levels',32),(127,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Digging drainage trenches around the building perimeter',32),(128,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Escaping through underground sewer utility tunnels',32),(129,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Floodwaters carry heavy bacterial contamination, raw sewage, industrial chemicals, submerged debris, and venomous reptiles',33),(130,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Floodwaters freeze rapidly within hours',33),(131,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Floodwaters absorb excess solar UV radiation',33),(132,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Floodwaters emit toxic radon gases',33),(133,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Turn on all exhaust fans to dry the floors',34),(134,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Switch off the main electrical supply at the master breaker panel BEFORE water reaches outlets or switches',34),(135,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Open all ground floor water taps',34),(136,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Disconnect the telephone landline only',34),(137,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Green Alert (No Warning)',35),(138,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Red Alert (Take Action - Extremely Heavy Rainfall)',35),(139,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Yellow Alert (Be Updated)',35),(140,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Blue Alert (Normal Monsoon)',35),(141,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Food items packaged in hermetically sealed metal cans with labels washed off',36),(142,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Any unsealed food, drinking water, or fresh produce submerged in floodwater',36),(143,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Boiled water that was stored in closed insulated containers',36),(144,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Water from high-level overhead water tanks with intact lids',36),(145,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Asthma and Hypertension',37),(146,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Cholera, Typhoid, Leptospirosis, and Hepatitis A',37),(147,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Osteoporosis and Rickets',37),(148,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Tuberculosis and Bronchitis',37),(149,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Let it stand in sunlight for 5 minutes',38),(150,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Filter through a clean cloth and bring to a rolling boil for at least 1-3 minutes or use halogen water purification tablets',38),(151,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Stir with a metal spoon for 10 minutes',38),(152,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Add a small pinch of common salt',38),(153,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Shout into the wind',39),(154,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Wave a brightly colored cloth or flag, use a whistle, or use reflective mirrors/flashlights',39),(155,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Light a plastic bonfire on the roof',39),(156,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Jump into the floodwater to swim toward rescuers',39),(157,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Uncovered drainage manholes, broken glass, downed live electric cables, and structural sinkholes',40),(158,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Underground quicksand deposits',40),(159,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Extreme localized vacuum pockets',40),(160,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Magnetic fields from underground pipes',40),(161,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Remain inside with all windows tightly rolled up',41),(162,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Abandon the vehicle immediately if water is rising and seek higher ground, provided water is not moving swiftly across the escape path',41),(163,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Try repeatedly to restart the engine until battery dies',41),(164,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Climb underneath the vehicle for shelter',41),(165,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Waterproof Floating Emergency Kit with drinking water, dry rations, ORS packets, waterproof torches, whistle, and emergency medicines',42),(166,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Paper notebooks and wooden drawing boards',42),(167,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Metal cutlery and ceramic plates',42),(168,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Electric kettles and desktop computers',42),(169,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Building permanent dams',43),(170,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Specialized search, water rescue using motorized inflatable boats (IRBs), medical evacuation, and relief distribution',43),(171,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Repairing private home roofs',43),(172,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Conducting road traffic fines',43),(173,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Boundary walls reflect radio signals',44),(174,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Saturated soil foundations weaken boundary walls, making them prone to sudden structural collapse under water pressure',44),(175,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Boundary walls absorb moisture and become overly cold',44),(176,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Boundary walls attract lightning during rain',44),(177,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','As soon as the standing water drains away',45),(178,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Only after certified structural safety inspection, electrical clearance by certified engineers, and complete chemical disinfection',45),(179,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Immediately the following morning',45),(180,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '\0','Whenever the school bell rings',45);
/*!40000 ALTER TABLE `question_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `question_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `question_text` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assessment_id` bigint DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `FK2g7a2cfymnunug0860elnr447` (`assessment_id`),
  CONSTRAINT `FK2g7a2cfymnunug0860elnr447` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`assessment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','What does the acronym \'DCH\' stand for during an earthquake evacuation drill?',1),(2,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','Which of the following locations inside a classroom is UNSAFE during heavy seismic shaking?',1),(3,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','Why must elevators NEVER be used during an earthquake evacuation?',1),(4,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','After tremors stop, what is the safest open-air assembly point on a school campus?',1),(5,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','What should you do if an aftershock occurs while evacuating down a stairwell?',1),(6,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','If you are in a school science laboratory when an earthquake starts, what is your immediate priority?',1),(7,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','What is the primary danger associated with doorways during modern building earthquakes?',1),(8,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','If you are outdoors on the school campus when an earthquake begins, what should you do?',1),(9,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','What is the recommended posture during the \'Drop\' phase of Drop, Cover, and Hold On?',1),(10,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','What is a \'Triangle of Life\' misconception that NDMA and seismic experts warn against?',1),(11,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','How long should students stay in the \'Cover\' position during an earthquake?',1),(12,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','If trapped under classroom debris after an earthquake, how should you signal rescuers to conserve oxygen and energy?',1),(13,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000','Which utility should school maintenance staff shut off immediately following a major earthquake?',1),(14,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What should be included in every classroom\'s \'Go-Bag\' or Earthquake Emergency Kit?',1),(15,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','During post-earthquake evacuation, how should students move along school corridors?',1),(16,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','When navigating a smoke-filled corridor during a school fire, why is it vital to crawl low to the floor?',2),(17,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','In the P.A.S.S. fire extinguisher operation method, what does the acronym stand for?',2),(18,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','If a closed classroom door handle feels hot to the touch during a fire evacuation, what must you do?',2),(19,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','Which emergency phone number is universally dialed for Fire Services in India?',2),(20,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','If your personal clothing catches fire during a laboratory or cafeteria accident, what is the life-saving procedure?',2),(21,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What class of fire extinguisher is specifically designed for electrical fires involving computers, server racks, or wiring?',2),(22,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','Why should classroom windows usually be kept CLOSED when evacuating a room on fire?',2),(23,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What is the primary role of a designated Class Fire Monitor / Student Leader during a fire drill?',2),(24,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','Where should the school community gather once outside the burning building?',2),(25,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','Why are water-type fire extinguishers strictly forbidden on energized electrical equipment fires?',2),(26,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What color code is typically used for Carbon Dioxide (CO2) fire extinguisher cylinders or label bands?',2),(27,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What is the maximum time a well-trained school should take to fully evacuate during an unannounced fire drill?',2),(28,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','If thick smoke makes school emergency exit signs impossible to see, how should you orient yourself toward exits?',2),(29,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What should a teacher do immediately upon reaching the assembly area with their class?',2),(30,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What is the primary cause of death in most building fire emergencies?',2),(31,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What is the critical rule regarding walking or driving through moving floodwaters (\'Turn Around, Don\'t Drown\')?',3),(32,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What is the concept of \'Vertical Evacuation\' during a rapid flash flood at a school campus?',3),(33,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','Why is contact with urban floodwater extremely hazardous even after rain stops?',3),(34,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','If floodwaters begin rapidly rising inside the ground floor of a school building, what utility action is mandatory?',3),(35,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What meteorological alert level from the India Meteorological Department (IMD) indicates severe flood risk requiring immediate action?',3),(36,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What item should NEVER be consumed if it has come into contact with floodwater?',3),(37,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What waterborne infectious diseases commonly spike in communities following severe flood inundation?',3),(38,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','How can students purify flood-compromised water for emergency drinking if bottled water is unavailable?',3),(39,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','If marooned on the roof terrace of a school awaiting disaster rescue boats or helicopters, how should you signal?',3),(40,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What hidden hazard is present under muddy floodwaters on flooded streets or campus walkways?',3),(41,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What should students do if stranded in a vehicle that stalls in rapidly rising floodwater?',3),(42,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What type of emergency kit is essential for school flood preparedness?',3),(43,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','What is the primary role of the National Disaster Response Force (NDRF) during urban flood emergencies?',3),(44,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','Why should students avoid leaning against external brick perimeter boundary walls during floods?',3),(45,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000','After floodwaters recede, when is it safe for students to re-enter ground floor classrooms?',3);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_classes`
--

DROP TABLE IF EXISTS `school_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_classes` (
  `class_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `class_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`class_id`),
  KEY `FK5pyw0mtl3c0033cwb8v2grg9c` (`school_id`),
  KEY `FKadoa5eubpjsj0ayb44f9nc7wp` (`teacher_id`),
  CONSTRAINT `FK5pyw0mtl3c0033cwb8v2grg9c` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`),
  CONSTRAINT `FKadoa5eubpjsj0ayb44f9nc7wp` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_classes`
--

LOCK TABLES `school_classes` WRITE;
/*!40000 ALTER TABLE `school_classes` DISABLE KEYS */;
INSERT INTO `school_classes` VALUES (1,'2026-09-22 16:51:40.448344','2026-09-22 16:51:40.448344',NULL,'Class 7','A',1,1);
/*!40000 ALTER TABLE `school_classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schools` (
  `school_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`school_id`),
  UNIQUE KEY `UKnx2n51sfwk3f19snat3ll5t5d` (`school_name`),
  UNIQUE KEY `UKjwg1c30unxe6ee4ssancp14qh` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES (1,'2026-09-22 16:50:42.445955','2026-09-22 16:50:42.445955','Coimbatore Address','Coimbatore','contact@karpagamhighschool.edu','1234567890',NULL,'Karpagam high school','State A');
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simulations`
--

DROP TABLE IF EXISTS `simulations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simulations` (
  `simulation_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `description` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` enum('ADVANCED','BEGINNER','INTERMEDIATE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disaster_type` enum('CHEMICAL_LEAK','CYCLONE','EARTHQUAKE','FIRE','FIRST_AID','FLOOD','LANDSLIDE','TSUNAMI') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`simulation_id`),
  KEY `FK3eint8lpqnwl46kyqdamfvxh2` (`teacher_id`),
  CONSTRAINT `FK3eint8lpqnwl46kyqdamfvxh2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simulations`
--

LOCK TABLES `simulations` WRITE;
/*!40000 ALTER TABLE `simulations` DISABLE KEYS */;
INSERT INTO `simulations` VALUES (1,'2026-09-22 22:13:20.000000','2026-09-22 22:13:20.000000',_binary '','Learn immediate life-saving actions during a major earthquake inside a multi-story building. Master Drop, Cover, and Hold On techniques, hazard avoidance, and post-tremor evacuation protocols.','INTERMEDIATE','EARTHQUAKE',10,'🌋','Earthquake Safety & Drop-Cover-Hold',NULL),(2,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Master rapid classroom evacuation during a fire emergency, low-smoke crawling navigation, alarm activation, and operating fire extinguishers using the P.A.S.S. technique.','BEGINNER','FIRE',8,'🚨','School Fire Evacuation & P.A.S.S.',NULL),(3,'2026-09-22 22:13:21.000000','2026-09-22 22:13:21.000000',_binary '','Navigate rapid flood inundation, avoid waterborne electrical hazards, respond to meteorological flash alerts, and execute vertical evacuation to designated higher ground.','ADVANCED','FLOOD',12,'🌊','Flash Flood Early Warning & High Ground',NULL);
/*!40000 ALTER TABLE `simulations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_answers`
--

DROP TABLE IF EXISTS `student_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_answers` (
  `answer_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `result_id` bigint DEFAULT NULL,
  `question_id` bigint DEFAULT NULL,
  `selected_option_id` bigint DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `FKcadv05b7xguguc75ssg1yuqyh` (`result_id`),
  KEY `FK8nyksamccim8emu803uhf2da` (`question_id`),
  KEY `FK8dhrgyyw99oyj0q650s1x2xo3` (`selected_option_id`),
  CONSTRAINT `FK8dhrgyyw99oyj0q650s1x2xo3` FOREIGN KEY (`selected_option_id`) REFERENCES `question_options` (`option_id`),
  CONSTRAINT `FK8nyksamccim8emu803uhf2da` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`),
  CONSTRAINT `FKcadv05b7xguguc75ssg1yuqyh` FOREIGN KEY (`result_id`) REFERENCES `assessment_results` (`result_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_answers`
--

LOCK TABLES `student_answers` WRITE;
/*!40000 ALTER TABLE `student_answers` DISABLE KEYS */;
INSERT INTO `student_answers` VALUES (1,'2026-09-22 16:52:24.238729','2026-09-22 16:52:24.238729',1,31,121),(2,'2026-09-22 16:52:24.265743','2026-09-22 16:52:24.265743',1,32,126),(3,'2026-09-22 16:52:24.280781','2026-09-22 16:52:24.280781',1,33,129),(4,'2026-09-22 16:52:24.298786','2026-09-22 16:52:24.298786',1,34,134),(5,'2026-09-22 16:52:24.314141','2026-09-22 16:52:24.314141',1,35,138);
/*!40000 ALTER TABLE `student_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_progress`
--

DROP TABLE IF EXISTS `student_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_progress` (
  `progress_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `completion_percentage` int DEFAULT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `status` enum('COMPLETED','IN_PROGRESS','NOT_STARTED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignment_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`progress_id`),
  KEY `FKp545hs2vqdshxwebi0gte0ntp` (`assignment_id`),
  KEY `FKo0ptk24xm7njb9nbhsjldncrl` (`student_id`),
  CONSTRAINT `FKo0ptk24xm7njb9nbhsjldncrl` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `FKp545hs2vqdshxwebi0gte0ntp` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`assignment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_progress`
--

LOCK TABLES `student_progress` WRITE;
/*!40000 ALTER TABLE `student_progress` DISABLE KEYS */;
INSERT INTO `student_progress` VALUES (1,'2026-09-22 16:52:24.371967','2026-09-22 16:52:24.371967','2026-09-22 16:52:24.369973',100,'2026-09-22 16:52:24.369973','COMPLETED',1,1);
/*!40000 ALTER TABLE `student_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `admission_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roll_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id` bigint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `UK4ijilwehsq4n3vhrdlq722lnc` (`admission_number`),
  UNIQUE KEY `UKkmd86jf46110c60b412tjt2bg` (`roll_number`),
  UNIQUE KEY `UKg4fwvutq09fjdlb4bb0byp7t` (`user_id`),
  KEY `FKdojmg8v3rw2ow4dev2b8q5oqq` (`school_id`),
  KEY `FKnvr9y8csmtxo56rrsp0bdrcqf` (`class_id`),
  KEY `FKbrb7umgbkqrmj9lfwkf0p2r7r` (`teacher_id`),
  CONSTRAINT `FKbrb7umgbkqrmj9lfwkf0p2r7r` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`),
  CONSTRAINT `FKdojmg8v3rw2ow4dev2b8q5oqq` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`),
  CONSTRAINT `FKdt1cjx5ve5bdabmuuf3ibrwaq` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKnvr9y8csmtxo56rrsp0bdrcqf` FOREIGN KEY (`class_id`) REFERENCES `school_classes` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'2026-09-22 16:51:40.460340','2026-09-22 16:51:40.460340','ADM-3','146',1,1,1,3);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `teacher_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `employee_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qualification` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `UKcd1k6xwg9jqtiwx9ybnxpmoh9` (`user_id`),
  UNIQUE KEY `UK8xdh0jsitskwq83arwxvyihhc` (`employee_id`),
  KEY `FK25tvrvw3ww2p7mbt62abrbwev` (`school_id`),
  CONSTRAINT `FK25tvrvw3ww2p7mbt62abrbwev` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`),
  CONSTRAINT `FKb8dct7w2j1vl1r2bpstw5isc0` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,'2026-09-22 16:50:42.661896','2026-09-22 16:50:42.661896','TCH-2','Master of Science','Disaster Preparedness & Response',1,2);
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `district` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plain_password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('ADMIN','COLLECTOR','PARENT','STUDENT','TEACHER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`),
  KEY `FK3gj5j7vnsoxf1wp9n5hsqdiq3` (`school_id`),
  CONSTRAINT `FK3gj5j7vnsoxf1wp9n5hsqdiq3` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-09-22 16:41:57.116612','2026-09-22 16:41:57.116612',_binary '',NULL,'admin@gmail.com','Admin','$2a$10$QsAtBsFR/xfXkqdfaxWXqO4Ly9eIHfdvPtGUGBnuV0U0G0fuYEbwK','0000000000',NULL,'ADMIN',NULL,NULL),(2,'2026-09-22 16:50:42.653970','2026-09-22 16:50:57.063934',_binary '',NULL,'717824p140@kce.ac.in','Pradeep kumar','$2a$10$rlJB7R5C4HaOikv84ufaEeN5rx2AZ/IFmuqADm2Z8ZjeHbxmk3Tza','9080706050','password123','TEACHER',NULL,1),(3,'2026-09-22 16:51:40.418872','2026-09-22 16:51:40.418872',_binary '',NULL,'717824p146@kce.ac.in','Saisaran J','$2a$10$z0QdpR0Jw.B600zr9mDVCeMAbkXMhMAQ1ZdjRCMPWMMDNfvJpvaDe','9626209192','std6843','STUDENT',NULL,1),(4,'2026-09-22 16:53:29.287389','2026-09-22 16:53:46.378954',_binary '',NULL,'717824p124@kce.ac.in','Karthikeyan','$2a$10$hUxw0aJLLmfnCf8bqA3fsuP0EMXzokK0adpnGPYhJLCO9Gu21p4Ga','9876543210','password123','PARENT',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-23  0:46:22
