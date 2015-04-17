CREATE DATABASE  IF NOT EXISTS `extreme_sports` /*!40100 DEFAULT CHARACTER SET latin1 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `athlete_has_social_network`
--

LOCK TABLES `athlete_has_social_network` WRITE;
/*!40000 ALTER TABLE `athlete_has_social_network` DISABLE KEYS */;
/*!40000 ALTER TABLE `athlete_has_social_network` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `athletes`
--

LOCK TABLES `athletes` WRITE;
/*!40000 ALTER TABLE `athletes` DISABLE KEYS */;
/*!40000 ALTER TABLE `athletes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id_category` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `followable` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_has_localizations`
--

DROP TABLE IF EXISTS `category_has_localizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category_has_localizations` (
  `id_category_has_localization` int(11) NOT NULL AUTO_INCREMENT,
  `id_category` int(11) DEFAULT NULL,
  `id_language` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_category_has_localization`),
  KEY `ix_category_has_localizations_category_3` (`id_category`),
  KEY `ix_category_has_localizations_language_4` (`id_language`),
  CONSTRAINT `fk_category_has_localizations_category_3` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`),
  CONSTRAINT `fk_category_has_localizations_language_4` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_has_localizations`
--

LOCK TABLES `category_has_localizations` WRITE;
/*!40000 ALTER TABLE `category_has_localizations` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_has_localizations` ENABLE KEYS */;
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
  KEY `ix_client_has_athlete_client_7` (`id_client`),
  KEY `ix_client_has_athlete_athlete_8` (`id_athlete`),
  CONSTRAINT `fk_client_has_athlete_athlete_8` FOREIGN KEY (`id_athlete`) REFERENCES `athletes` (`id_athlete`),
  CONSTRAINT `fk_client_has_athlete_client_7` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_athlete`
--

LOCK TABLES `client_has_athlete` WRITE;
/*!40000 ALTER TABLE `client_has_athlete` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_has_athlete` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_has_category`
--

DROP TABLE IF EXISTS `client_has_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_has_category` (
  `id_client_has_category` int(11) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) DEFAULT NULL,
  `id_category` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_client_has_category`),
  KEY `ix_client_has_category_client_9` (`id_client`),
  KEY `ix_client_has_category_category_10` (`id_category`),
  CONSTRAINT `fk_client_has_category_category_10` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`),
  CONSTRAINT `fk_client_has_category_client_9` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_category`
--

LOCK TABLES `client_has_category` WRITE;
/*!40000 ALTER TABLE `client_has_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_has_category` ENABLE KEYS */;
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
  KEY `ix_client_has_devices_client_11` (`id_client`),
  KEY `ix_client_has_devices_device_12` (`id_device`),
  CONSTRAINT `fk_client_has_devices_client_11` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`),
  CONSTRAINT `fk_client_has_devices_device_12` FOREIGN KEY (`id_device`) REFERENCES `devices` (`id_device`)
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
  `nickname` varchar(255) DEFAULT NULL,
  `facebook_id` varchar(255) DEFAULT NULL,
  `session` varchar(255) DEFAULT NULL,
  `id_country` int(11) DEFAULT NULL,
  `id_language` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_client`),
  KEY `ix_clients_country_5` (`id_country`),
  KEY `ix_clients_language_6` (`id_language`),
  CONSTRAINT `fk_clients_country_5` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id_country`),
  CONSTRAINT `fk_clients_language_6` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id_language`)
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configs`
--

LOCK TABLES `configs` WRITE;
/*!40000 ALTER TABLE `configs` DISABLE KEYS */;
INSERT INTO `configs` VALUES (1,'alarm-send-millis','300000','Tiempo entre envios en milisegundos'),(2,'alarm-smtp-server','smtp.gmail.com','Servidor SMTP'),(3,'alarm-sender-address','alarma.rk@hecticus.com','Direccion de email de las alarmas'),(4,'alarm-sender-pw','alarma12345','Password del email de las alarmas'),(5,'core-query-limit','5000','Tamano maximo del query utilizado en varios sitios'),(6,'config-read-millis','10000','Tiempo de refresh del estas variables de config'),(7,'support-level-1','inaki@hecticus.com','Correos separados por ;'),(8,'app-name','Extreme-Sports-inaki','Pais o aplicacion de la instacia'),(9,'ftp-route','/Users/plesse/Documents/contents/ftp/','ftp'),(10,'attachments-route','/Users/plesse/Documents/contents/attachments/','attachments'),(11,'rackspace-username','hctcsproddfw','Usuario de rackspace '),(12,'rackspace-apiKey','276ef48143b9cd81d3bef7ad9fbe4e06','clave de rackspacew'),(13,'rackspace-provider','cloudfiles-us','Nombre del proveedor de rackspace'),(14,'rks-CDN-URL','http://8e07340656481b938651-c833a43ab7cf8ecfc6cec7e37d31d18e.r22.cf1.rackcdn.com/','url base del contenedor de noticias'),(15,'cdn-container','extreme_sports','contendor en el cdn'),(16,'free-days','7','dias gratis'),(17,'push-generators','0','consumidores para generar push'),(18,'pmc-app-id','4','id del app en el pmc'),(19,'server-ip-file','/Users/plesse/Documents/projects/PMC/server_ip','ip del sevidor'),(20,'pmc-url','revan:9001','host del pmc'),(21,'ws-timeout-millis','30000','timeout ws'),(22,'app-version','1','version del app'),(23,'upstreamServiceID','vodafone-romania-quizit-app - SubscriptionDefault3','Service ID de Upstream para la app'),(24,'upstreamAppVersion','gamingapi.v1','Version del api de Upstream'),(25,'upstreamAppKey','hecticus','Key de la App de Upstream'),(26,'upstreamURL','http://revan:9000/api/v1/clients/upstream','URL base de Upstream'),(27,'post-to-deliver','2','posts a entregarle a la app'),(28,'post-to-main','1','post para la pantalla principal'),(29,'default-language','405','idioma default para los posts'),(30,'id-hall-of-fame','7','id del hall de la fama'),(34,'company-name','1234',NULL),(35,'build-version','9',NULL),(36,'server-version','1',NULL),(37,'jobs-keep-alive-allowed','3600000',NULL),(38,'job-delay','10','tiempo de delays para los job'),(39,'wistia-upload-url','https://upload.wistia.com/',NULL),(40,'wistia-api-password','5a50e7320c30ea66df8278bbed08013aa0ec5793808a628535cfe01fc90902b7',NULL),(41,'wistia-api-project-id','7dfye8l7st',NULL),(42,'wistia-url','https://api.wistia.com/v1/',NULL),(43,'android-version','1.0.0','vrsion de android'),(44,'android-version-url','com.hecticus.uPixelAndroid','url de la version de android'),(45,'ios-version','0.0.1','version de ios'),(46,'ios-version-url','http://ios.url','url de la version de ios'),(47,'locales-path','/Users/plesse/Documents/contents/football_brazil/futbolbrasiltranslationsparapruebas/','path para los archivos de localiacion'),(48,'upstreamGuestUser','guesth','Usuario guest para las interacciones Upstream'),(49,'upstreamGuestPassword','guesth','Password guest para las interacciones Upstream'),(50,'upstreamUserID','100','User ID guest para las interacciones Upstream'),(51,'max-near-events','10','cantidad maxima de eventos cercanos a listar'),(52,'max-distance-events','100','distancia maxima de eventos a listar');
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
  KEY `ix_countries_language_13` (`id_language`),
  CONSTRAINT `fk_countries_language_13` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id_language`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'Venezuela','ve',1,300),(2,'USA','us',1,285),(3,'Brazil','br',1,405);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,'droid'),(2,'ios');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id_event` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_event`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_types`
--

LOCK TABLES `file_types` WRITE;
/*!40000 ALTER TABLE `file_types` DISABLE KEYS */;
INSERT INTO `file_types` VALUES (1,'image','image/jpeg'),(2,'audio','application/octet-stream'),(3,'image','image/png'),(4,'video','video/mp4');
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
  `master` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_instance`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instances`
--

LOCK TABLES `instances` WRITE;
/*!40000 ALTER TABLE `instances` DISABLE KEYS */;
INSERT INTO `instances` VALUES (1,'10.0.3.127','Extreme-Sports-inaki-10.0.3.127',1,0,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,0,'backend.job.PushGenerator','Test','{}',1,1427223645485,'1430','20150324',0,0);
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
  `app_localization_file` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_language`)
) ENGINE=InnoDB AUTO_INCREMENT=479 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (241,'Afrikaans (South Africa)','af-ZA',0,NULL),(242,'Arabic','ar',0,NULL),(243,'Arabic (U.A.E.)','ar-AE',0,NULL),(244,'Arabic (Bahrain)','ar-BH',0,NULL),(245,'Arabic (Algeria)','ar-DZ',0,NULL),(246,'Arabic (Egypt)','ar-EG',0,NULL),(247,'Arabic (Iraq)','ar-IQ',0,NULL),(248,'Arabic (Jordan)','ar-JO',0,NULL),(249,'Arabic (Kuwait)','ar-KW',0,NULL),(250,'Arabic (Lebanon)','ar-LB',0,NULL),(251,'Arabic (Libya)','ar-LY',0,NULL),(252,'Arabic (Morocco)','ar-MA',0,NULL),(253,'Arabic (Oman)','ar-OM',0,NULL),(254,'Arabic (Qatar)','ar-QA',0,NULL),(255,'Arabic (Saudi Arabia)','ar-SA',0,NULL),(256,'Arabic (Syria)','ar-SY',0,NULL),(257,'Arabic (Tunisia)','ar-TN',0,NULL),(258,'Arabic (Yemen)','ar-YE',0,NULL),(259,'Azeri (Latin)','az',0,NULL),(260,'Azeri (Azerbaijan)','az-AZ',0,NULL),(262,'Belarusian','be',0,NULL),(263,'Belarusian (Belarus)','be-BY',0,NULL),(264,'Bulgarian','bg',0,NULL),(265,'Bulgarian (Bulgaria)','bg-BG',0,NULL),(266,'Bosnian (Bosnia and Herzegovina)','bs-BA',0,NULL),(267,'Catalan','ca',0,NULL),(268,'Catalan (Spain)','ca-ES',0,NULL),(269,'Czech','cs',0,NULL),(270,'Czech (Czech Republic)','cs-CZ',0,NULL),(271,'Welsh','cy',0,NULL),(272,'Welsh (United Kingdom)','cy-GB',0,NULL),(273,'Danish','da',0,NULL),(274,'Danish (Denmark)','da-DK',0,NULL),(275,'German','de',0,NULL),(276,'German (Austria)','de-AT',0,NULL),(277,'German (Switzerland)','de-CH',0,NULL),(278,'German (Germany)','de-DE',0,NULL),(279,'German (Liechtenstein)','de-LI',0,NULL),(280,'German (Luxembourg)','de-LU',0,NULL),(281,'Divehi','dv',0,NULL),(282,'Divehi (Maldives)','dv-MV',0,NULL),(283,'Greek','el',0,NULL),(284,'Greek (Greece)','el-GR',0,NULL),(285,'English','en',1,NULL),(286,'English (Australia)','en-AU',0,NULL),(287,'English (Belize)','en-BZ',0,NULL),(288,'English (Canada)','en-CA',0,NULL),(289,'English (Caribbean)','en-CB',0,NULL),(290,'English (United Kingdom)','en-GB',0,NULL),(291,'English (Ireland)','en-IE',0,NULL),(292,'English (Jamaica)','en-JM',0,NULL),(293,'English (New Zealand)','en-NZ',0,NULL),(294,'English (Republic of the Philippines)','en-PH',0,NULL),(295,'English (Trinidad and Tobago)','en-TT',0,NULL),(296,'English (United States)','en-US',0,NULL),(297,'English (South Africa)','en-ZA',0,NULL),(298,'English (Zimbabwe)','en-ZW',0,NULL),(299,'Esperanto','eo',0,NULL),(300,'Spanish','es',1,NULL),(301,'Spanish (Argentina)','es-AR',0,NULL),(302,'Spanish (Bolivia)','es-BO',0,NULL),(303,'Spanish (Chile)','es-CL',0,NULL),(304,'Spanish (Colombia)','es-CO',0,NULL),(305,'Spanish (Costa Rica)','es-CR',0,NULL),(306,'Spanish (Dominican Republic)','es-DO',0,NULL),(307,'Spanish (Ecuador)','es-EC',0,NULL),(308,'Spanish (Castilian-Spain)','es-ES',0,NULL),(310,'Spanish (Guatemala)','es-GT',0,NULL),(311,'Spanish (Honduras)','es-HN',0,NULL),(312,'Spanish (Mexico)','es-MX',0,NULL),(313,'Spanish (Nicaragua)','es-NI',0,NULL),(314,'Spanish (Panama)','es-PA',0,NULL),(315,'Spanish (Peru)','es-PE',0,NULL),(316,'Spanish (Puerto Rico)','es-PR',0,NULL),(317,'Spanish (Paraguay)','es-PY',0,NULL),(318,'Spanish (El Salvador)','es-SV',0,NULL),(319,'Spanish (Uruguay)','es-UY',0,NULL),(320,'Spanish (Venezuela)','es-VE',0,NULL),(321,'Estonian','et',0,NULL),(322,'Estonian (Estonia)','et-EE',0,NULL),(323,'Basque','eu',0,NULL),(324,'Basque (Spain)','eu-ES',0,NULL),(325,'Farsi','fa',0,NULL),(326,'Farsi (Iran)','fa-IR',0,NULL),(327,'Finnish','fi',0,NULL),(328,'Finnish (Finland)','fi-FI',0,NULL),(329,'Faroese','fo',0,NULL),(330,'Faroese (Faroe Islands)','fo-FO',0,NULL),(331,'French','fr',0,NULL),(332,'French (Belgium)','fr-BE',0,NULL),(333,'French (Canada)','fr-CA',0,NULL),(334,'French (Switzerland)','fr-CH',0,NULL),(335,'French (France)','fr-FR',0,NULL),(336,'French (Luxembourg)','fr-LU',0,NULL),(337,'French (Principality of Monaco)','fr-MC',0,NULL),(338,'Galician','gl',0,NULL),(339,'Galician (Spain)','gl-ES',0,NULL),(340,'Gujarati','gu',0,NULL),(341,'Gujarati (India)','gu-IN',0,NULL),(342,'Hebrew','he',0,NULL),(343,'Hebrew (Israel)','he-IL',0,NULL),(344,'Hindi','hi',0,NULL),(345,'Hindi (India)','hi-IN',0,NULL),(346,'Croatian','hr',0,NULL),(347,'Croatian (Bosnia and Herzegovina)','hr-BA',0,NULL),(348,'Croatian (Croatia)','hr-HR',0,NULL),(349,'Hungarian','hu',0,NULL),(350,'Hungarian (Hungary)','hu-HU',0,NULL),(351,'Armenian','hy',0,NULL),(352,'Armenian (Armenia)','hy-AM',0,NULL),(353,'Indonesian','id',0,NULL),(354,'Indonesian (Indonesia)','id-ID',0,NULL),(355,'Icelandic','is',0,NULL),(356,'Icelandic (Iceland)','is-IS',0,NULL),(357,'Italian','it',0,NULL),(358,'Italian (Switzerland)','it-CH',0,NULL),(359,'Italian (Italy)','it-IT',0,NULL),(360,'Japanese','ja',0,NULL),(361,'Japanese (Japan)','ja-JP',0,NULL),(362,'Georgian','ka',0,NULL),(363,'Georgian (Georgia)','ka-GE',0,NULL),(364,'Kazakh','kk',0,NULL),(365,'Kazakh (Kazakhstan)','kk-KZ',0,NULL),(366,'Kannada','kn',0,NULL),(367,'Kannada (India)','kn-IN',0,NULL),(368,'Korean','ko',0,NULL),(369,'Korean (Korea)','ko-KR',0,NULL),(370,'Konkani','kok',0,NULL),(371,'Konkani (India)','kok-IN',0,NULL),(372,'Kyrgyz','ky',0,NULL),(373,'Kyrgyz (Kyrgyzstan)','ky-KG',0,NULL),(374,'Lithuanian','lt',0,NULL),(375,'Lithuanian (Lithuania)','lt-LT',0,NULL),(376,'Latvian','lv',0,NULL),(377,'Latvian (Latvia)','lv-LV',0,NULL),(378,'Maori','mi',0,NULL),(379,'Maori (New Zealand)','mi-NZ',0,NULL),(380,'FYRO Macedonian','mk',0,NULL),(381,'FYRO Macedonian (Former Republic of Macedonia)','mk-MK',0,NULL),(382,'Mongolian','mn',0,NULL),(383,'Mongolian (Mongolia)','mn-MN',0,NULL),(384,'Marathi','mr',0,NULL),(385,'Marathi (India)','mr-IN',0,NULL),(386,'Malay','ms',0,NULL),(387,'Malay (Brunei Darussalam)','ms-BN',0,NULL),(388,'Malay (Malaysia)','ms-MY',0,NULL),(389,'Maltese','mt',0,NULL),(390,'Maltese (Malta)','mt-MT',0,NULL),(391,'Norwegian (Bokm?l)','nb',0,NULL),(392,'Norwegian (Bokm?l) (Norway)','nb-NO',0,NULL),(393,'Dutch','nl',0,NULL),(394,'Dutch (Belgium)','nl-BE',0,NULL),(395,'Dutch (Netherlands)','nl-NL',0,NULL),(396,'Norwegian (Nynorsk) (Norway)','nn-NO',0,NULL),(397,'Northern Sotho','ns',0,NULL),(398,'Northern Sotho (South Africa)','ns-ZA',0,NULL),(399,'Punjabi','pa',0,NULL),(400,'Punjabi (India)','pa-IN',0,NULL),(401,'Polish','pl',0,NULL),(402,'Polish (Poland)','pl-PL',0,NULL),(403,'Pashto','ps',0,NULL),(404,'Pashto (Afghanistan)','ps-AR',0,NULL),(405,'Portuguese','pt',1,NULL),(406,'Portuguese (Brazil)','pt-BR',0,NULL),(407,'Portuguese (Portugal)','pt-PT',0,NULL),(408,'Quechua','qu',0,NULL),(409,'Quechua (Bolivia)','qu-BO',0,NULL),(410,'Quechua (Ecuador)','qu-EC',0,NULL),(411,'Quechua (Peru)','qu-PE',0,NULL),(412,'Romanian','ro',0,NULL),(413,'Romanian (Romania)','ro-RO',0,NULL),(414,'Russian','ru',0,NULL),(415,'Russian (Russia)','ru-RU',0,NULL),(416,'Sanskrit','sa',0,NULL),(417,'Sanskrit (India)','sa-IN',0,NULL),(418,'Sami (Northern)','se',0,NULL),(419,'Sami (Finland)','se-FI',0,NULL),(422,'Sami (Norway)','se-NO',0,NULL),(425,'Sami (Sweden)','se-SE',0,NULL),(428,'Slovak','sk',0,NULL),(429,'Slovak (Slovakia)','sk-SK',0,NULL),(430,'Slovenian','sl',0,NULL),(431,'Slovenian (Slovenia)','sl-SI',0,NULL),(432,'Albanian','sq',0,NULL),(433,'Albanian (Albania)','sq-AL',0,NULL),(434,'Serbian (Bosnia and Herzegovina)','sr-BA',0,NULL),(436,'Serbian  (Serbia and Montenegro)','sr-SP',0,NULL),(438,'Swedish','sv',0,NULL),(439,'Swedish (Finland)','sv-FI',0,NULL),(440,'Swedish (Sweden)','sv-SE',0,NULL),(441,'Swahili','sw',0,NULL),(442,'Swahili (Kenya)','sw-KE',0,NULL),(443,'Syriac','syr',0,NULL),(444,'Syriac (Syria)','syr-SY',0,NULL),(445,'Tamil','ta',0,NULL),(446,'Tamil (India)','ta-IN',0,NULL),(447,'Telugu','te',0,NULL),(448,'Telugu (India)','te-IN',0,NULL),(449,'Thai','th',0,NULL),(450,'Thai (Thailand)','th-TH',0,NULL),(451,'Tagalog','tl',0,NULL),(452,'Tagalog (Philippines)','tl-PH',0,NULL),(453,'Tswana','tn',0,NULL),(454,'Tswana (South Africa)','tn-ZA',0,NULL),(455,'Turkish','tr',0,NULL),(456,'Turkish (Turkey)','tr-TR',0,NULL),(457,'Tatar','tt',0,NULL),(458,'Tatar (Russia)','tt-RU',0,NULL),(459,'Tsonga','ts',0,NULL),(460,'Ukrainian','uk',0,NULL),(461,'Ukrainian (Ukraine)','uk-UA',0,NULL),(462,'Urdu','ur',0,NULL),(463,'Urdu (Islamic Republic of Pakistan)','ur-PK',0,NULL),(464,'Uzbek (Latin)','uz',0,NULL),(465,'Uzbek (Uzbekistan)','uz-UZ',0,NULL),(467,'Vietnamese','vi',0,NULL),(468,'Vietnamese (Viet Nam)','vi-VN',0,NULL),(469,'Xhosa','xh',0,NULL),(470,'Xhosa (South Africa)','xh-ZA',0,NULL),(471,'Chinese','zh',0,NULL),(472,'Chinese (S)','zh-CN',0,NULL),(473,'Chinese (Hong Kong)','zh-HK',0,NULL),(474,'Chinese (Macau)','zh-MO',0,NULL),(475,'Chinese (Singapore)','zh-SG',0,NULL),(476,'Chinese (T)','zh-TW',0,NULL),(477,'Zulu','zu',0,NULL),(478,'Zulu (South Africa)','zu-ZA',0,NULL);
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
  KEY `ix_linked_account_user_14` (`user_id`),
  CONSTRAINT `fk_linked_account_user_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linked_account`
--

LOCK TABLES `linked_account` WRITE;
/*!40000 ALTER TABLE `linked_account` DISABLE KEYS */;
INSERT INTO `linked_account` VALUES (1,1,'$2a$10$r/cKXZGSVzViLzQgZHFg0Oo0tMCUUpiMkVxVBUxgOt.IqVlBBkQAC','password'),(2,2,'$2a$10$oSM31J4qX/n4DKpxkPP2yO1OHBb/UewgK.41OveovxPEtajCjNtdy','password'),(3,3,'$2a$10$MmGn9/Jjr6UFqgqOCp6EVernDoo8l9ylR21ScXk5bxdCmuavxibmm','password'),(4,4,'$2a$10$Hc/S8sIU764PlpfuVWyX3eDNdTjE58oGILWPGmN9fA2ACeitOZVP6','password'),(5,5,'$2a$10$bqFsadoJ73jjwkRDpPnE5ODwxm.Gy3t00xH30IRo1viz/6vVCVg9e','password');
/*!40000 ALTER TABLE `linked_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id_location` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_location`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `play_evolutions`
--

LOCK TABLES `play_evolutions` WRITE;
/*!40000 ALTER TABLE `play_evolutions` DISABLE KEYS */;
INSERT INTO `play_evolutions` VALUES (1,'8343177bc5c05fc2d40e1db40ac717b823a0bb0e','2015-04-06 19:53:28','create table athletes (\nid_athlete                integer auto_increment not null,\nname                      varchar(255),\ndefault_photo             varchar(255),\nconstraint pk_athletes primary key (id_athlete))\n;\n\ncreate table athlete_has_social_network (\nid_athlete_has_social_network integer auto_increment not null,\nid_theme                  integer,\nid_social_network         integer,\nlink                      varchar(255),\nconstraint pk_athlete_has_social_network primary key (id_athlete_has_social_network))\n;\n\ncreate table categories (\nid_category               integer auto_increment not null,\nname                      varchar(255),\nfollowable                tinyint(1) default 0,\nconstraint pk_categories primary key (id_category))\n;\n\ncreate table category_has_localizations (\nid_category_has_localization integer auto_increment not null,\nid_category               integer,\nid_language               integer,\nname                      varchar(255),\nconstraint pk_category_has_localizations primary key (id_category_has_localization))\n;\n\ncreate table clients (\nid_client                 integer auto_increment not null,\nuser_id                   varchar(255),\nstatus                    integer,\nlogin                     varchar(255),\npassword                  varchar(255),\nlast_check_date           varchar(255),\nnickname                  varchar(255),\nfacebook_id               varchar(255),\nsession                   varchar(255),\nid_country                integer,\nid_language               integer,\nconstraint pk_clients primary key (id_client))\n;\n\ncreate table client_has_athlete (\nid_client_has_theme       integer auto_increment not null,\nid_client                 integer,\nid_athlete                integer,\nconstraint pk_client_has_athlete primary key (id_client_has_theme))\n;\n\ncreate table client_has_category (\nid_client_has_category    integer auto_increment not null,\nid_client                 integer,\nid_category               integer,\nconstraint pk_client_has_category primary key (id_client_has_category))\n;\n\ncreate table client_has_devices (\nid_client_has_devices     integer auto_increment not null,\nid_client                 integer,\nid_device                 integer,\nregistration_id           varchar(255),\nconstraint pk_client_has_devices primary key (id_client_has_devices))\n;\n\ncreate table configs (\nid_config                 bigint auto_increment not null,\nconfig_key                varchar(255),\nvalue                     varchar(255),\ndescription               varchar(255),\nconstraint pk_configs primary key (id_config))\n;\n\ncreate table countries (\nid_country                integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\nid_language               integer,\nconstraint pk_countries primary key (id_country))\n;\n\ncreate table devices (\nid_device                 integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_devices primary key (id_device))\n;\n\ncreate table events (\nid_event                  integer auto_increment not null,\nname                      varchar(255),\nstatus                    integer,\ndate                      varchar(255),\nconstraint pk_events primary key (id_event))\n;\n\ncreate table file_types (\nid_file_type              integer auto_increment not null,\nname                      varchar(255),\nmime_type                 varchar(255),\nconstraint pk_file_types primary key (id_file_type))\n;\n\ncreate table instances (\nid_instance               integer auto_increment not null,\nip                        varchar(255),\nname                      varchar(255),\nrunning                   integer,\ntest                      integer,\nmaster                    tinyint(1) default 0,\nconstraint pk_instances primary key (id_instance))\n;\n\ncreate table jobs (\nid                        bigint auto_increment not null,\nstatus                    integer,\nclass_name                varchar(255),\nname                      varchar(255),\nparams                    varchar(255),\nid_app                    integer,\nnext_timestamp            bigint,\ntime                      varchar(255),\ntime_params               varchar(255),\nfrequency                 integer,\ndaemon                    tinyint(1) default 0,\nconstraint pk_jobs primary key (id))\n;\n\ncreate table languages (\nid_language               integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\napp_localization_file     varchar(255),\nconstraint pk_languages primary key (id_language))\n;\n\ncreate table linked_account (\nid                        bigint auto_increment not null,\nuser_id                   bigint,\nprovider_user_id          varchar(255),\nprovider_key              varchar(255),\nconstraint pk_linked_account primary key (id))\n;\n\ncreate table locations (\nid_location               integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_locations primary key (id_location))\n;\n\ncreate table post (\nid_post                   integer auto_increment not null,\ndate                      varchar(255),\nsource                    varchar(255),\nid_social_network         integer,\npush                      integer,\npush_date                 bigint,\nconstraint pk_post primary key (id_post))\n;\n\ncreate table post_has_athlete (\nid_post_has_athlete       integer auto_increment not null,\nid_post                   integer,\nid_athlete                integer,\nconstraint pk_post_has_athlete primary key (id_post_has_athlete))\n;\n\ncreate table post_has_category (\nid_post_has_athlete       integer auto_increment not null,\nid_post                   integer,\nid_category               integer,\nconstraint pk_post_has_category primary key (id_post_has_athlete))\n;\n\ncreate table post_has_countries (\nid_post_has_country       integer auto_increment not null,\nid_post                   integer,\nid_country                integer,\nconstraint pk_post_has_countries primary key (id_post_has_country))\n;\n\ncreate table post_has_localizations (\nid_post_has_localization  integer auto_increment not null,\nid_post                   integer,\nid_language               integer,\ntitle                     varchar(255),\ncontent                   TEXT,\nconstraint pk_post_has_localizations primary key (id_post_has_localization))\n;\n\ncreate table post_has_media (\nid_post_has_media         integer auto_increment not null,\nid_post                   integer,\nid_file_type              integer,\nmd5                       varchar(255),\nlink                      varchar(255),\nwidth                     integer,\nheight                    integer,\nwistia_id                 varchar(255),\nwistia_player             TEXT,\nconstraint pk_post_has_media primary key (id_post_has_media))\n;\n\ncreate table security_role (\nid                        bigint auto_increment not null,\nrole_name                 varchar(255),\nconstraint pk_security_role primary key (id))\n;\n\ncreate table social_networks (\nid_social_network         integer auto_increment not null,\nname                      varchar(255),\nhome                      varchar(255),\nconstraint pk_social_networks primary key (id_social_network))\n;\n\ncreate table token_action (\nid                        bigint auto_increment not null,\ntoken                     varchar(255),\ntarget_user_id            bigint,\ntype                      varchar(2),\ncreated                   datetime,\nexpires                   datetime,\nconstraint ck_token_action_type check (type in (\'EV\',\'PR\')),\nconstraint uq_token_action_token unique (token),\nconstraint pk_token_action primary key (id))\n;\n\ncreate table users (\nid                        bigint auto_increment not null,\nemail                     varchar(255),\nname                      varchar(255),\nfirst_name                varchar(255),\nlast_name                 varchar(255),\nlast_login                datetime,\nactive                    tinyint(1) default 0,\nemail_validated           tinyint(1) default 0,\nconstraint pk_users primary key (id))\n;\n\ncreate table user_permission (\nid                        bigint auto_increment not null,\nvalue                     varchar(255),\nconstraint pk_user_permission primary key (id))\n;\n\n\ncreate table users_security_role (\nusers_id                       bigint not null,\nsecurity_role_id               bigint not null,\nconstraint pk_users_security_role primary key (users_id, security_role_id))\n;\n\ncreate table users_user_permission (\nusers_id                       bigint not null,\nuser_permission_id             bigint not null,\nconstraint pk_users_user_permission primary key (users_id, user_permission_id))\n;\nalter table athlete_has_social_network add constraint fk_athlete_has_social_network_athlete_1 foreign key (id_theme) references athletes (id_athlete) on delete restrict on update restrict;\ncreate index ix_athlete_has_social_network_athlete_1 on athlete_has_social_network (id_theme);\nalter table athlete_has_social_network add constraint fk_athlete_has_social_network_socialNetwork_2 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;\ncreate index ix_athlete_has_social_network_socialNetwork_2 on athlete_has_social_network (id_social_network);\nalter table category_has_localizations add constraint fk_category_has_localizations_category_3 foreign key (id_category) references categories (id_category) on delete restrict on update restrict;\ncreate index ix_category_has_localizations_category_3 on category_has_localizations (id_category);\nalter table category_has_localizations add constraint fk_category_has_localizations_language_4 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_category_has_localizations_language_4 on category_has_localizations (id_language);\nalter table clients add constraint fk_clients_country_5 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;\ncreate index ix_clients_country_5 on clients (id_country);\nalter table clients add constraint fk_clients_language_6 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_clients_language_6 on clients (id_language);\nalter table client_has_athlete add constraint fk_client_has_athlete_client_7 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_athlete_client_7 on client_has_athlete (id_client);\nalter table client_has_athlete add constraint fk_client_has_athlete_athlete_8 foreign key (id_athlete) references athletes (id_athlete) on delete restrict on update restrict;\ncreate index ix_client_has_athlete_athlete_8 on client_has_athlete (id_athlete);\nalter table client_has_category add constraint fk_client_has_category_client_9 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_category_client_9 on client_has_category (id_client);\nalter table client_has_category add constraint fk_client_has_category_category_10 foreign key (id_category) references categories (id_category) on delete restrict on update restrict;\ncreate index ix_client_has_category_category_10 on client_has_category (id_category);\nalter table client_has_devices add constraint fk_client_has_devices_client_11 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_devices_client_11 on client_has_devices (id_client);\nalter table client_has_devices add constraint fk_client_has_devices_device_12 foreign key (id_device) references devices (id_device) on delete restrict on update restrict;\ncreate index ix_client_has_devices_device_12 on client_has_devices (id_device);\nalter table countries add constraint fk_countries_language_13 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_countries_language_13 on countries (id_language);\nalter table linked_account add constraint fk_linked_account_user_14 foreign key (user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_linked_account_user_14 on linked_account (user_id);\nalter table post add constraint fk_post_socialNetwork_15 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;\ncreate index ix_post_socialNetwork_15 on post (id_social_network);\nalter table post_has_athlete add constraint fk_post_has_athlete_post_16 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_athlete_post_16 on post_has_athlete (id_post);\nalter table post_has_athlete add constraint fk_post_has_athlete_athlete_17 foreign key (id_athlete) references athletes (id_athlete) on delete restrict on update restrict;\ncreate index ix_post_has_athlete_athlete_17 on post_has_athlete (id_athlete);\nalter table post_has_category add constraint fk_post_has_category_post_18 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_category_post_18 on post_has_category (id_post);\nalter table post_has_category add constraint fk_post_has_category_category_19 foreign key (id_category) references categories (id_category) on delete restrict on update restrict;\ncreate index ix_post_has_category_category_19 on post_has_category (id_category);\nalter table post_has_countries add constraint fk_post_has_countries_post_20 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_countries_post_20 on post_has_countries (id_post);\nalter table post_has_countries add constraint fk_post_has_countries_country_21 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;\ncreate index ix_post_has_countries_country_21 on post_has_countries (id_country);\nalter table post_has_localizations add constraint fk_post_has_localizations_post_22 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_localizations_post_22 on post_has_localizations (id_post);\nalter table post_has_localizations add constraint fk_post_has_localizations_language_23 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_post_has_localizations_language_23 on post_has_localizations (id_language);\nalter table post_has_media add constraint fk_post_has_media_post_24 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_media_post_24 on post_has_media (id_post);\nalter table post_has_media add constraint fk_post_has_media_fileType_25 foreign key (id_file_type) references file_types (id_file_type) on delete restrict on update restrict;\ncreate index ix_post_has_media_fileType_25 on post_has_media (id_file_type);\nalter table token_action add constraint fk_token_action_targetUser_26 foreign key (target_user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_token_action_targetUser_26 on token_action (target_user_id);\n\n\n\nalter table users_security_role add constraint fk_users_security_role_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_security_role add constraint fk_users_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;','SET FOREIGN_KEY_CHECKS=0;\n\ndrop table athletes;\n\ndrop table athlete_has_social_network;\n\ndrop table categories;\n\ndrop table category_has_localizations;\n\ndrop table clients;\n\ndrop table client_has_athlete;\n\ndrop table client_has_category;\n\ndrop table client_has_devices;\n\ndrop table configs;\n\ndrop table countries;\n\ndrop table devices;\n\ndrop table events;\n\ndrop table file_types;\n\ndrop table instances;\n\ndrop table jobs;\n\ndrop table languages;\n\ndrop table linked_account;\n\ndrop table locations;\n\ndrop table post;\n\ndrop table post_has_athlete;\n\ndrop table post_has_category;\n\ndrop table post_has_countries;\n\ndrop table post_has_localizations;\n\ndrop table post_has_media;\n\ndrop table security_role;\n\ndrop table social_networks;\n\ndrop table token_action;\n\ndrop table users;\n\ndrop table users_security_role;\n\ndrop table users_user_permission;\n\ndrop table user_permission;\n\nSET FOREIGN_KEY_CHECKS=1;','applied','');
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
  `date` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `id_social_network` int(11) DEFAULT NULL,
  `push` int(11) DEFAULT NULL,
  `push_date` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id_post`),
  KEY `ix_post_socialNetwork_15` (`id_social_network`),
  CONSTRAINT `fk_post_socialNetwork_15` FOREIGN KEY (`id_social_network`) REFERENCES `social_networks` (`id_social_network`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_has_athlete`
--

DROP TABLE IF EXISTS `post_has_athlete`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_has_athlete` (
  `id_post_has_athlete` int(11) NOT NULL AUTO_INCREMENT,
  `id_post` int(11) DEFAULT NULL,
  `id_athlete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_post_has_athlete`),
  KEY `ix_post_has_athlete_post_16` (`id_post`),
  KEY `ix_post_has_athlete_athlete_17` (`id_athlete`),
  CONSTRAINT `fk_post_has_athlete_athlete_17` FOREIGN KEY (`id_athlete`) REFERENCES `athletes` (`id_athlete`),
  CONSTRAINT `fk_post_has_athlete_post_16` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_has_athlete`
--

LOCK TABLES `post_has_athlete` WRITE;
/*!40000 ALTER TABLE `post_has_athlete` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_has_athlete` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_has_category`
--

DROP TABLE IF EXISTS `post_has_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_has_category` (
  `id_post_has_athlete` int(11) NOT NULL AUTO_INCREMENT,
  `id_post` int(11) DEFAULT NULL,
  `id_category` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_post_has_athlete`),
  KEY `ix_post_has_category_post_18` (`id_post`),
  KEY `ix_post_has_category_category_19` (`id_category`),
  CONSTRAINT `fk_post_has_category_category_19` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`),
  CONSTRAINT `fk_post_has_category_post_18` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_has_category`
--

LOCK TABLES `post_has_category` WRITE;
/*!40000 ALTER TABLE `post_has_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_has_category` ENABLE KEYS */;
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
  KEY `ix_post_has_countries_post_20` (`id_post`),
  KEY `ix_post_has_countries_country_21` (`id_country`),
  CONSTRAINT `fk_post_has_countries_country_21` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id_country`),
  CONSTRAINT `fk_post_has_countries_post_20` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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
  `content` text,
  PRIMARY KEY (`id_post_has_localization`),
  KEY `ix_post_has_localizations_post_22` (`id_post`),
  KEY `ix_post_has_localizations_language_23` (`id_language`),
  CONSTRAINT `fk_post_has_localizations_language_23` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id_language`),
  CONSTRAINT `fk_post_has_localizations_post_22` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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
  `wistia_id` varchar(255) DEFAULT NULL,
  `wistia_player` text,
  PRIMARY KEY (`id_post_has_media`),
  KEY `ix_post_has_media_post_24` (`id_post`),
  KEY `ix_post_has_media_fileType_25` (`id_file_type`),
  CONSTRAINT `fk_post_has_media_fileType_25` FOREIGN KEY (`id_file_type`) REFERENCES `file_types` (`id_file_type`),
  CONSTRAINT `fk_post_has_media_post_24` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_role`
--

LOCK TABLES `security_role` WRITE;
/*!40000 ALTER TABLE `security_role` DISABLE KEYS */;
INSERT INTO `security_role` VALUES (1,'user'),(2,'admin');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_networks`
--

LOCK TABLES `social_networks` WRITE;
/*!40000 ALTER TABLE `social_networks` DISABLE KEYS */;
INSERT INTO `social_networks` VALUES (1,'twitter','https://twitter.com/'),(2,'facebook','https://www.facebook.com/'),(3,'inastagram','https://www.instagram.com/'),(4,'web',NULL);
/*!40000 ALTER TABLE `social_networks` ENABLE KEYS */;
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
  KEY `ix_token_action_targetUser_26` (`target_user_id`),
  CONSTRAINT `fk_token_action_targetUser_26` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'inaki@hecticus.com','inaki',NULL,NULL,'2015-03-19 10:23:20',1,1),(2,'christian@hecticus.com','Christian',NULL,NULL,'2014-12-10 20:34:39',1,1),(3,'alil@hecticus.com','AlÃ­ BuanaÃ±o',NULL,NULL,'2014-10-30 21:19:24',1,1),(4,'alejandro@hecticus.com','Alejandro Carvallo',NULL,NULL,'2014-12-11 23:07:34',1,1),(5,'juan@hecticus.com','Juan Ramirez',NULL,NULL,'2014-11-07 20:12:12',1,1);
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
INSERT INTO `users_security_role` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(1,2),(2,2),(5,2);
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

-- Dump completed on 2015-04-06 14:58:51
