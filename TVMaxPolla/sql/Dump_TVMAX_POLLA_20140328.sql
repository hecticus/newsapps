CREATE DATABASE  IF NOT EXISTS `tvmax_polla_admin` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `tvmax_polla_admin`;
-- MySQL dump 10.13  Distrib 5.5.24, for osx10.5 (i386)
--
-- Host: 127.0.0.1    Database: tvmax_polla_admin
-- ------------------------------------------------------
-- Server version	5.1.44-log

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
-- Table structure for table `game_match`
--

DROP TABLE IF EXISTS `game_match`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_match` (
  `id_match` int(11) NOT NULL AUTO_INCREMENT,
  `id_group` int(11) NOT NULL,
  `id_team_a` int(11) NOT NULL,
  `id_team_b` int(11) NOT NULL,
  `id_phase` int(11) NOT NULL,
  `date` bigint(14) DEFAULT NULL,
  `id_venue` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_match`),
  KEY `id_phase_idx` (`id_phase`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_match`
--

LOCK TABLES `game_match` WRITE;
/*!40000 ALTER TABLE `game_match` DISABLE KEYS */;
INSERT INTO `game_match` VALUES (1,1,7,14,1,20140612150000,12),(2,1,26,8,1,20140613110000,7),(3,2,16,28,1,20140613140000,11),(4,2,9,4,1,20140613170000,3),(5,3,10,20,1,20140614110000,1),(6,3,12,25,1,20140614200000,9),(7,4,32,13,1,20140614140000,5),(8,4,22,24,1,20140614170000,6),(9,5,31,15,1,20140615110000,2),(10,5,18,21,1,20140615140000,8),(11,6,3,6,1,20140615170000,10),(12,6,23,27,1,20140616140000,4),(13,7,1,29,1,20140616110000,11),(14,7,19,17,1,20140616170000,7),(15,8,5,2,1,20140617110000,1),(16,8,30,11,1,20140617170000,3),(17,1,7,26,1,20140617140000,5),(18,1,8,14,1,20140618170000,6),(19,2,16,9,1,20140618140000,10),(20,2,4,28,1,20140618110000,8),(21,3,10,12,1,20140619110000,2),(22,3,25,20,1,20140619170000,7),(23,4,32,22,1,20140619140000,12),(24,4,24,13,1,20140620110000,9),(25,5,31,18,1,20140620140000,11),(26,5,21,15,1,20140620170000,4),(27,6,3,23,1,20140621110000,1),(28,6,27,6,1,20140621170000,3),(29,7,1,19,1,20140621140000,5),(30,7,17,29,1,20140622170000,6),(31,8,5,30,1,20140622110000,10),(32,8,11,2,1,20140622140000,8),(33,1,8,7,1,20140623150000,2),(34,1,14,26,1,20140623150000,9),(35,2,4,16,1,20140623110000,4),(36,2,28,9,1,20140623110000,12),(37,3,25,10,1,20140624150000,3),(38,3,20,12,1,20140624150000,5),(39,4,24,32,1,20140624110000,7),(40,4,13,22,1,20140624110000,1),(41,5,21,31,1,20140625150000,6),(42,5,15,18,1,20140625150000,10),(43,6,27,3,1,20140625110000,8),(44,6,6,23,1,20140625110000,11),(45,7,17,1,1,20140626110000,9),(46,7,29,19,1,20140626110000,2),(47,8,11,5,1,20140626150000,12),(48,8,2,30,1,20140626150000,4),(49,9,0,0,2,20140628110000,1),(50,10,0,0,2,20140628150000,10),(51,11,0,0,2,20140629110000,5),(52,12,0,0,2,20140629150000,9),(53,13,0,0,2,20140306110000,2),(54,14,0,0,2,20140306150000,8),(55,15,0,0,2,20140701110000,12),(56,16,0,0,2,20140701150000,11),(57,17,0,0,3,20140704150000,5),(58,18,0,0,3,20140704110000,10),(59,19,0,0,3,20140705150000,11),(60,20,0,0,3,20140705110000,2),(61,21,0,0,4,20140708150000,1),(62,22,0,0,4,20140709150000,12),(63,23,0,0,5,20140712150000,2),(64,24,0,0,6,20140713140000,10);
/*!40000 ALTER TABLE `game_match` ENABLE KEYS */;
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

--
-- Table structure for table `match_group`
--

DROP TABLE IF EXISTS `match_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `match_group` (
  `id_group` int(11) NOT NULL AUTO_INCREMENT,
  `id_phase` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_group`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_group`
--

LOCK TABLES `match_group` WRITE;
/*!40000 ALTER TABLE `match_group` DISABLE KEYS */;
INSERT INTO `match_group` VALUES (1,1,'A'),(2,1,'B'),(3,1,'C'),(4,1,'D'),(5,1,'E'),(6,1,'F'),(7,1,'G'),(8,1,'H'),(9,2,'49'),(10,2,'50'),(11,2,'51'),(12,2,'52'),(13,2,'53'),(14,2,'54'),(15,2,'55'),(16,2,'56'),(17,3,'57'),(18,3,'58'),(19,3,'59'),(20,3,'60'),(21,4,'61'),(22,4,'62'),(23,5,'63'),(24,6,'64');
/*!40000 ALTER TABLE `match_group` ENABLE KEYS */;
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
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
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
INSERT INTO `phase` VALUES (1,'Fase de grupos',20140612000000,20140627000000),(2,'Octavos de final',20140628000000,20140702000000),(3,'Cuartos de final',20140704000000,20140706000000),(4,'Semifinales',20140708000000,20140710000000),(5,'Tercer puesto',20140712000000,20140713000000),(6,'Final',20140713000000,20140714000000);
/*!40000 ALTER TABLE `phase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `play_evolutions`
--

DROP TABLE IF EXISTS `play_evolutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `play_evolutions` (
  `id` int(11) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `apply_script` text,
  `revert_script` text,
  `state` varchar(255) DEFAULT NULL,
  `last_problem` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `play_evolutions`
--

LOCK TABLES `play_evolutions` WRITE;
/*!40000 ALTER TABLE `play_evolutions` DISABLE KEYS */;
INSERT INTO `play_evolutions` VALUES (1,'0df7c6d09a296f4bd387be6d7e4ca0317fe15649','2014-03-27 16:29:53','create table person (\nid                        bigint auto_increment not null,\nname                      varchar(255),\nconstraint pk_person primary key (id))\n;','SET FOREIGN_KEY_CHECKS=0;\n\ndrop table person;\n\nSET FOREIGN_KEY_CHECKS=1;','applied','Table \'person\' already exists [ERROR:1050, SQLSTATE:42S01]');
/*!40000 ALTER TABLE `play_evolutions` ENABLE KEYS */;
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
INSERT INTO `team` VALUES (1,'Alemania','GER','gm-lgflag.png'),(2,'Argelia','ALG','ag-lgflag.png'),(3,'Argentina','ARG','ar-lgflag.png'),(4,'Australia','AUS','as-lgflag.png'),(5,'Bélgica','BEL','be-lgflag.png'),(6,'Bosnia y Herzegovina','BIH','bk-lgflag.png'),(7,'Brasil','BRA','br-lgflag.png'),(8,'Camerún','CMR','cm-lgflag.png'),(9,'Chile','CHI','ci-lgflag.png'),(10,'Colombia','COL','co-lgflag.png'),(11,'Corea del Sur','KOR','ks-lgflag.png'),(12,'Costa de Marfil','CIV','iv-lgflag.png'),(13,'Costa Rica','CRC','cs-lgflag.png'),(14,'Croacia','CRO','hr-lgflag.png'),(15,'Ecuador','ECU','ec-lgflag.png'),(16,'España','ESP','sp-lgflag.png'),(17,'Estados Unidos','USA','us-lgflag.png'),(18,'Francia','FRA','fr-lgflag.png'),(19,'Ghana','GHA','gh-lgflag.png'),(20,'Grecia','GRE','gr-lgflag.png'),(21,'Honduras','HON','ho-lgflag.png'),(22,'Inglaterra','ENG','en-lgflag.png'),(23,'Irán','IRN','ir-lgflag.png'),(24,'Italia','ITA','it-lgflag.png'),(25,'Japón','JPN','ja-lgflag.png'),(26,'México','MEX','mx-lgflag.png'),(27,'Nigeria','NGA','ni-lgflag.png'),(28,'Países Bajos','NED','nl-lgflag.png'),(29,'Portugal','POR','po-lgflag.png'),(30,'Rusia','RUS','rs-lgflag.png'),(31,'Suiza','SUI','sz-lgflag.png'),(32,'Uruguay','URU','uy-lgflag.png');
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue`
--

DROP TABLE IF EXISTS `venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `venue` (
  `id_venue` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id_venue`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue`
--

LOCK TABLES `venue` WRITE;
/*!40000 ALTER TABLE `venue` DISABLE KEYS */;
INSERT INTO `venue` VALUES (1,'Belo Horizonte'),(2,'Brasilia'),(3,'Cuiaba'),(4,'Curitiba'),(5,'Fortaleza'),(6,'Manaus'),(7,'Natal'),(8,'Porto Alegre'),(9,'Recife'),(10,'Rio De Janeiro'),(11,'Salvador'),(12,'Sao Paulo');
/*!40000 ALTER TABLE `venue` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-03-28 10:51:32
