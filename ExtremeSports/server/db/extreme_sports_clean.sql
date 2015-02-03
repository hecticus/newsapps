CREATE DATABASE  IF NOT EXISTS `extreme_sports` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `extreme_sports`;
-- MySQL dump 10.13  Distrib 5.6.13, for osx10.6 (i386)
--
-- Host: 10.0.3.2    Database: extreme_sports
-- ------------------------------------------------------
-- Server version	5.1.63-0ubuntu0.10.04.1-log

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
-- Table structure for table `athlete_has_social_network`
--

DROP TABLE IF EXISTS `athlete_has_social_network`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `athlete_has_social_network` (
  `id_athlete_has_social_network` int(11) NOT NULL AUTO_INCREMENT,
  `id_theme` int(11) DEFAULT NULL,
  `id_social_network` int(11) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_athlete_has_social_network`),
  KEY `ix_athlete_has_social_network_athlete_1` (`id_theme`),
  KEY `ix_athlete_has_social_network_socialNetwork_2` (`id_social_network`),
  CONSTRAINT `fk_athlete_has_social_network_athlete_1` FOREIGN KEY (`id_theme`) REFERENCES `athletes` (`id_athlete`),
  CONSTRAINT `fk_athlete_has_social_network_socialNetwork_2` FOREIGN KEY (`id_social_network`) REFERENCES `social_networks` (`id_social_network`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `athlete_has_social_network`
--

LOCK TABLES `athlete_has_social_network` WRITE;
/*!40000 ALTER TABLE `athlete_has_social_network` DISABLE KEYS */;
/*!40000 ALTER TABLE `athlete_has_social_network` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `athlete_has_sports`
--

DROP TABLE IF EXISTS `athlete_has_sports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `athlete_has_sports` (
  `id_athlete_has_category` int(11) NOT NULL AUTO_INCREMENT,
  `id_sport` int(11) DEFAULT NULL,
  `id_athlete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_athlete_has_category`),
  KEY `ix_athlete_has_sports_sport_3` (`id_sport`),
  KEY `ix_athlete_has_sports_athlete_4` (`id_athlete`),
  CONSTRAINT `fk_athlete_has_sports_athlete_4` FOREIGN KEY (`id_athlete`) REFERENCES `athletes` (`id_athlete`),
  CONSTRAINT `fk_athlete_has_sports_sport_3` FOREIGN KEY (`id_sport`) REFERENCES `sports` (`id_sport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `athlete_has_sports`
--

LOCK TABLES `athlete_has_sports` WRITE;
/*!40000 ALTER TABLE `athlete_has_sports` DISABLE KEYS */;
/*!40000 ALTER TABLE `athlete_has_sports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `athletes`
--

DROP TABLE IF EXISTS `athletes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `athletes` (
  `id_athlete` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `default_photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_athlete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `athletes`
--

LOCK TABLES `athletes` WRITE;
/*!40000 ALTER TABLE `athletes` DISABLE KEYS */;
/*!40000 ALTER TABLE `athletes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_has_athlete`
--

DROP TABLE IF EXISTS `client_has_athlete`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_has_athlete` (
  `id_client_has_theme` int(11) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) DEFAULT NULL,
  `id_athlete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_client_has_theme`),
  KEY `ix_client_has_athlete_client_6` (`id_client`),
  KEY `ix_client_has_athlete_athlete_7` (`id_athlete`),
  CONSTRAINT `fk_client_has_athlete_athlete_7` FOREIGN KEY (`id_athlete`) REFERENCES `athletes` (`id_athlete`),
  CONSTRAINT `fk_client_has_athlete_client_6` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_athlete`
--

LOCK TABLES `client_has_athlete` WRITE;
/*!40000 ALTER TABLE `client_has_athlete` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_has_athlete` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_has_devices`
--

DROP TABLE IF EXISTS `client_has_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_has_devices` (
  `id_client_has_devices` int(11) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) DEFAULT NULL,
  `id_device` int(11) DEFAULT NULL,
  `registration_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_client_has_devices`),
  KEY `ix_client_has_devices_client_8` (`id_client`),
  KEY `ix_client_has_devices_device_9` (`id_device`),
  CONSTRAINT `fk_client_has_devices_client_8` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`),
  CONSTRAINT `fk_client_has_devices_device_9` FOREIGN KEY (`id_device`) REFERENCES `devices` (`id_device`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_devices`
--

LOCK TABLES `client_has_devices` WRITE;
/*!40000 ALTER TABLE `client_has_devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_has_devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id_client` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `last_check_date` varchar(255) DEFAULT NULL,
  `id_country` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_client`),
  KEY `ix_clients_country_5` (`id_country`),
  CONSTRAINT `fk_clients_country_5` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id_country`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configs`
--

DROP TABLE IF EXISTS `configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configs` (
  `id_config` bigint(20) NOT NULL AUTO_INCREMENT,
  `config_key` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_config`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configs`
--

LOCK TABLES `configs` WRITE;
/*!40000 ALTER TABLE `configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `countries` (
  `id_country` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `short_name` varchar(255) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `id_language` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_country`),
  KEY `ix_countries_language_10` (`id_language`),
  CONSTRAINT `fk_countries_language_10` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices` (
  `id_device` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_device`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_types`
--

DROP TABLE IF EXISTS `file_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `file_types` (
  `id_file_type` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_file_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_types`
--

LOCK TABLES `file_types` WRITE;
/*!40000 ALTER TABLE `file_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `file_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instances`
--

DROP TABLE IF EXISTS `instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `instances` (
  `id_instance` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `running` int(11) DEFAULT NULL,
  `test` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_instance`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instances`
--

LOCK TABLES `instances` WRITE;
/*!40000 ALTER TABLE `instances` DISABLE KEYS */;
/*!40000 ALTER TABLE `instances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `languages` (
  `id_language` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `short_name` varchar(255) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linked_account`
--

DROP TABLE IF EXISTS `linked_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `linked_account` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `provider_user_id` varchar(255) DEFAULT NULL,
  `provider_key` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_linked_account_user_11` (`user_id`),
  CONSTRAINT `fk_linked_account_user_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linked_account`
--

LOCK TABLES `linked_account` WRITE;
/*!40000 ALTER TABLE `linked_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `linked_account` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `play_evolutions`
--

LOCK TABLES `play_evolutions` WRITE;
/*!40000 ALTER TABLE `play_evolutions` DISABLE KEYS */;
INSERT INTO `play_evolutions` VALUES (1,'3300650034af9b999e03f462117116ecce441030','2015-02-03 14:21:33','create table athletes (\nid_athlete                integer auto_increment not null,\nname                      varchar(255),\ndefault_photo             varchar(255),\nconstraint pk_athletes primary key (id_athlete))\n;\n\ncreate table athlete_has_social_network (\nid_athlete_has_social_network integer auto_increment not null,\nid_theme                  integer,\nid_social_network         integer,\nlink                      varchar(255),\nconstraint pk_athlete_has_social_network primary key (id_athlete_has_social_network))\n;\n\ncreate table athlete_has_sports (\nid_athlete_has_category   integer auto_increment not null,\nid_sport                  integer,\nid_athlete                integer,\nconstraint pk_athlete_has_sports primary key (id_athlete_has_category))\n;\n\ncreate table clients (\nid_client                 integer auto_increment not null,\nuser_id                   varchar(255),\nstatus                    integer,\nlogin                     varchar(255),\npassword                  varchar(255),\nlast_check_date           varchar(255),\nid_country                integer,\nconstraint pk_clients primary key (id_client))\n;\n\ncreate table client_has_athlete (\nid_client_has_theme       integer auto_increment not null,\nid_client                 integer,\nid_athlete                integer,\nconstraint pk_client_has_athlete primary key (id_client_has_theme))\n;\n\ncreate table client_has_devices (\nid_client_has_devices     integer auto_increment not null,\nid_client                 integer,\nid_device                 integer,\nregistration_id           varchar(255),\nconstraint pk_client_has_devices primary key (id_client_has_devices))\n;\n\ncreate table configs (\nid_config                 bigint auto_increment not null,\nconfig_key                varchar(255),\nvalue                     varchar(255),\ndescription               varchar(255),\nconstraint pk_configs primary key (id_config))\n;\n\ncreate table countries (\nid_country                integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\nid_language               integer,\nconstraint pk_countries primary key (id_country))\n;\n\ncreate table devices (\nid_device                 integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_devices primary key (id_device))\n;\n\ncreate table file_types (\nid_file_type              integer auto_increment not null,\nname                      varchar(255),\nmime_type                 varchar(255),\nconstraint pk_file_types primary key (id_file_type))\n;\n\ncreate table instances (\nid_instance               integer auto_increment not null,\nip                        varchar(255),\nname                      varchar(255),\nrunning                   integer,\ntest                      integer,\nconstraint pk_instances primary key (id_instance))\n;\n\ncreate table languages (\nid_language               integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\nconstraint pk_languages primary key (id_language))\n;\n\ncreate table linked_account (\nid                        bigint auto_increment not null,\nuser_id                   bigint,\nprovider_user_id          varchar(255),\nprovider_key              varchar(255),\nconstraint pk_linked_account primary key (id))\n;\n\ncreate table post (\nid_post                   integer auto_increment not null,\nid_athlete                integer,\ndate                      varchar(255),\nsource                    varchar(255),\nid_social_network         integer,\npush                      integer,\npush_date                 bigint,\nconstraint pk_post primary key (id_post))\n;\n\ncreate table post_has_countries (\nid_post_has_country       integer auto_increment not null,\nid_post                   integer,\nid_country                integer,\nconstraint pk_post_has_countries primary key (id_post_has_country))\n;\n\ncreate table post_has_localizations (\nid_post_has_localization  integer auto_increment not null,\nid_post                   integer,\nid_language               integer,\ntitle                     varchar(255),\ncontent                   varchar(255),\nconstraint pk_post_has_localizations primary key (id_post_has_localization))\n;\n\ncreate table post_has_media (\nid_post_has_media         integer auto_increment not null,\nid_post                   integer,\nid_file_type              integer,\nmd5                       varchar(255),\nlink                      varchar(255),\nwidth                     integer,\nheight                    integer,\nconstraint pk_post_has_media primary key (id_post_has_media))\n;\n\ncreate table security_role (\nid                        bigint auto_increment not null,\nrole_name                 varchar(255),\nconstraint pk_security_role primary key (id))\n;\n\ncreate table social_networks (\nid_social_network         integer auto_increment not null,\nname                      varchar(255),\nhome                      varchar(255),\nconstraint pk_social_networks primary key (id_social_network))\n;\n\ncreate table sports (\nid_sport                  integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_sports primary key (id_sport))\n;\n\ncreate table token_action (\nid                        bigint auto_increment not null,\ntoken                     varchar(255),\ntarget_user_id            bigint,\ntype                      varchar(2),\ncreated                   datetime,\nexpires                   datetime,\nconstraint ck_token_action_type check (type in (\'EV\',\'PR\')),\nconstraint uq_token_action_token unique (token),\nconstraint pk_token_action primary key (id))\n;\n\ncreate table users (\nid                        bigint auto_increment not null,\nemail                     varchar(255),\nname                      varchar(255),\nfirst_name                varchar(255),\nlast_name                 varchar(255),\nlast_login                datetime,\nactive                    tinyint(1) default 0,\nemail_validated           tinyint(1) default 0,\nconstraint pk_users primary key (id))\n;\n\ncreate table user_permission (\nid                        bigint auto_increment not null,\nvalue                     varchar(255),\nconstraint pk_user_permission primary key (id))\n;\n\n\ncreate table users_security_role (\nusers_id                       bigint not null,\nsecurity_role_id               bigint not null,\nconstraint pk_users_security_role primary key (users_id, security_role_id))\n;\n\ncreate table users_user_permission (\nusers_id                       bigint not null,\nuser_permission_id             bigint not null,\nconstraint pk_users_user_permission primary key (users_id, user_permission_id))\n;\nalter table athlete_has_social_network add constraint fk_athlete_has_social_network_athlete_1 foreign key (id_theme) references athletes (id_athlete) on delete restrict on update restrict;\ncreate index ix_athlete_has_social_network_athlete_1 on athlete_has_social_network (id_theme);\nalter table athlete_has_social_network add constraint fk_athlete_has_social_network_socialNetwork_2 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;\ncreate index ix_athlete_has_social_network_socialNetwork_2 on athlete_has_social_network (id_social_network);\nalter table athlete_has_sports add constraint fk_athlete_has_sports_sport_3 foreign key (id_sport) references sports (id_sport) on delete restrict on update restrict;\ncreate index ix_athlete_has_sports_sport_3 on athlete_has_sports (id_sport);\nalter table athlete_has_sports add constraint fk_athlete_has_sports_athlete_4 foreign key (id_athlete) references athletes (id_athlete) on delete restrict on update restrict;\ncreate index ix_athlete_has_sports_athlete_4 on athlete_has_sports (id_athlete);\nalter table clients add constraint fk_clients_country_5 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;\ncreate index ix_clients_country_5 on clients (id_country);\nalter table client_has_athlete add constraint fk_client_has_athlete_client_6 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_athlete_client_6 on client_has_athlete (id_client);\nalter table client_has_athlete add constraint fk_client_has_athlete_athlete_7 foreign key (id_athlete) references athletes (id_athlete) on delete restrict on update restrict;\ncreate index ix_client_has_athlete_athlete_7 on client_has_athlete (id_athlete);\nalter table client_has_devices add constraint fk_client_has_devices_client_8 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_devices_client_8 on client_has_devices (id_client);\nalter table client_has_devices add constraint fk_client_has_devices_device_9 foreign key (id_device) references devices (id_device) on delete restrict on update restrict;\ncreate index ix_client_has_devices_device_9 on client_has_devices (id_device);\nalter table countries add constraint fk_countries_language_10 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_countries_language_10 on countries (id_language);\nalter table linked_account add constraint fk_linked_account_user_11 foreign key (user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_linked_account_user_11 on linked_account (user_id);\nalter table post add constraint fk_post_athlete_12 foreign key (id_athlete) references athletes (id_athlete) on delete restrict on update restrict;\ncreate index ix_post_athlete_12 on post (id_athlete);\nalter table post add constraint fk_post_socialNetwork_13 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;\ncreate index ix_post_socialNetwork_13 on post (id_social_network);\nalter table post_has_countries add constraint fk_post_has_countries_post_14 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_countries_post_14 on post_has_countries (id_post);\nalter table post_has_countries add constraint fk_post_has_countries_country_15 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;\ncreate index ix_post_has_countries_country_15 on post_has_countries (id_country);\nalter table post_has_localizations add constraint fk_post_has_localizations_post_16 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_localizations_post_16 on post_has_localizations (id_post);\nalter table post_has_localizations add constraint fk_post_has_localizations_language_17 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_post_has_localizations_language_17 on post_has_localizations (id_language);\nalter table post_has_media add constraint fk_post_has_media_post_18 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_media_post_18 on post_has_media (id_post);\nalter table post_has_media add constraint fk_post_has_media_fileType_19 foreign key (id_file_type) references file_types (id_file_type) on delete restrict on update restrict;\ncreate index ix_post_has_media_fileType_19 on post_has_media (id_file_type);\nalter table token_action add constraint fk_token_action_targetUser_20 foreign key (target_user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_token_action_targetUser_20 on token_action (target_user_id);\n\n\n\nalter table users_security_role add constraint fk_users_security_role_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_security_role add constraint fk_users_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;','SET FOREIGN_KEY_CHECKS=0;\n\ndrop table athletes;\n\ndrop table athlete_has_social_network;\n\ndrop table athlete_has_sports;\n\ndrop table clients;\n\ndrop table client_has_athlete;\n\ndrop table client_has_devices;\n\ndrop table configs;\n\ndrop table countries;\n\ndrop table devices;\n\ndrop table file_types;\n\ndrop table instances;\n\ndrop table languages;\n\ndrop table linked_account;\n\ndrop table post;\n\ndrop table post_has_countries;\n\ndrop table post_has_localizations;\n\ndrop table post_has_media;\n\ndrop table security_role;\n\ndrop table social_networks;\n\ndrop table sports;\n\ndrop table token_action;\n\ndrop table users;\n\ndrop table users_security_role;\n\ndrop table users_user_permission;\n\ndrop table user_permission;\n\nSET FOREIGN_KEY_CHECKS=1;','applied','');
/*!40000 ALTER TABLE `play_evolutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `id_post` int(11) NOT NULL AUTO_INCREMENT,
  `id_athlete` int(11) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `id_social_network` int(11) DEFAULT NULL,
  `push` int(11) DEFAULT NULL,
  `push_date` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id_post`),
  KEY `ix_post_athlete_12` (`id_athlete`),
  KEY `ix_post_socialNetwork_13` (`id_social_network`),
  CONSTRAINT `fk_post_athlete_12` FOREIGN KEY (`id_athlete`) REFERENCES `athletes` (`id_athlete`),
  CONSTRAINT `fk_post_socialNetwork_13` FOREIGN KEY (`id_social_network`) REFERENCES `social_networks` (`id_social_network`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_has_countries`
--

DROP TABLE IF EXISTS `post_has_countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_has_countries` (
  `id_post_has_country` int(11) NOT NULL AUTO_INCREMENT,
  `id_post` int(11) DEFAULT NULL,
  `id_country` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_post_has_country`),
  KEY `ix_post_has_countries_post_14` (`id_post`),
  KEY `ix_post_has_countries_country_15` (`id_country`),
  CONSTRAINT `fk_post_has_countries_country_15` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id_country`),
  CONSTRAINT `fk_post_has_countries_post_14` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_has_countries`
--

LOCK TABLES `post_has_countries` WRITE;
/*!40000 ALTER TABLE `post_has_countries` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_has_countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_has_localizations`
--

DROP TABLE IF EXISTS `post_has_localizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_has_localizations` (
  `id_post_has_localization` int(11) NOT NULL AUTO_INCREMENT,
  `id_post` int(11) DEFAULT NULL,
  `id_language` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_post_has_localization`),
  KEY `ix_post_has_localizations_post_16` (`id_post`),
  KEY `ix_post_has_localizations_language_17` (`id_language`),
  CONSTRAINT `fk_post_has_localizations_language_17` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id_language`),
  CONSTRAINT `fk_post_has_localizations_post_16` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_has_localizations`
--

LOCK TABLES `post_has_localizations` WRITE;
/*!40000 ALTER TABLE `post_has_localizations` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_has_localizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_has_media`
--

DROP TABLE IF EXISTS `post_has_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_has_media` (
  `id_post_has_media` int(11) NOT NULL AUTO_INCREMENT,
  `id_post` int(11) DEFAULT NULL,
  `id_file_type` int(11) DEFAULT NULL,
  `md5` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_post_has_media`),
  KEY `ix_post_has_media_post_18` (`id_post`),
  KEY `ix_post_has_media_fileType_19` (`id_file_type`),
  CONSTRAINT `fk_post_has_media_fileType_19` FOREIGN KEY (`id_file_type`) REFERENCES `file_types` (`id_file_type`),
  CONSTRAINT `fk_post_has_media_post_18` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_has_media`
--

LOCK TABLES `post_has_media` WRITE;
/*!40000 ALTER TABLE `post_has_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_has_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_role`
--

DROP TABLE IF EXISTS `security_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `security_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_role`
--

LOCK TABLES `security_role` WRITE;
/*!40000 ALTER TABLE `security_role` DISABLE KEYS */;
INSERT INTO `security_role` VALUES (1,'user');
/*!40000 ALTER TABLE `security_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social_networks`
--

DROP TABLE IF EXISTS `social_networks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `social_networks` (
  `id_social_network` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `home` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_social_network`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_networks`
--

LOCK TABLES `social_networks` WRITE;
/*!40000 ALTER TABLE `social_networks` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_networks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sports`
--

DROP TABLE IF EXISTS `sports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sports` (
  `id_sport` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_sport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sports`
--

LOCK TABLES `sports` WRITE;
/*!40000 ALTER TABLE `sports` DISABLE KEYS */;
/*!40000 ALTER TABLE `sports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_action`
--

DROP TABLE IF EXISTS `token_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `token_action` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) DEFAULT NULL,
  `target_user_id` bigint(20) DEFAULT NULL,
  `type` varchar(2) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_token_action_token` (`token`),
  KEY `ix_token_action_targetUser_20` (`target_user_id`),
  CONSTRAINT `fk_token_action_targetUser_20` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_action`
--

LOCK TABLES `token_action` WRITE;
/*!40000 ALTER TABLE `token_action` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permission`
--

DROP TABLE IF EXISTS `user_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permission`
--

LOCK TABLES `user_permission` WRITE;
/*!40000 ALTER TABLE `user_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT '0',
  `email_validated` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_security_role`
--

DROP TABLE IF EXISTS `users_security_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_security_role` (
  `users_id` bigint(20) NOT NULL,
  `security_role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`users_id`,`security_role_id`),
  KEY `fk_users_security_role_security_role_02` (`security_role_id`),
  CONSTRAINT `fk_users_security_role_security_role_02` FOREIGN KEY (`security_role_id`) REFERENCES `security_role` (`id`),
  CONSTRAINT `fk_users_security_role_users_01` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_security_role`
--

LOCK TABLES `users_security_role` WRITE;
/*!40000 ALTER TABLE `users_security_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_security_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_permission`
--

DROP TABLE IF EXISTS `users_user_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_user_permission` (
  `users_id` bigint(20) NOT NULL,
  `user_permission_id` bigint(20) NOT NULL,
  PRIMARY KEY (`users_id`,`user_permission_id`),
  KEY `fk_users_user_permission_user_permission_02` (`user_permission_id`),
  CONSTRAINT `fk_users_user_permission_user_permission_02` FOREIGN KEY (`user_permission_id`) REFERENCES `user_permission` (`id`),
  CONSTRAINT `fk_users_user_permission_users_01` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_permission`
--

LOCK TABLES `users_user_permission` WRITE;
/*!40000 ALTER TABLE `users_user_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_permission` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-02-03  9:39:01
