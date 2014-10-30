CREATE DATABASE  IF NOT EXISTS `futbolbrasil` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `futbolBrasil`;
-- MySQL dump 10.13  Distrib 5.6.19, for osx10.7 (i386)
--
-- Host: 127.0.0.1    Database: futbolBrasil
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
-- Table structure for table `client_has_devices`
--

DROP TABLE IF EXISTS `client_has_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_has_devices` (
  `id_client_has_devices` int(11) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) NOT NULL,
  `id_device` int(11) NOT NULL,
  `registration_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id_client_has_devices`),
  KEY `ix_client_has_devices_client_2` (`id_client`),
  KEY `ix_client_has_devices_device_3` (`id_device`)
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
-- Table structure for table `client_has_push_alerts`
--

DROP TABLE IF EXISTS `client_has_push_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_has_push_alerts` (
  `id_client_has_push_alert` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `id_client` int(11) NOT NULL,
  `id_push_alert` int(11) NOT NULL,
  PRIMARY KEY (`id_client_has_push_alert`),
  KEY `ix_client_has_push_alerts_client_4` (`id_client`),
  KEY `ix_client_has_push_alerts_pushAlert_5` (`id_push_alert`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
  KEY `ix_clients_country_1` (`id_country`)
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
  `config_key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_config`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configs`
--

LOCK TABLES `configs` WRITE;
/*!40000 ALTER TABLE `configs` DISABLE KEYS */;
INSERT INTO `configs` VALUES (1,'alarm-send-millis','300000','Tiempo entre envios en milisegundos'),(2,'alarm-smtp-server','smtp.gmail.com','Servidor SMTP'),(3,'alarm-sender-address','alarma.rk@hecticus.com','Direccion de email de las alarmas'),(4,'alarm-sender-pw','alarma12345','Password del email de las alarmas'),(5,'core-query-limit','5000','Tamano maximo del query utilizado en varios sitios'),(6,'config-read-millis','10000','Tiempo de refresh del estas variables de config'),(7,'support-level-1','christian@hecticus.com ','Correos separados por ;'),(8,'app-name','FUTBOL-BRASIL-CHRIS','Pais o aplicacion de la instacia'),(9,'ftp-route','/Users/chrirod/Documents/Projects/NewsApps/FutbolBrasil/ftp','ftp'),(10,'attachments-route','/Users/chrirod/Documents/Projects/NewsApps/FutbolBrasil/attachments','attachments'),(11,'rackspace-username','hctcsproddfw','Usuario de rackspace '),(12,'rackspace-apiKey','276ef48143b9cd81d3bef7ad9fbe4e06','clave de rackspacew'),(13,'rackspace-provider','cloudfiles-us','Nombre del proveedor de rackspace'),(14,'rks-CDN-URL','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/','url base del contenedor de noticias'),(15,'cdn-container','futbolbrasil','contendor en el cdn'),(16,'free-days','7','dias gratis'),(17,'push-generators','0','consumidores para generar push'),(18,'pmc-app-id','4','id del app en el pmc'),(19,'server-ip-file','/Users/chrirod/Documents/Projects/NewsApps/FutbolBrasil/web/server_ip','ip del sevidor'),(20,'pmc-url','127.0.0.1:9001','host del pmc'),(21,'ws-timeout-millis','30000','timeout ws'),(22,'app-version','1','version del app'),(23,'upstreamServiceID','prototype-app -SubscriptionDefault','Service ID de Upstream para la app'),(24,'upstreamAppVersion','gamingapi.v1','Version del api de Upstream'),(25,'upstreamAppKey','DEcxvzx98533fdsagdsfiou','Key de la App de Upstream'),(26,'upstreamURL','http://127.0.0.1:9000/garotas/v1/clients/upstream','URL base de Upstream'),(27,'news-to-deliver','10','news a entregarle a la app');
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
  `name` varchar(255) NOT NULL,
  `short_name` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
  `id_language` int(11) NOT NULL,
  PRIMARY KEY (`id_country`),
  KEY `ix_countries_language_6` (`id_language`)
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
  `name` varchar(255) NOT NULL,
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
  `name` varchar(255) NOT NULL,
  `short_name` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
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
  KEY `ix_linked_account_user_7` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linked_account`
--

LOCK TABLES `linked_account` WRITE;
/*!40000 ALTER TABLE `linked_account` DISABLE KEYS */;
INSERT INTO `linked_account` VALUES (1,1,'$2a$10$qgo1CLhOBWfs3MmRVnQlA.yzdXYV3sNeZ9UyeDNTyTX8KbllZLwnm','password');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (9,'McLaren acusa Red Bull de quebrar regra de comunicação via rádio na F-1','A regra de proibição à certas mensagens na Fórmula 1 já está dando o que falar, ou o que não falar. Após o GP de Cingapura, neste domingo, a McLaren acusou a Red Bull de enviar mensagens codificadas à Daniel Ricciardo.    O diretor da McLaren, Eric Boulli',NULL,'22/09/14 17:47',0),(10,'Souza tenta aproveitar chance e exalta dupla com Arouca: \'Encaixamos\'','Com Oswaldo no comando do Santos, Souza era usado como meia. Mas desde que Enderson assumiu, Ferrugem foi quem ocupou a vaga deixada por Alison, enquanto serviu à Seleção Brasileira sub-21, e desfalcou o Peixe contra Vitória e Sport, respectivamente, pelo',NULL,'16/09/14 19:19',1),(11,'Sem Escudero, Ney Franco relaciona atletas para duelo com Fluminense','Nesta terça-feira, o treinador Ney Franco encerrou a preparação do Vitória para o jogo desta quarta-feira, contra o Fluminense. Realizando um treino tático em campo reduzido, o treinador testou opções no time titular do Leão.    Sem poder contar com Escud',NULL,'16/09/14 19:34',2),(12,'Goi&#225;s se reapresenta e inicia prepara&#231;&#227;o para pr&#243;ximo jogo','A derrota para o Crici&#250;ma no fim de semana, no Heriberto H&#252;lse, j&#225; &#233; passado e o elenco do Goi&#225;s come&#231;ou, nesta ter&#231;a-feira, a se preparar para o pr&#243;ximo compromisso, contra o Atl&#233;tico-MG, no Serra Dourada. O g',NULL,'16/09/14 19:41',3),(13,'Em jogo importante na parte de baixo da tabela, Botafogo e Bahia duelam no Maracanã','Botafogo e Bahia duelam nesta quarta-feira, às 22h, no Maracanã, num jogo muito importante na parte de baixo da tabela do Campeonato Brasileiro. A partida é válida pela 22ª rodada da competição nacional e promete ser recheada de emoções, tendo em vista qu',NULL,'16/09/14 19:57',4);
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
  KEY `fk_news_resource_resource_02` (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_resource`
--

LOCK TABLES `news_resource` WRITE;
/*!40000 ALTER TABLE `news_resource` DISABLE KEYS */;
INSERT INTO `news_resource` VALUES (11,1),(10,3),(9,6),(11,7),(12,8);
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
INSERT INTO `play_evolutions` VALUES (1,'636601c18bb87f5fdf461c7a87e59b8f1f8c4828','2014-10-30 19:48:08','create table clients (\nid_client                 integer auto_increment not null,\nuser_id                   varchar(255),\nstatus                    integer,\nlogin                     varchar(255),\npassword                  varchar(255),\nlast_check_date           varchar(255),\nid_country                integer,\nconstraint pk_clients primary key (id_client))\n;\n\ncreate table client_has_devices (\nid_client_has_devices     integer auto_increment not null,\nid_client                 integer,\nid_device                 integer,\nregistration_id           varchar(255),\nconstraint pk_client_has_devices primary key (id_client_has_devices))\n;\n\ncreate table client_has_push_alerts (\nid_client_has_push_alert  integer auto_increment not null,\nname                      varchar(255),\nid_client                 integer,\nid_push_alert             integer,\nconstraint pk_client_has_push_alerts primary key (id_client_has_push_alert))\n;\n\ncreate table configs (\nid_config                 bigint auto_increment not null,\nconfig_key                varchar(255),\nvalue                     varchar(255),\ndescription               varchar(255),\nconstraint pk_configs primary key (id_config))\n;\n\ncreate table countries (\nid_country                integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\nid_language               integer,\nconstraint pk_countries primary key (id_country))\n;\n\ncreate table devices (\nid_device                 integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_devices primary key (id_device))\n;\n\ncreate table instances (\nid_instance               integer auto_increment not null,\nip                        varchar(255),\nname                      varchar(255),\nrunning                   integer,\ntest                      integer,\nconstraint pk_instances primary key (id_instance))\n;\n\ncreate table languages (\nid_language               integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\nconstraint pk_languages primary key (id_language))\n;\n\ncreate table linked_account (\nid                        bigint auto_increment not null,\nuser_id                   bigint,\nprovider_user_id          varchar(255),\nprovider_key              varchar(255),\nconstraint pk_linked_account primary key (id))\n;\n\ncreate table news (\nid                        bigint auto_increment not null,\nhead_line                 varchar(255),\nsummary                   varchar(255),\nxml                       varchar(255),\ndate                      varchar(255),\nsort                      integer,\nconstraint pk_news primary key (id))\n;\n\ncreate table push_alerts (\nid_push_alert             integer auto_increment not null,\nname                      varchar(255),\nid_ext                    integer,\npushable                  tinyint(1) default 0,\nconstraint pk_push_alerts primary key (id_push_alert))\n;\n\ncreate table resource (\nid                        bigint auto_increment not null,\nurl                       varchar(255),\ntags                      varchar(255),\nmeta_data                 varchar(255),\ndate                      varchar(255),\nconstraint pk_resource primary key (id))\n;\n\ncreate table security_role (\nid                        bigint auto_increment not null,\nrole_name                 varchar(255),\nconstraint pk_security_role primary key (id))\n;\n\ncreate table token_action (\nid                        bigint auto_increment not null,\ntoken                     varchar(255),\ntarget_user_id            bigint,\ntype                      varchar(2),\ncreated                   datetime,\nexpires                   datetime,\nconstraint ck_token_action_type check (type in (\'EV\',\'PR\')),\nconstraint uq_token_action_token unique (token),\nconstraint pk_token_action primary key (id))\n;\n\ncreate table users (\nid                        bigint auto_increment not null,\nemail                     varchar(255),\nname                      varchar(255),\nfirst_name                varchar(255),\nlast_name                 varchar(255),\nlast_login                datetime,\nactive                    tinyint(1) default 0,\nemail_validated           tinyint(1) default 0,\nconstraint pk_users primary key (id))\n;\n\ncreate table user_permission (\nid                        bigint auto_increment not null,\nvalue                     varchar(255),\nconstraint pk_user_permission primary key (id))\n;\n\n\ncreate table news_resource (\nnews_id                        bigint not null,\nresource_id                    bigint not null,\nconstraint pk_news_resource primary key (news_id, resource_id))\n;\n\ncreate table users_security_role (\nusers_id                       bigint not null,\nsecurity_role_id               bigint not null,\nconstraint pk_users_security_role primary key (users_id, security_role_id))\n;\n\ncreate table users_user_permission (\nusers_id                       bigint not null,\nuser_permission_id             bigint not null,\nconstraint pk_users_user_permission primary key (users_id, user_permission_id))\n;\nalter table clients add constraint fk_clients_country_1 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;\ncreate index ix_clients_country_1 on clients (id_country);\nalter table client_has_devices add constraint fk_client_has_devices_client_2 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_devices_client_2 on client_has_devices (id_client);\nalter table client_has_devices add constraint fk_client_has_devices_device_3 foreign key (id_device) references devices (id_device) on delete restrict on update restrict;\ncreate index ix_client_has_devices_device_3 on client_has_devices (id_device);\nalter table client_has_push_alerts add constraint fk_client_has_push_alerts_client_4 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_push_alerts_client_4 on client_has_push_alerts (id_client);\nalter table client_has_push_alerts add constraint fk_client_has_push_alerts_pushAlert_5 foreign key (id_push_alert) references push_alerts (id_push_alert) on delete restrict on update restrict;\ncreate index ix_client_has_push_alerts_pushAlert_5 on client_has_push_alerts (id_push_alert);\nalter table countries add constraint fk_countries_language_6 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_countries_language_6 on countries (id_language);\nalter table linked_account add constraint fk_linked_account_user_7 foreign key (user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_linked_account_user_7 on linked_account (user_id);\nalter table token_action add constraint fk_token_action_targetUser_8 foreign key (target_user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_token_action_targetUser_8 on token_action (target_user_id);\n\n\n\nalter table news_resource add constraint fk_news_resource_news_01 foreign key (news_id) references news (id) on delete restrict on update restrict;\n\nalter table news_resource add constraint fk_news_resource_resource_02 foreign key (resource_id) references resource (id) on delete restrict on update restrict;\n\nalter table users_security_role add constraint fk_users_security_role_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_security_role add constraint fk_users_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;','SET FOREIGN_KEY_CHECKS=0;\n\ndrop table clients;\n\ndrop table client_has_devices;\n\ndrop table client_has_push_alerts;\n\ndrop table configs;\n\ndrop table countries;\n\ndrop table devices;\n\ndrop table instances;\n\ndrop table languages;\n\ndrop table linked_account;\n\ndrop table news;\n\ndrop table news_resource;\n\ndrop table push_alerts;\n\ndrop table resource;\n\ndrop table security_role;\n\ndrop table token_action;\n\ndrop table users;\n\ndrop table users_security_role;\n\ndrop table users_user_permission;\n\ndrop table user_permission;\n\nSET FOREIGN_KEY_CHECKS=1;','applied','');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
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
  KEY `ix_token_action_targetUser_8` (`target_user_id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'alil@hecticus.com','alidaniel','Alí','Buenaño','2014-10-14 17:26:55',1,1);
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
  KEY `fk_users_security_role_security_role_02` (`security_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_security_role`
--

LOCK TABLES `users_security_role` WRITE;
/*!40000 ALTER TABLE `users_security_role` DISABLE KEYS */;
INSERT INTO `users_security_role` VALUES (1,1);
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
  KEY `fk_users_user_permission_user_permission_02` (`user_permission_id`)
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

-- Dump completed on 2014-10-30 16:04:26
