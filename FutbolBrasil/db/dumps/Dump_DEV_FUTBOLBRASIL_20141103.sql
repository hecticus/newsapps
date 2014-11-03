CREATE DATABASE  IF NOT EXISTS `futbolbrasil` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `futbolbrasil`;
-- MySQL dump 10.13  Distrib 5.6.13, for osx10.6 (i386)
--
-- Host: 10.0.3.2    Database: futbolbrasil
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
-- Table structure for table `client_bets`
--

DROP TABLE IF EXISTS `client_bets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_bets` (
  `id_client_bets` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) DEFAULT NULL,
  `id_tournament` int(11) DEFAULT NULL,
  `id_game_match` int(11) DEFAULT NULL,
  `client_bet` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_client_bets`),
  KEY `ix_client_bets_client_2` (`id_client`),
  CONSTRAINT `fk_client_bets_client_2` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_bets`
--

LOCK TABLES `client_bets` WRITE;
/*!40000 ALTER TABLE `client_bets` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_bets` ENABLE KEYS */;
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
  KEY `ix_client_has_devices_client_3` (`id_client`),
  KEY `ix_client_has_devices_device_4` (`id_device`),
  CONSTRAINT `fk_client_has_devices_client_3` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`),
  CONSTRAINT `fk_client_has_devices_device_4` FOREIGN KEY (`id_device`) REFERENCES `devices` (`id_device`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_devices`
--

LOCK TABLES `client_has_devices` WRITE;
/*!40000 ALTER TABLE `client_has_devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_has_devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_has_push_alerts`
--

DROP TABLE IF EXISTS `client_has_push_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_has_push_alerts` (
  `id_client_has_push_alert` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL,
  `id_push_alert` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_client_has_push_alert`),
  KEY `ix_client_has_push_alerts_client_5` (`id_client`),
  KEY `ix_client_has_push_alerts_pushAlert_6` (`id_push_alert`),
  CONSTRAINT `fk_client_has_push_alerts_client_5` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`),
  CONSTRAINT `fk_client_has_push_alerts_pushAlert_6` FOREIGN KEY (`id_push_alert`) REFERENCES `push_alerts` (`id_push_alert`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_push_alerts`
--

LOCK TABLES `client_has_push_alerts` WRITE;
/*!40000 ALTER TABLE `client_has_push_alerts` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_has_push_alerts` ENABLE KEYS */;
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
  KEY `ix_clients_country_1` (`id_country`),
  CONSTRAINT `fk_clients_country_1` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id_country`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configs`
--

LOCK TABLES `configs` WRITE;
/*!40000 ALTER TABLE `configs` DISABLE KEYS */;
INSERT INTO `configs` VALUES (1,'alarm-send-millis','300000','Tiempo entre envios en milisegundos'),(2,'alarm-smtp-server','smtp.gmail.com','Servidor SMTP'),(3,'alarm-sender-address','alarma.rk@hecticus.com','Direccion de email de las alarmas'),(4,'alarm-sender-pw','alarma12345','Password del email de las alarmas'),(5,'core-query-limit','5000','Tamano maximo del query utilizado en varios sitios'),(6,'config-read-millis','10000','Tiempo de refresh del estas variables de config'),(7,'support-level-1','inaki@hecticus.com ','Correos separados por ;'),(8,'app-name','FUTBOL','Pais o aplicacion de la instacia'),(9,'ftp-route','/Users/plesse/Documents/projects/newsapps/AGataDoDia/Pimp/ftp/','ftp'),(10,'attachments-route','/Users/plesse/Documents/projects/newsapps/AGataDoDia/Pimp/attachments/','attachments'),(11,'rackspace-username','hctcsproddfw','Usuario de rackspace '),(12,'rackspace-apiKey','276ef48143b9cd81d3bef7ad9fbe4e06','clave de rackspacew'),(13,'rackspace-provider','cloudfiles-us','Nombre del proveedor de rackspace'),(14,'rks-CDN-URL','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/','url base del contenedor de noticias'),(15,'cdn-container','pimp','contendor en el cdn'),(16,'free-days','7','dias gratis'),(17,'push-generators','0','consumidores para generar push'),(18,'pmc-app-id','4','id del app en el pmc'),(19,'server-ip-file','/Users/plesse/Documents/projects/Garotas/Pimp/pimp/server_ip','ip del sevidor'),(20,'pmc-url','revan:9001','host del pmc'),(21,'ws-timeout-millis','30000','timeout ws'),(22,'app-version','1','version del app'),(23,'upstreamServiceID','prototype-app -SubscriptionDefault','Service ID de Upstream para la app'),(24,'upstreamAppVersion','gamingapi.v1','Version del api de Upstream'),(25,'upstreamAppKey','DEcxvzx98533fdsagdsfiou','Key de la App de Upstream'),(26,'upstreamURL','http://127.0.0.1:9000/garotas/v1/clients/upstream','URL base de Upstream'),(27,'post-to-deliver','10','posts a entregarle a la app'),(28,'post-to-main','1','post para la pantalla principal'),(29,'default-language','300','idioma default para los posts'),(30,'id-hall-of-fame','11','id del hall de la fama'),(31,'jobs-keep-alive-allowed','3600000','Tiempo en milisegundos para determinar timeout del job. Default 3600000'),(32,'job-delay','10','delay de ejecucion de un job en segundos');
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
  KEY `ix_countries_language_7` (`id_language`),
  CONSTRAINT `fk_countries_language_7` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
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
  `master` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_instance`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instances`
--

LOCK TABLES `instances` WRITE;
/*!40000 ALTER TABLE `instances` DISABLE KEYS */;
INSERT INTO `instances` VALUES (1,'10.0.3.127','FUTBOL-10.0.3.127',1,0,1);
/*!40000 ALTER TABLE `instances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `status` int(11) DEFAULT NULL,
  `class_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `params` varchar(255) DEFAULT NULL,
  `id_app` int(11) DEFAULT NULL,
  `next_timestamp` bigint(20) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `time_params` varchar(255) DEFAULT NULL,
  `frequency` int(11) DEFAULT NULL,
  `daemon` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,1,'job.Leaderboardnator','Leaderboardnator-ONCE','{\"winner\":\"3\", \"loser\":\"0\"}',1,1415138598633,'1733',NULL,4,0),(2,0,'job.Leaderboardnator','Leaderboardnator-DAEMON','{\"winner\":\"3\", \"loser\":\"0\"}',1,1415026087000,'1733','10',4,1);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaderboard`
--

DROP TABLE IF EXISTS `leaderboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leaderboard` (
  `id_leaderboard` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) DEFAULT NULL,
  `id_tournament` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_leaderboard`),
  KEY `ix_leaderboard_client_8` (`id_client`),
  CONSTRAINT `fk_leaderboard_client_8` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaderboard`
--

LOCK TABLES `leaderboard` WRITE;
/*!40000 ALTER TABLE `leaderboard` DISABLE KEYS */;
/*!40000 ALTER TABLE `leaderboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaderboard_global`
--

DROP TABLE IF EXISTS `leaderboard_global`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leaderboard_global` (
  `id_leaderboard_global` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_leaderboard_global`),
  KEY `ix_leaderboard_global_client_9` (`id_client`),
  CONSTRAINT `fk_leaderboard_global_client_9` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaderboard_global`
--

LOCK TABLES `leaderboard_global` WRITE;
/*!40000 ALTER TABLE `leaderboard_global` DISABLE KEYS */;
/*!40000 ALTER TABLE `leaderboard_global` ENABLE KEYS */;
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
  KEY `ix_linked_account_user_10` (`user_id`),
  CONSTRAINT `fk_linked_account_user_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linked_account`
--

LOCK TABLES `linked_account` WRITE;
/*!40000 ALTER TABLE `linked_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `linked_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `head_line` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `xml` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_resource`
--

DROP TABLE IF EXISTS `news_resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news_resource` (
  `news_id` bigint(20) NOT NULL,
  `resource_id` bigint(20) NOT NULL,
  PRIMARY KEY (`news_id`,`resource_id`),
  KEY `fk_news_resource_resource_02` (`resource_id`),
  CONSTRAINT `fk_news_resource_resource_02` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`),
  CONSTRAINT `fk_news_resource_news_01` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_resource`
--

LOCK TABLES `news_resource` WRITE;
/*!40000 ALTER TABLE `news_resource` DISABLE KEYS */;
/*!40000 ALTER TABLE `news_resource` ENABLE KEYS */;
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
INSERT INTO `play_evolutions` VALUES (1,'291d2217ace469a548ae01d52c044d89c7ade1f3','2014-10-31 21:49:07','create table clients (\nid_client                 integer auto_increment not null,\nuser_id                   varchar(255),\nstatus                    integer,\nlogin                     varchar(255),\npassword                  varchar(255),\nlast_check_date           varchar(255),\nid_country                integer,\nconstraint pk_clients primary key (id_client))\n;\n\ncreate table client_bets (\nid_client_bets            bigint auto_increment not null,\nid_client                 integer,\nid_tournament             integer,\nid_game_match             integer,\nclient_bet                integer,\nstatus                    integer,\nconstraint pk_client_bets primary key (id_client_bets))\n;\n\ncreate table client_has_devices (\nid_client_has_devices     integer auto_increment not null,\nid_client                 integer,\nid_device                 integer,\nregistration_id           varchar(255),\nconstraint pk_client_has_devices primary key (id_client_has_devices))\n;\n\ncreate table client_has_push_alerts (\nid_client_has_push_alert  integer auto_increment not null,\nname                      varchar(255),\nid_client                 integer,\nid_push_alert             integer,\nconstraint pk_client_has_push_alerts primary key (id_client_has_push_alert))\n;\n\ncreate table configs (\nid_config                 bigint auto_increment not null,\nconfig_key                varchar(255),\nvalue                     varchar(255),\ndescription               varchar(255),\nconstraint pk_configs primary key (id_config))\n;\n\ncreate table countries (\nid_country                integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\nid_language               integer,\nconstraint pk_countries primary key (id_country))\n;\n\ncreate table devices (\nid_device                 integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_devices primary key (id_device))\n;\n\ncreate table instances (\nid_instance               integer auto_increment not null,\nip                        varchar(255),\nname                      varchar(255),\nrunning                   integer,\ntest                      integer,\nmaster                    tinyint(1) default 0,\nconstraint pk_instances primary key (id_instance))\n;\n\ncreate table jobs (\nid                        bigint auto_increment not null,\nstatus                    integer,\nclass_name                varchar(255),\nname                      varchar(255),\nparams                    varchar(255),\nid_app                    integer,\nnext_timestamp            bigint,\ntime                      varchar(255),\ntime_params               varchar(255),\nfrequency                 integer,\ndaemon                    tinyint(1) default 0,\nconstraint pk_jobs primary key (id))\n;\n\ncreate table languages (\nid_language               integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\nconstraint pk_languages primary key (id_language))\n;\n\ncreate table leaderboard (\nid_leaderboard            bigint auto_increment not null,\nid_client                 integer,\nid_tournament             integer,\nscore                     integer,\nconstraint pk_leaderboard primary key (id_leaderboard))\n;\n\ncreate table leaderboard_global (\nid_leaderboard_global     bigint auto_increment not null,\nid_client                 integer,\nscore                     integer,\nconstraint pk_leaderboard_global primary key (id_leaderboard_global))\n;\n\ncreate table linked_account (\nid                        bigint auto_increment not null,\nuser_id                   bigint,\nprovider_user_id          varchar(255),\nprovider_key              varchar(255),\nconstraint pk_linked_account primary key (id))\n;\n\ncreate table news (\nid                        bigint auto_increment not null,\nhead_line                 varchar(255),\nsummary                   varchar(255),\nxml                       varchar(255),\ndate                      varchar(255),\nsort                      integer,\nconstraint pk_news primary key (id))\n;\n\ncreate table push_alerts (\nid_push_alert             integer auto_increment not null,\nname                      varchar(255),\nid_ext                    integer,\npushable                  tinyint(1) default 0,\nconstraint pk_push_alerts primary key (id_push_alert))\n;\n\ncreate table resource (\nid                        bigint auto_increment not null,\nurl                       varchar(255),\ntags                      varchar(255),\nmeta_data                 varchar(255),\ndate                      varchar(255),\nconstraint pk_resource primary key (id))\n;\n\ncreate table security_role (\nid                        bigint auto_increment not null,\nrole_name                 varchar(255),\nconstraint pk_security_role primary key (id))\n;\n\ncreate table token_action (\nid                        bigint auto_increment not null,\ntoken                     varchar(255),\ntarget_user_id            bigint,\ntype                      varchar(2),\ncreated                   datetime,\nexpires                   datetime,\nconstraint ck_token_action_type check (type in (\'EV\',\'PR\')),\nconstraint uq_token_action_token unique (token),\nconstraint pk_token_action primary key (id))\n;\n\ncreate table users (\nid                        bigint auto_increment not null,\nemail                     varchar(255),\nname                      varchar(255),\nfirst_name                varchar(255),\nlast_name                 varchar(255),\nlast_login                datetime,\nactive                    tinyint(1) default 0,\nemail_validated           tinyint(1) default 0,\nconstraint pk_users primary key (id))\n;\n\ncreate table user_permission (\nid                        bigint auto_increment not null,\nvalue                     varchar(255),\nconstraint pk_user_permission primary key (id))\n;\n\n\ncreate table news_resource (\nnews_id                        bigint not null,\nresource_id                    bigint not null,\nconstraint pk_news_resource primary key (news_id, resource_id))\n;\n\ncreate table users_security_role (\nusers_id                       bigint not null,\nsecurity_role_id               bigint not null,\nconstraint pk_users_security_role primary key (users_id, security_role_id))\n;\n\ncreate table users_user_permission (\nusers_id                       bigint not null,\nuser_permission_id             bigint not null,\nconstraint pk_users_user_permission primary key (users_id, user_permission_id))\n;\nalter table clients add constraint fk_clients_country_1 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;\ncreate index ix_clients_country_1 on clients (id_country);\nalter table client_bets add constraint fk_client_bets_client_2 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_bets_client_2 on client_bets (id_client);\nalter table client_has_devices add constraint fk_client_has_devices_client_3 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_devices_client_3 on client_has_devices (id_client);\nalter table client_has_devices add constraint fk_client_has_devices_device_4 foreign key (id_device) references devices (id_device) on delete restrict on update restrict;\ncreate index ix_client_has_devices_device_4 on client_has_devices (id_device);\nalter table client_has_push_alerts add constraint fk_client_has_push_alerts_client_5 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_push_alerts_client_5 on client_has_push_alerts (id_client);\nalter table client_has_push_alerts add constraint fk_client_has_push_alerts_pushAlert_6 foreign key (id_push_alert) references push_alerts (id_push_alert) on delete restrict on update restrict;\ncreate index ix_client_has_push_alerts_pushAlert_6 on client_has_push_alerts (id_push_alert);\nalter table countries add constraint fk_countries_language_7 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_countries_language_7 on countries (id_language);\nalter table leaderboard add constraint fk_leaderboard_client_8 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_leaderboard_client_8 on leaderboard (id_client);\nalter table leaderboard_global add constraint fk_leaderboard_global_client_9 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_leaderboard_global_client_9 on leaderboard_global (id_client);\nalter table linked_account add constraint fk_linked_account_user_10 foreign key (user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_linked_account_user_10 on linked_account (user_id);\nalter table token_action add constraint fk_token_action_targetUser_11 foreign key (target_user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_token_action_targetUser_11 on token_action (target_user_id);\n\n\n\nalter table news_resource add constraint fk_news_resource_news_01 foreign key (news_id) references news (id) on delete restrict on update restrict;\n\nalter table news_resource add constraint fk_news_resource_resource_02 foreign key (resource_id) references resource (id) on delete restrict on update restrict;\n\nalter table users_security_role add constraint fk_users_security_role_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_security_role add constraint fk_users_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;','SET FOREIGN_KEY_CHECKS=0;\n\ndrop table clients;\n\ndrop table client_bets;\n\ndrop table client_has_devices;\n\ndrop table client_has_push_alerts;\n\ndrop table configs;\n\ndrop table countries;\n\ndrop table devices;\n\ndrop table instances;\n\ndrop table jobs;\n\ndrop table languages;\n\ndrop table leaderboard;\n\ndrop table leaderboard_global;\n\ndrop table linked_account;\n\ndrop table news;\n\ndrop table news_resource;\n\ndrop table push_alerts;\n\ndrop table resource;\n\ndrop table security_role;\n\ndrop table token_action;\n\ndrop table users;\n\ndrop table users_security_role;\n\ndrop table users_user_permission;\n\ndrop table user_permission;\n\nSET FOREIGN_KEY_CHECKS=1;','applied','');
/*!40000 ALTER TABLE `play_evolutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `push_alerts`
--

DROP TABLE IF EXISTS `push_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `push_alerts` (
  `id_push_alert` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `id_ext` int(11) DEFAULT NULL,
  `pushable` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_push_alert`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `push_alerts`
--

LOCK TABLES `push_alerts` WRITE;
/*!40000 ALTER TABLE `push_alerts` DISABLE KEYS */;
/*!40000 ALTER TABLE `push_alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource`
--

DROP TABLE IF EXISTS `resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resource` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `meta_data` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource`
--

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
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
  KEY `ix_token_action_targetUser_11` (`target_user_id`),
  CONSTRAINT `fk_token_action_targetUser_11` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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

-- Dump completed on 2014-11-03 11:26:31
