CREATE DATABASE  IF NOT EXISTS `tvmax_polla_admin` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `tvmax_polla_admin`;
-- MySQL dump 10.13  Distrib 5.5.16, for Win32 (x86)
--
-- Host: localhost    Database: tvmax_polla_admin
-- ------------------------------------------------------
-- Server version	5.5.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group` (
  `id_group` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_group`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` VALUES (1,'A'),(2,'B'),(3,'C'),(4,'D'),(5,'E'),(6,'F'),(7,'G'),(8,'H');
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match`
--

DROP TABLE IF EXISTS `match`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `match` (
  `id_match` int(11) NOT NULL AUTO_INCREMENT,
  `id_group` int(11) NOT NULL,
  `id_team_a` int(11) NOT NULL,
  `id_team_b` int(11) NOT NULL,
  `id_phase` int(11) NOT NULL,
  `date` bigint(14) DEFAULT NULL,
  `venue` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_match`),
  KEY `id_phase_idx` (`id_phase`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match`
--

LOCK TABLES `match` WRITE;
/*!40000 ALTER TABLE `match` DISABLE KEYS */;
INSERT INTO `match` VALUES (1,1,7,14,1,NULL,NULL),(2,1,26,8,1,NULL,NULL),(3,2,16,28,1,NULL,NULL),(4,2,9,4,1,NULL,NULL),(5,3,10,20,1,NULL,NULL),(6,3,12,25,1,NULL,NULL),(7,4,32,13,1,NULL,NULL),(8,4,22,24,1,NULL,NULL),(9,5,31,15,1,NULL,NULL),(10,5,18,21,1,NULL,NULL),(11,6,3,6,1,NULL,NULL),(12,6,23,27,1,NULL,NULL),(13,7,1,29,1,NULL,NULL),(14,7,19,17,1,NULL,NULL),(15,8,5,2,1,NULL,NULL),(16,8,30,11,1,NULL,NULL),(17,1,7,26,1,NULL,NULL),(18,1,8,14,1,NULL,NULL),(19,2,16,9,1,NULL,NULL),(20,2,4,28,1,NULL,NULL),(21,3,10,12,1,NULL,NULL),(22,3,25,20,1,NULL,NULL),(23,4,32,22,1,NULL,NULL),(24,4,24,13,1,NULL,NULL),(25,5,31,18,1,NULL,NULL),(26,5,21,15,1,NULL,NULL),(27,6,3,23,1,NULL,NULL),(28,6,27,6,1,NULL,NULL),(29,7,1,19,1,NULL,NULL),(30,7,17,29,1,NULL,NULL),(31,8,5,30,1,NULL,NULL),(32,8,11,2,1,NULL,NULL),(33,1,8,7,1,NULL,NULL),(34,1,14,26,1,NULL,NULL),(35,2,4,16,1,NULL,NULL),(36,2,28,9,1,NULL,NULL),(37,3,25,10,1,NULL,NULL),(38,3,20,12,1,NULL,NULL),(39,4,24,32,1,NULL,NULL),(40,4,13,22,1,NULL,NULL),(41,5,21,31,1,NULL,NULL),(42,5,15,18,1,NULL,NULL),(43,6,27,3,1,NULL,NULL),(44,6,6,23,1,NULL,NULL),(45,7,17,1,1,NULL,NULL),(46,7,29,19,1,NULL,NULL),(47,8,11,5,1,NULL,NULL),(48,8,2,30,1,NULL,NULL);
/*!40000 ALTER TABLE `match` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team` (
  `id_team` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `shortname` varchar(45) DEFAULT NULL,
  `flag_file` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_team`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (1,'Alemania','GER','gm-lgflag.gif'),(2,'Argelia','ALG','ag-lgflag.gif'),(3,'Argentina','ARG','ar-lgflag.gif'),(4,'Australia','AUS','as-lgflag.gif'),(5,'Bélgica','BEL','be-lgflag.gif'),(6,'Bosnia y Herzegovina','BIH','bk-lgflag.gif'),(7,'Brasil','BRA','br-lgflag.gif'),(8,'Camerún','CMR','cm-lgflag.gif'),(9,'Chile','CHI','ci-lgflag.gif'),(10,'Colombia','COL','co-lgflag.gif'),(11,'Corea del Sur','KOR','ks-lgflag.gif'),(12,'Costa de Marfil','CIV','iv-lgflag.gif'),(13,'Costa Rica','CRC','cs-lgflag.gif'),(14,'Croacia','CRO','hr-lgflag.gif'),(15,'Ecuador','ECU','ec-lgflag.gif'),(16,'España','ESP','sp-lgflag.gif'),(17,'Estados Unidos','USA','us-lgflag.gif'),(18,'Francia','FRA','fr-lgflag.gif'),(19,'Ghana','GHA','gh-lgflag.gif'),(20,'Grecia','GRE','gr-lgflag.gif'),(21,'Honduras','HON','ho-lgflag.gif'),(22,'Inglaterra','ENG','en-lgflag.gif'),(23,'Irán','IRN','ir-lgflag.gif'),(24,'Italia','ITA','it-lgflag.gif'),(25,'Japón','JPN','ja-lgflag.gif'),(26,'México','MEX','mx-lgflag.gif'),(27,'Nigeria','NGA','ni-lgflag.gif'),(28,'Países Bajos','NED','nl-lgflag.gif'),(29,'Portugal','POR','po-lgflag.gif'),(30,'Rusia','RUS','rs-lgflag.gif'),(31,'Suiza','SUI','sz-lgflag.gif'),(32,'Uruguay','URU','uy-lgflag.gif');
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phase`
--

DROP TABLE IF EXISTS `phase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phase` (
  `id_phase` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `date_start` bigint(14) DEFAULT NULL,
  `date_end` bigint(14) DEFAULT NULL,
  PRIMARY KEY (`id_phase`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phase`
--

LOCK TABLES `phase` WRITE;
/*!40000 ALTER TABLE `phase` DISABLE KEYS */;
INSERT INTO `phase` VALUES (1,'Fase de grupos',NULL,NULL),(2,'Octavos de final',NULL,NULL),(3,'Cuartos de final',NULL,NULL),(4,'Semifinales',NULL,NULL),(5,'Tercer puesto',NULL,NULL),(6,'Final',NULL,NULL);
/*!40000 ALTER TABLE `phase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_bet`
--

DROP TABLE IF EXISTS `client_bet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_bet` (
  `id_client_bet` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_client` bigint(20) NOT NULL,
  `id_match` int(11) DEFAULT NULL,
  `id_team_winner` int(11) DEFAULT NULL,
  `id_team_loser` int(11) DEFAULT NULL,
  `score_winner` int(11) DEFAULT NULL,
  `score_loser` varchar(45) DEFAULT NULL,
  `draw` int(1) DEFAULT NULL,
  `id_leaderboard` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_client_bet`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_bet`
--

LOCK TABLES `client_bet` WRITE;
/*!40000 ALTER TABLE `client_bet` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_bet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match_results`
--

DROP TABLE IF EXISTS `match_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `match_results` (
  `id_match` int(11) NOT NULL,
  `score_team_a` int(11) NOT NULL,
  `score_team_b` int(11) NOT NULL,
  `penalties_team_a` int(11) DEFAULT NULL,
  `penalties_team_b` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_match`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_results`
--

LOCK TABLES `match_results` WRITE;
/*!40000 ALTER TABLE `match_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `match_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_has_team`
--

DROP TABLE IF EXISTS `group_has_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_has_team` (
  `id_group_has_team` int(11) NOT NULL AUTO_INCREMENT,
  `id_group` int(11) DEFAULT NULL,
  `id_team` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_group_has_team`),
  KEY `id_group_idx` (`id_group`),
  KEY `id_team_idx` (`id_team`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_has_team`
--

LOCK TABLES `group_has_team` WRITE;
/*!40000 ALTER TABLE `group_has_team` DISABLE KEYS */;
INSERT INTO `group_has_team` VALUES (1,1,7),(2,1,14),(3,1,26),(4,1,8),(5,2,16),(6,2,28),(7,2,9),(8,2,4),(9,3,10),(10,3,20),(11,3,12),(12,3,25),(13,4,32),(14,4,13),(15,4,22),(16,4,24),(17,5,31),(18,5,15),(19,5,18),(20,5,21),(21,6,3),(22,6,6),(23,6,23),(24,6,27),(25,7,1),(26,7,29),(27,7,19),(28,7,17),(29,8,5),(30,8,2),(31,8,30),(32,8,11);
/*!40000 ALTER TABLE `group_has_team` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-03-25 18:34:16
