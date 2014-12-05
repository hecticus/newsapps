CREATE DATABASE  IF NOT EXISTS `pimp` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `pimp`;
-- MySQL dump 10.13  Distrib 5.6.13, for osx10.6 (i386)
--
-- Host: 10.0.3.2    Database: pimp_clean
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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id_category` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Morenas'),(2,'Ruivas'),(3,'Fit'),(4,'Veddetes'),(5,'Suicide Girls'),(6,'Loiras'),(7,'Salon de la Fama'),(8,'Brasileiras');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_devices`
--

LOCK TABLES `client_has_devices` WRITE;
/*!40000 ALTER TABLE `client_has_devices` DISABLE KEYS */;
INSERT INTO `client_has_devices` VALUES (1,1,1,'APA91bEOF1nn7g5k4mldifF12mHTso3TBfE4z-JyuydLi2HjVmU9iQ7rXuY7GGmQ7nlkOeAer28p2VJ0q2jhyZq6AHvkvpl5kF0dLzW_WFgAhwxp8qSUd4FpT4Vtkao8NMt5oh5Von1v5xGM0Eu99hqgw5BBqMlYO3FLaiU-kd5tZqqTNduqbT8'),(2,2,1,'APA91bFs7030TedAQrGbiiCzDt4H9fUtOaAJhqltqu-kV5WjJE56gP_UUtgvtto5MlA7dgEpIiX3ZnXqu-6Sju_IyYx3lxLk-BxV1xCAhsu2agQR6pKfk5P_24OLFagzU9KUerKqJOxbhjzye4Qbooc9KY-y3YTQKt2q0oQuL1PLw6K849kE-6Q'),(3,3,1,'APA91bHxaigby4y_T3LYD6jMPw6WSfFLGMKdoV4roM9FuScmeyTV3YhxTRGFUAGp_ZLEyQeftcmAWWXH65w08lsOot56eoFhrfzXavyfTzO6aN0S_qpvTjGRNQtfDkK45Z58UdBKjnynfyifG860H43kcTh4oDuhh5UMmgoO79QSDsSu-j39348'),(4,4,1,'APA91bHEeOgvwkUiaTWM6ySGkidxcXqqqOI6qxea_BjaneiT8WHzo2dwG-3CS6yglMW09KrT32PgLPapVj-JF62t5g9vYmWILPgAKykMC_2W_0ivEnNEsTFRFtcj29qwhHNeiYniSzUFWluhXvjlnC5O_bNhKaroJbB7i5HdADEl4FkzCpWNu0k'),(5,5,1,'APA91bEuidLb65-7YYckwELLldA8hhhi3Fns-FeYsMdhvSwZ3mV7akOHgrU2QzaglKbcQ9sLkvJsinUwrmWGTuX9zyJkf3LhAOXpWjA6sezgeenMUgiwAP-EG39z635ZXJEj4ueaROclduokuGHtYLQSPjfN0v21HrFIyuN4TPtT7ugodgv7zN4'),(6,6,1,'APA91bHYdhpwDUZdRTPXsUlYyiS6zXYxNQwYNACv91mau6R174n3robVEAm7vQYpX1-lJKhGTBjPSw2q3Ya0-Hi-KRXSIRzOKDc-cOadBbOj3CnpJdaUta2eDsFAwWIvxzzyVRIS9WzNQaqMvGDxCr35MbYXy9kI8-BbnMXWvOeCiMxtiQnXeyE'),(7,7,1,'APA91bHnCmRATbN8GuOvwKeB_VSOsYQA8rr3ZA8vQuvCqI3EMzWzYwF-je3CDEcW5K0hfFehpDNCoA4iW9q0ijKVuKoLDheTRPFLE0ImpABoUH6dB3Wri6yY8lR84mMwUcTj4FBAXeBVoL8D0mMQcePbCkHsnf5LHtlVi1XbGsiUjOI3goh0-3g'),(8,8,1,'APA91bHvtxsNyH5INTErqygyilLyKdZ1Is1rR5AKXOkWNKPBBVU0APDDWk_f64OyiOztwNoKqqmXXS1iZmmQXxF6Hhw8F5LqvTIuYtPxx7PbpKFugPGb-MkpHSFPe52V7RmRMk7NbNKu-zChy-DB7Urxz6U0TZgcQqaS8klG5lyO6GTa0pro3KE'),(9,9,1,'APA91bFe04HqLOk9usLRUmzNuoCsnmkIDlu03ciuzQqXcs6jbpds4RKiAX6DTxfTKE3Y5hw0BKLSgBPrsnquXUmMTjA7Qoc7YFriNFHeqKLS2vVBvCURruTumNocZX0Y99U4hAmyfyZBu7TnW7A2J3ViYo-cjFHP4-z6nHKOFJfw2ZzAzWjS3f8'),(10,10,1,'APA91bGlUJfrMWqilFWD98Hhi6RSwWrSSGl5VAASRMOdxjTphfskvSGIQUTyr4c6Qeiz2zAGLDJ4jlyzb-tV0d5GZyH0wLsv8OySWv5BZZDsv1K-t8QeN4taO3fxcUQjpmptmNRGqViGDdJA2l3rocIem3C8SS716Q'),(11,11,1,'APA91bGZdME37jiX90CzsEzky-Vb6T4-nrBIe5QkCcRmexrzW6Kf3iGWe4NYkEzXcnQSgpRp0xq2QzUDQJM9JWsiJqt3TN0-qk2xJ6Y8Ptaj68RAXjRsypoXL00XGKR5-acSEDOrFQZ2lSvonCJbosujH3eKS7ATCSPSo6tjeQh6Sn53TXMLPa4'),(12,12,1,'APA91bGtxTWnZguxA2sPnbDTIAE6PqHWLGTxn4fm0p8gRyEjUp_WABPV0uSAP5TnWy-mCBxa3UnbVHqwF6GWSt4AlIRRNJBbwOops_X9sFfb8raPIDj0cqRjK7IW-OwlgWx28Bu49J4rvO7KaYsYyK2O8L0KQUAAiYvMxLPn81jBRWFJYWG-xiM'),(13,13,1,'APA91bGB9whZkVF5Ad6cQCd5tLHRFahFhRcrv9gcPXG-gjD3IyXIkLKDZeqiTKsAQJwuC96848xIfo0eG2D7NcCbB8miTEN4Erid4l8RlhA7Z3JNhBMUmpxqRs_KTIQ9sMKoVcM3V8I3DPEJ9YwPGSV5v61CbFnKNOi9jeakjwn5YOdEsjvV57M'),(14,14,1,'APA91bE7t_bBwhUzZQHB7luebh2uVWs5gQMwfWcAYv3VTrUxraSyH8TTP-LRFy0bHeQeEwMPqZVfETJCcCafJi6kvQIYoftSS12x1lSqBZ1uy_pvnsGqzp0OiSDcST7hbvxavVu0_mj_xnPhPaZ4vX3ZZfuUdEX0Y3NEqMeVlC_75gcs7HqP1zg'),(15,15,1,'APA91bEWpOmuBL2vt0bJ6qrAw--hJ1ec-7OQbgsMV6S_gikfuo79B_rYBcdVH--i5yXFb830ZzGzOMZtBZM9ZQPGzOxLdMAkTK4MFnY6U0czT1KbDQNFrpwZx4qQIxbUGPOvqDVEm9HY-L9fsK2FzsNLDeu1PY5qfI5H87tkkmuLp5tkBpiEq-U'),(16,16,1,'APA91bFsNd8pSJHUKDu6J2y3dEBAi3fNPppl4pWuwQ-BEiPoZoTm7oIgwt0Y7m1Pk44aIba0NR_6a_GIyxEZ72Kh7whkjLnze0JG_Ogg2CK-5PSnMV_2EVYv889xL1YPO62NhApXHdqZLYLnsErVRte4PqiSET0NC_07DwdP-IM-4pCogjMWStY'),(17,17,1,'APA91bGzS9Mm-Ik5Vy4lBEnbDy7-VxyrNtubENRwhKbmCVINhgXFi4eLmpQXf3Nslnfym-TsVTYWOR0tI53FdjgUDR0e2PEDMO95BL7bD1jHbkL3J1tv2r_oVESenHjCvwwIY0I5XDWHwPJD3xdD4k2xI0SWtTE5l0XSdV5UK85cYIT0TzbUbFM'),(18,18,1,'APA91bFKtfGk17p1qqnGM43hFZRnpk88eUloGHqXV4M_3n5vrUHkgkCEf-jxENvvsVY2KVXaplXJThvQbSdBkUxlpHCxZvM9GBakuuwNiHWCO0_rPoMF-HR53y4guUM2h1VhgYxDzyrG4aEK1I8zsy1zZtQisNtjXFzJSMAebKzHZfgo0cd5FqE'),(19,19,1,'APA91bHtmQYhwyIJVI-j2oTQ4TisrX3QnTqIaXE-3vry5UwJKkKdfhoQjsF17fuWk8obkc28QLFtzFxsI8HYJYaWnXehrbiKI-VGjPoH1Sh4U6eQFRdlA1PwGgHtBqNIY4XKrYYPtTPQqn75ZpGCHUrFP9maCi7lOQCwllu7i57N9nXqeeifewA'),(20,20,1,'APA91bFHrA3WWW9nQ8_e3mu1inqjB8Rvbk1fUOdeRTBDP9nyDHf15e2qPBzthRQEE05-vCjGwsHR-pgxv-HeD7rgp_Qo-Wix7x33QRZhgdLxvJVVthnVVolYja00fUu-rMPlrD0M0X47ULLapv-5_RRjtBp_fR-ux8NqhOwZdjGGq4mRmOjKXFM'),(21,21,1,'APA91bHKsKhPJ0NLZN4kI_-pCNSP1Xt_PCOf_cbzh-inbJUAIwF5Q5ECfimxQKI5KQ00_7LJXN1yxEr439m0UxvWEoBtJghX--IyGzuzEqOreNg9U-U0GfDxnoDcDmxKaSILyHVTymZeWSCHTNgx_Pog-l7YEYg3sq3Ji30JktHWb-ETytJ4r_Q'),(22,22,1,'APA91bGAH6VFGGxafDif47ghgs4qOuANzOYgChw7LAE7zg5wpK_k4wGnYMywxCYwrt1w-8EFF_sLHszABj23xTmaDhQhoSyTI1sznhmDwVDNu5O1lhzqhL5jB8c13cHIPXC8XBTnI0BOO1degKRQoqPcE4JjYt0uQ8pfDklWH_0NcXBzohR5psE'),(23,23,1,'APA91bF_Gj6nQ-SbMzCidgqYeldKwzhwrkB_u89akZUWkDHjulnNnfsmTFoidO80ztbV6Ykycrop5TipaWP3ORzivIHaX5KzHlCq4gBP2AvdbJvYG_TWnzVE4wLp1iKSlT9fuz8hfVtpGpNJaOEl7VJ5ZcW9oGGnoXabzFza4tW56-JHcimiaVw'),(24,24,1,'APA91bH789mpL_eksLGc-xcAtlmrENz_U8MFP-eW52RrBrtC7lljRTmsD-9e9R9xCElm3UAvhQfJ3D3oZwi8A8CFFBspoDlJnlul4AMShvV2-f_3PgpeNI9Db9l5IALDn7p8FZeQ1GXumGUXUVtmzch723vdvHZ52z55bhhaIguiA8B7rPlqn48'),(25,24,1,'APA91bF2buMnSRSiGx_tanlzS_HgAWFFM1MWgfbjVyl9wnbRizWT4JnFnznk4pvLS2QRO09RSnKs0ag0ycnmzGvXQeJISXQRkAh2NLTMGVuQHyhQx0SvYjdQV1E1zHckDF1SygSrinaJ6ZprS1icgv6oHlwlyEmDL2oLKFhXMXcumIPelM43wZU'),(26,24,1,'APA91bHcxoGW6IWeqBJ2NZ9G5HTm1lhm-Y5JWD493c1_MIHWv0ST8WFt74Y5Tz9jzHcN4imQ6bLvGolRARc2ZPHWPrij7hIyfNvekqFjUa39ZUA0jpA6LJ-NYnOQpIVVSLc0Z4kMAxc2vgsN6P3lZ3x_zxNzaCADZ6gqRThSpV_adV2GZMZto8c'),(27,22,1,'APA91bHPB7wuLpu8LB9hFP2fAVRVuUeaOzkadjrNBJ5J2qdpKAxrbusqAw9dQdLGFk-wfuYRqJnP9bu1kPmhHLSanJS95qUs7SWEUDztcFL5juecFEQpap-rbi2sHz0f5athB6n6lvumG1EKuXmFUqfPYln-JllONh7cqB2Cu0r-gUdW-JEhDGI'),(28,22,1,'APA91bF05_akrGfAeWEHI7Zc4qbaA2wpiYUToA1rCNMJ67DmF4BnFkFh0A55bdw6ag46kEfeTYWB-eLBblCNes6xMHCQ4WQQlXz96SnEqQyosPsUq1-YgkozGkbYJ8jU4TZSf375mjYG8aZSxM3J7SeS-YUd6BVB-Ait9hyBf5MbKvKSNSjWcNg'),(29,22,1,'APA91bExt-GkcY_uwgppvuw8vNjQOIWyYqgkI5XVgyImPANiFj5QY9vTrDWnCvMNrqj5o_O_LPFHAFopWeK4d12WB-ouHrj5GmSKNEOVZkyQF0vhaXjlQmvXBPWDUrOCC4KDVpeU7UItMRiyyCGE1sU9ii_DetiW7bgWm1_c5AnOH5ImzkHowAU'),(30,23,2,'simuladorIOS'),(31,22,1,'APA91bGOG4HPDqBtJUAYkXq9zaqzQLwgWV5pL-2dKVdcXsuPYEkOET0T9NsRlLM5cBxCPJLJrGEAunFNRj7P1BOHhHL09veMWY7dE0qnlrrQVMKcdqokrqp8MwYqTK3INSXWrVjXkHfGnuksJlwQq6v_UrhjVQRlMZ2NtskgZEtV2Ig84aVkkuE'),(32,22,1,'APA91bFVPLz-q8wzwt_2zWE1dnJM9R0XVDy-yOnYfkvydSEzmMRXBhlA4gTIuKJKTVL4SONJpnq_Ogy3frAsVOlSqRfm4Rh3CCTyi41HzxgHbnLcdhA_PeyOkYZ9YYaQ4dgFY1XjyA9elWEABxa6hHngpPCMozoDdIIZCBNk1jJUP_zkK2FtD-w'),(33,22,1,'APA91bEnV-T7n2rupEOkJ8wEk_DomBjeF6Nm5AX2c0ZeQSi9TJqTlhgNdtaRY9Uf6mOc9WtOsEWVawA9Va-QobSv7iHkrjICasRRydpCuVm6Rw3c8Q6FzZGAAJFct9QMAMU0QvJ-taBbhsfiVjcxWw0GRJfVUkE3KKMSHZ-HM69oAmwLN_cZKjo'),(34,22,1,'APA91bGW0b5pngCWVdpp5gu_saC2fXeVzffk7N6YIQtRvj50mdF_BjHmBnucPDeR7DnZWkcyuzMKbGxbgv3y6R38QSN5Xf2jifKVyy7ASbWOPo7M0I5cDE9NHvhawtMvq8VyFKrJTlweqG9-DKC8ntpHZP5msi6ROOIQlih5JO4_YvJM0Q1CDHs'),(35,22,1,'APA91bG2gHemfvi26BNValQzgy81kXpX7VxLg1qwTMx6pZq-5oI3wZnf-DP_tGUlq8rM8-NfzDkRaqyq4Fb4UMn99qnudm7Y9Uau8dZEYl2h2kwzpjKpMUiQe7qdN4h8GNWaRePIjDgwYN4ikG5QCQbKcOJZ3CKLtpt0J6AL9B_D00VB4oTHpaA'),(36,22,1,'APA91bGIRdxKYP_XCHQSB0yeujM8Mod5AQvDpxBdVHcykQc-Gn7UCBm8Eedxf2mgL90k4lPmaZ7ra4G-z7s5yE1kpQ31CyybAOIMK9nUdLVBFggg_mYL8R807uKc7cR-xMMuAqFLai6q2fbV6fplRt7Vd5Y4hBuydJo_J7cZ35xj_n1AsZMt4CY'),(37,22,1,'APA91bG9xEHUhmxKI7xYzy3O2lptRb7RqhdBX-Yceag4-OtIS83nsWohIMoZXUndhTv0xe042nky8miB6RdERlAJYyw45T607IfdHnqu2Dzv9Gr6qboOHArDhEElcsUya0hBAw_eTP5ZmwSzFnNxJ2xx1MKjkjDeu2at6w8xM90MOGGbS33rguA'),(38,22,1,'APA91bEKCA36L-HNxae8OUhBLFUBAi6KOYA80yjgjUXHai9AnMvMhiJHVJNexUaoskJhgqsahw0PrmmZXBvf9ixxicgkp9HmUOZOyw-HSCpCauYh2OlpRvcHWU0iqtsxOvdf2wyF3pZUGDL-hQSemKMoA8iXlMX00uGe1tSPVyAWjfcqmxSuMUg'),(39,22,1,'APA91bE01qcLngvB02jmNnpUPZqjGVYEp-CG_eT6NXNH9XsqOr4gwqDNcfJ06tBJpFvhqg1A_siZ1nLzqJSyduMuf0sNS5BieGRHwLNFUMmxO05n21Ci3SJx8KMR-ZDWb4hbEygaDthwLdICwf_JC5F7UUn9l_RdqK3VvkHEpDq_ocoUtFDsrnM'),(40,22,1,'APA91bHk7LK1BBOpwwaQpyYTdvKmwq0-FCOvcK03wbhhtQvhL9fMv2AvFOf7-97wAKyUdQPN0dr3W_IYGlSZnYowgPCTO6XNWABZ6iVnoAaQGjreeJfApRdqw0oimr7FJ24PYZPx65sQPfWVd2pk6KPBnbprdrBb_0ezxa1vVs3erkJwQP0UWUk'),(41,22,1,'APA91bH5DTZXupA_f-mmJtjvsghyD8l5MIoilABziZnJN12yMuzKLU-SlD7pAwTiaeDQsl4lDT76k5HUC1tsQxtuCUtzIMehF6ymjTCcdQ30SdRdqK1Zhilq7D55thd2f3Qb0Y8TUNrZRBEI_pimeWi_eVOHy_kth0fQY8VBLFU2zdDRm8-gyUU'),(42,22,1,'APA91bEQ-huV85Wdh24xARGNjWGAc3R8uGSiNNTY25JeSvx0R9Fr5xvLunQk9SHGZnDI_TJbfDqpcae0rDZn_kb2U0To07eA_rCNfy21bAg3OCvhmOhE4fzOWgWL1NHvetv-KPLk-qTB4xuyoIRh3vKLRl1lHayhkS4fLDuJvIB9vPUTKMS17cM'),(43,22,1,'APA91bFF3807uc12O0t5eyo5ZiqtRklS8kCUMqipEGIhNKAaXCAAtgIkybDf2rj181ogPwjI-kQHHDD6BAtw_NFMOxhi4B86KtmnaWrd5OOYKeeTP30hVMPSlzQoUVG_a_jsIe7sUeB9xWIcNKltRfL9pyTLaDHHWSwuVPvAmCae4J1M4ToIKn4'),(44,22,1,'APA91bHvm1FADkAbYItjlkBvnFTBd5b35i6ovTMvt-QqRhoDAo_TO5SzN_rUwanFJhDPpD7Ynhe2CjtYbyoZHzjVFdLQFKETJcL-VzCv2kDH_ag5_i8aCKSnZqLUvU7goPTRTw-NK0tUHNOX-iP4x5POtycBZ5ToAeBT1kahLN1rlYQFqfxvR4k'),(45,22,1,'APA91bH2ecAThyypkLjNgfdChh4vzzU1ZYoabgKWrLOkJqlW8tDwn6_9rPSv4kGKe4L0VcByErCkwt9wubaqMy3pwiCl527eKvyXKsEjPpaNg1Bb8Jk3AwMxHlqVqIRkONQUCAUtMlKtgRrejoFxzEeWn4Rz66dUB6d09eWFWIutH6YB8nIDf4A'),(46,22,1,'APA91bEtKrWSs643xOoxGLa6grOAnTtaVunCbeZ5zL6K79BqaKxqTP6cclXZr1hwQUQwnXNVdLi0Oh-elf_Obmwu_KIOQchN9emHg0Jw8ERE0-0WLN2fETprh-tLZndBE6GJD7EHCEs1LncukVWFeRkqSj-23-ru8E2hv8gqP6jCrWe8so8crNg'),(47,22,1,'APA91bE9i0kqPGwU1cjLfTuV4fpiTRUBEN30ikdJ7VhDatYg8PYsVRR80QlfQ16E-DsD8GUnS3ikdE6Y4jysbbOv8xoulYc9GLO1tqQkQ4rQvbYt1a0_pVr25eEz_YRRMK6M96ajCj_LGuRPDMneZ3kumHPCV0iVorUnvzkSnsVY1g55sF1e1vE'),(48,22,1,'APA91bE6psx6RZt6FCYvYHtlEOoQ3QG2r46WGJyZXuTXS8xCOhPo6uZpJp0TgnHJ0Kw4ITSW-P4nT_mPsa2OJPfIvF_bKl4ZetLgztb7Xw5vOvWfK2Fs7xN2OfOMPpbRkqD5IrzwgsugH7Ve_dRFC7wU5PnQ2EAAlCIGKqW032UYY9mnIGH5d0s'),(49,22,1,'APA91bES5xU7J4rU_8yfuABtHqtQqPHLlT64f7ht4GIiIVdR0pGpmuDGXcYdlnX4dY2sdeGhGRlaRmhD_zFU-9bdLu1b1ShRz_bU53yuIxpvcudOy55-cX5sDsHS2UBpUrXoF9pWmlN0zHbdzWdfhK09GzlaHgeuoQQl21lyz5YG3hbfejwJNA8'),(50,22,1,'APA91bGaT_FPcHfrb8h7Xevyepj5vsVU6EVXZnkfvOZMcylreKvgH0S1auqYlGPC0ZIHPca56VT4DiL8qlS2TLS7mCrOzyLBwtaIzRDGjKQlocYJNobAM1cBi9dUXBodWUOVW5N05uuA0JmiSpqL0HHCTw3zmxWcdcvWvvz690jsBi3WNUSv4Fs'),(51,22,1,'APA91bEC8gl4VyAxCXVaK0bA8k558_EC_FspIxiRVvEwZZtVRcCkSAdM2FhcxXFIXBMWDNEHNLTq9kTbLTdtHH2bBn3kG8AdyWlUXswXrDScHdpRkC-TUSbEtO4lZXYBv0fpIUtLYCE2iAkaV-ML6b-K2twIINrcNEgT2LW1GWh0mUzxI8EytVs'),(52,22,1,'APA91bHgcAKcAV3tLie6r8TJgR7qQsjxH41WEx9nWH0WcBD3zS9lGGyHiMGPQIvvUCBnQcbIXJ45UFAf98chHpPWr4Kj-uNueGupak9hn7UqzfXaVMl8VNgwGsHn85zx2ar8HTpb96_3KG6q0dVZWu03S7gJUuCz5rzbXfnL4OLjZpkVS06h_Tc'),(53,22,1,'APA91bHMh68jWBqVHDFrBnUBxjQoRShCTHWuvqogezl3FVuSyrY9f0MZXRDdzfDAQjXBTBbf_DYe3d14uYZ8pClrUB_vmiwFnNl8v5WISR6WqZG980j1eYFls_N5RoJbFGsW4_FPXHAis1NUMpmfN0aW8xkYlV-xskB07TiLjAS6zDmymLzTTA0'),(54,22,1,'APA91bE3D2Vrh3kHAcpjSD8o8dXVT_RuIufrzZewj9VMqxJUyGCNrFAgYMTdBP4Uk5vZpwzXD8YOQdT8G3LmB-HkGPjkac714e4JWhZrxLEc4DbDyB5uTspb69vs9UJPuw3JTMXexh2-smFmiYf69GH8mfN8--XWFRF9uFQuozsYTiQ3HclR09w'),(55,22,1,'APA91bH1tQOe78xkmv42JxqgFlRRuskYutPC9ajqpPsAq4Xyu8NTY4MWTUjjM3PT8nlTY2P9PXpWvwtqJumYGCi79qrcp1omDrnIYy2LImh7gdAIVxEGU609d8mDc5XRvU_e47PyYA8UF71DcbI22eQ6D7Oxa_xWuxRa4entqYscPbQB9ITW7Aw'),(56,22,1,'APA91bGToj5w-EJVMMplQzXLhtbSpdp6UaYdCn7h5OqDM2xBAcsU1eQB0OZ849feD2fI0U-Nvnwhndby4ssrOF_Gco4EH1m3-lTHM1powYX74u9sL04M00TsFEojr-6VxDaFQRTbxN12---gZx_tgZY28V0riStOlURolzz09-orSD_7TdA8Q-A'),(57,22,1,'APA91bF--6POYtnK7BAqsuIEGeiVdaV9-LzEDNnqt6h2l9GIDZJO2QDj0oB9DQf1LK1F8UNadOlST5lc2PyRRvOIKM8N41vbSFXUAzfh94XePgBx8nY5hijMt6OFKiZtpelCY6zyQeSSlwQ3lU0TLjVFzmBdsXRN4JjO1NGJx4pE_94D1G31GQs'),(58,22,1,'APA91bF4lb8EcO-OLtn5IUC56apCdvluuAaT3j04pNnGgEvELzAm8OMrsiEbBvLghlmIs_jbg9SkTsVzccmJbKMmpwQQtwOCbv-5IjcsSAloUUk58fvYM_OUUZw9dIInO_ko6YYt22fv1UVsOk0JNN09DwVrNqVrVYM2NZnlUvgA22-OOgfvBvM'),(59,22,1,'APA91bF4L21v5Q-kAJpGAkigikwBCTS45yXmy7Xt9ilU5AwaJIklJhFDvdUEvP0-muLxrdCfbWddGU81CyWB6fQ84GOGrll0eJTRO-6aZR14hoX6qdPW8n_s3wW5jMDmNz5n6GCIB0Q4NGQQKzqajkssHmdoFejIDIypBpwKDhPfFJZgrWQar_Q'),(60,22,1,'APA91bF8AIo1JYjNqbcZWqiRDEA67krg3vc3OZu58iD7SFEq01fqET7ulT18PpjhLZIS306lni1fT6O7b5d-CyhDhhO3iUCMJ18nIiQhD4CzxmsHTk0gkor8P066SrDzFCwdx_sfLpxbAqNaE2XHd0nVQPjUHDYu8YW22TiBAEZJW9qAt7bWaPg'),(61,22,1,'APA91bGvLLvubGn8sfKgh_Yfx50z7nFjPBYbEFvOtWVy-BhWf5lzzitqIYzLX17VPX3Nik-40zQo8Teqafsqcul9913oUnvcEZ5pju0r9n3tzLuyJ8Xnb0a8Pfqko6l5CGpA55-Hsxm23JXPQaoOIWTzcRooAyaK1u8tF1IMUbHNVHwgbtE8NFs'),(62,22,1,'APA91bEjW9K0Lu0V9YnNSd0SLZh4hb5HlK43UewCufzKGBY7aU2gg-8R5LzYPKlAGzNcLbs3-E9ZJVBAVdRIlVQS7k-d-9a8xE8gct3UUCLQxwMZqPb1I0Y3tp-k_BWzUQXOXnfvras1AXdfeLC_ehtW7f5eF0xFK7HfpFvwcVi7e6BvN0gXbD8'),(63,22,1,'APA91bFa_OjiDQ36x-mrK310kbA5fkZVjdbT4Vn4z_eL-3PQIrjFmC8uGCMmu7L5EoaWFIGSNc9G7aQgNvIJqij21F4H4-1tgZcyriogF430YdwklrB2sQo2YSd3ihYgzLNnmg6z47ymc0B5xq-jmgw2r2-y6TBpW5w1ZQgRJVXgH0heXu6yPXU'),(64,22,1,'APA91bHfylpkSwPET7NedPiTaO7-bLt25AR1a2pzqRDVXZMwqA742EsxMSbbJIfpb-wvfprrgMSJCQi15uyhkcDUSVIA5XshnZAPwKdCK4bIMbX6oRW08JnlhQtBlXDgCT5ckz_P_wcAFi-VctLSysi2YVLWB0ue2jAbzPiYjJwi87i0i5gs-mk'),(65,22,1,'APA91bHGRGTSV_m-UOv6NKPOiqyhFA5t0bXde5viAikmsEVujTd8OTWbZ28fyfauIGfJQce3xqMWqRKj3hvmdpsUbnkN12Q2Q1C_8ylT7OOOcJs0ajyV_IsDiCiEFIO-Z3lL6oSyaL85HnIij2wS74V7A5peevd8w7BfANNQfC_XJ60EZieiUl8'),(66,22,1,'APA91bHVFGviS8Jgy1lWoV_TZw2oh7iVkWQAjX7WNSl0DECKE_riJtW6v5Q6dmMsz78lF7S1FppXs6gwhQR2OIpfxQG4HO8pC4ekxE4jD7Rd6EJP3b3RNajyU3BDzmq12W9lvdjDtLELfvnu7HijB7Mjx7WQwINULbg_OhQFZy1xwT_wXBRs2Kg'),(67,22,1,'APA91bFKtfGk17p1qqnGM43hFZRnpk88eUloGHqXV4M_3n5vrUHkgkCEf-jxENvvsVY2KVXaplXJThvQbSdBkUxlpHCxZvM9GBakuuwNiHWCO0_rPoMF-HR53y4guUM2h1VhgYxDzyrG4aEK1I8zsy1zZtQisNtjXFzJSMAebKzHZfgo0cd5FqE'),(68,22,1,'APA91bHnyiFYwMX7jc0_q6u7pM3vOD3DOb-pT8WtLApubSCu3YsH4OVcoStbw_LkBI2--Uidu79TFdOgn7KLll-gFVa1_IZO3tyhRKVkOp4hJaouhYPE5wq3M7XKBlYIF1MMNs3JMvMEwLJug9HhNxbkiQCcC1FRi3hb8nacrjKViQwPEBwyGCM'),(69,22,1,'APA91bFVtWtrLIgIfLtPLf-5FvmIVpciYMWY7F6ye9Y9iVXUr1oD9rJ_Z7YWI2gYp3LYDOlK_9CJJtvzWiBW9P7ZUhqGDpv3ytm5okIcyr_CN_ZUy1dFU5bVnxXbFu2yPjJ9WfKAvOOWAwiF1vD5qEtvWYhlvPAhZmiU6_yTBQV_F77u_TCMrg0'),(70,22,1,'APA91bEPZlFeiLSg5TFv7PXT0jVhK-Nxx8hLzHVqGvuKWgl34ulm7g08qFj1fhtkL1zj5typzTT0em0Fd7YTWWn8euCVnp9fD7TeZFTrnQYUWA2fWA9JDDR_UzTVgc9JFQeD6cudmL2vVgcSv6hUgy4sFGU3M31fZXoN9MHYrtOpQkMrJyZFiQE'),(71,22,1,'APA91bFkyqvZnZWG4F_IDm6pVSNCjaxRSmAt970ohnKAVRSKlVrAC3Qz0ujQivyi7FyQVlTRi_8XJBWiToi8FWGPMbO6uEVd4h2EE3AUR-rYvfRD4mZpImEM21digkUiLCyI8OY9uFUoJuaAdzYAPDehUPrK8uXtZBUMkyVkpZyW3B_rgHacGgQ'),(72,22,1,'APA91bHc9CxyahyzkFHjWLEUjDPRzD67zNG255VhSq76HNe1bNjDWzJmWxSjxl_DpGrC4CTRbSBKFMjRTs9whZVlfLqiIP6m05VnCgit1D80AiF7ORYzxHofo5BOd3owYfTKehv7a50jLM7Bn6tg1wrhScrgRvMZyNE5b5CCKYcFydoipkdoUv0'),(73,22,1,'APA91bHdGdAPfiPppqhkuyiSjleRkWSfBMDu9zPNTJmspxMlTOYAt1_mEKbBtc9Vk-k7CYsEi23iR73BI4D7cf-73lZTFeqMw14NGaHg6AUOVRd83-xPLRH6NJUi4gRhtB9QfPNTmTtlAN_7S0hpoLhYtbGBRXilCgb5glrhRSv6yNKeVi4GvmI'),(74,22,1,'APA91bFe8mYUSLcIZLWoIQerqpbHzPrI5js5h_BdnvhFRzstPcpO2pmW4sADdMjm0DLCvuUP1bJxLzBzBlePpdBd0Bm19nGeqPDrbCQu4gj5nlkqaEblRHFu9dqKiaD0WuhX9aksB1m0Hr0I9v7CNS8L0XxL-on8Ix-T_ffGCMUzMZ0Yl1T56yg'),(75,22,1,'APA91bFBXdJKKa08oYKXHvcCiR6CZFAqUTzEsESlvG4H0eMQhtrxin3mQ5btb3eY5xezzlYWYpnd1PvfEyAmOFKMpBhc-VzyHmAyHxq9F3iuWP0fk9mt5ifEQKJgpZe-RLyQaw82NmmTreQosODpBp42wNSmS-38s7lVNi533CHSRZ443NQfiHw'),(76,22,1,'APA91bGmztsYmz57uKOu2IACbwO7thMm_jS2LRAF4lM3zSKZDED6eSZvKFdJ8cnhKqBq3ceUGJi97jAo-q2bFUePz9V7YhhwqQnoL5HKvfhfXWcCqvNDazE-rPaPbWqz0tAMwe9n-DsMC3raLXe2m5BM6DHMLQxnQYo4UI0zdq71q7ldhbGNff4'),(77,22,1,'APA91bGH9yy7_QPXcN5L0JkT0x1lQbBTtCAyaWdREC5WwamY5fPDlvB2JkUqsvacxr5Ze4TXWIVell1ohqgHPulCnwMK1s_o8p0vkcBwJ8VoABKa2Np9QntYGkQeVfXJmWnxzMaR8QgeAtuj540j9ZLu0U12Qr-YvLdNP0WUzHbl5wamJuBrVmU'),(78,22,1,'APA91bH2z2j89Zog0QwmVWF5Xp7uRqDXWa37YseRwYn4av5D_y2bq260iLfM5hEE1ni0TKk5x3ULEDeBAIX-FhjmTtw0ERx-ZAFI2WUzrXyHKaNjv8QZUbbKOTNeSyhG81AL1cU9I0lU40y4_GRgJTrZPNjz-psUDk2-Wk3ttvflieyABW8Z4bo'),(79,22,1,'APA91bEu-yedDKlq8FbCBvMeWk-duu_ZVeruhwLAhLi_IcGIR-BHva6uHhLH2gNM0__qYz46aP3kTDjpO4i3YyoC4ySNd3quIG_PNzsnqHPYEY_K1T0EmvwNT7jFGFlnSOOWpnsN4YUMzTqn9OFJVhzZN07kM_8PXV8SsJG8UvcVcz1Yr44wCyk'),(80,22,1,'APA91bGgKT1hp_1wjcSdkbwyJojG6DnVCIUkiLXMSDmcvCOtGn2cNFy0oL7E5oGiBucaH6SiBGnA7jg9h1RKPd3IEg5WhTu20itH6KPg0pbEgZ_TwETJ9tJgULS_Wo5T-s1VOEFG3bTK6XQSXTuFyb9SSLa8o7mil3u2QQFQUh3zMpT1b1Cm8hQ'),(81,22,1,'APA91bF-5ft0DMaJA29DXpOk_G2ZNrio-gxSnj1OcxpQb2Ooux2ph3IgeiYMTUAvPxSz-_8i6OfnvjXb4XFCeQTg9xVhGZc8KIQg0gAgPm9c_KJQoFL3KO4YxXLNT2ntCcyw2H87JqMcHVNOvkqxKGaXrMVH4cE4EYpCjQpffyxmFcEhUklZNsk'),(82,22,1,'APA91bGWBU0YV5IkSl6ABqaErjuB72IkPrySsoa6Md7OEPvlfnWbKJZvIxkuDjX7-WozUMgFgZ59Qyv44z39bPjkM_NDAPLqVoiJEGRqLDKSfzfVWwx5CtRi3S4rjhgRhHWv_pDxRLRHhWL8h6ZK7SUOh6UZ0E1HRkjvuvB43UIWbRsqGyq_H_4'),(83,22,1,'APA91bGZxWgQc1W5Q5YDhcuvp-IbCwLlgDB9eRPRYJSMXVjP4phXkT1eyF385DGmaqApetUWCgbAzzJ-bRK4X-ELd7-NVWLJALAUjp0NUx6c1L22ZfPI3qQa3OqUCkHmNhJKk2vwI9dBj_Wy1GzdqOZxqX6_sVNWD_RGR79HoWeGGs8p0q47Vak'),(84,22,1,'APA91bF-j8Xv4nITACTzu3idy5zTh7OLDAtZJdMLz4cJP-PY3JNlAwe5Dd0nFSuufu488fX6oM2ZTC0PFvXIYwcUuW5-rP7wsHrxtbon6Dwad39jNaez2bnbWRIWcY25jxhNwin00in0p05TW0YFMXfLz_1lADM35mPahbwtJsZxpn_ry9_Cd0M'),(85,22,1,'APA91bGnvWh03ziZzycJngNGM1mET_tEmNayK95PTUzEyp1e8x_iJ9SuSVqXOkwx9ag-AGBUMhNVmTubb4LkUpp9zzR6dWeTAEhL7CeAYjos1iAoJYNgnFnY3I3ykRiWU1B9nAmKLoug6P5riaAhF-T7QIJD7PmYhA7pkoC8SoqP8UqnU9pyfS0'),(86,23,1,'APA91bHPCdjt5CaRLDJZ0S60IpEsV_yQvmFQunInQnxpciHrjnQef-cdA4oT8KvHJHxlGmZUy69TPrWlzlpOpa_XjNRXSVbEqLdKEWhrMwPD-ikoqVRXhwQQX4ErHrjPi8Fd0UmmvY1S0cO7N5WOisRQaz0OHQaQcK6msCd58DVsIxRd764t5nI'),(87,22,1,'APA91bFFwtbh8sthCCWnGlEnC36ieW17Qtk7gGvweFDFUOzGzdnJXD6qAPLos0nqCM2CtiaPPhXvdhQVoOgDB4lhzH8O9MyIRw0I1Sl4Y0vHbfmRm1bnsRi7fEgU7NPRO7w0UXou5LsuW2jHeDwPJdjkj0L-HStXQsxcoQoI1A4yVxf7LT-h8Og'),(88,22,1,'APA91bEC7arkCPdZPSJ26EVuj8qTmXc66Tktefq_45888eiV5OqdT1jhQ74ZI_BHqGtsc2SR0EXAisPiButLDJ_pRPE7ZARCNEcGbAbCmsN9EXEIu2J2zwFbOCiJYqMcugiUGrGIdWGIyPcti_OCKpM82_LD_ZJlOcmnbdNkf5deVqj5krgbdeA'),(89,22,1,'APA91bFSEqVlSV4DmWUmkPlUqShZq8CNpRZFAR-Bj1IGiWOiCOEfN2oVH-rXrKDqvY7oaLP3M4RVbkfnhsg86PogkAipduPclb7TR-tW_b1GtuKQ--AHEfpMcf2z5IVeAlkgoqUaRpL9FoP47bk7wM2W3Bt4NAhBP_sOIjbmvhENrSDOQWpbcRM'),(90,22,1,'APA91bGXjm9LHDrCqeoebu6NyXE3cr_zesElsHF2vXNT-s-Q9X2ekyIlp0g3wWd92e7yJHO92UkXH3D2nvVxtHvXBOfWBuww9ucwUPe4BgXx2llBxcf4RxpaIonb1pWiznS6e5lABgSqHPEdxwX4PwXnwnhJ_lnyLG248AYyREcYIj1SKIAbcds'),(91,22,1,'APA91bG2DdI0OSu8FnfDZLeDSyq2T8b9GJ21Wp_QmLge88bBmmtJGMVw7reJPGA0kIY5sQhtVmVOxYrvIrdwdfF3D5hfdgQC_nDpLe9Jff22rbGBmRk30IZOZsF2iWRcY717jrQ6pXsJCl2br0D_zjdQ0WUEQCUfSFtLHQKtf4CvHV1iHQ8eMbo'),(92,22,1,'APA91bFZoRUSIbrnU1wjzTUnfUBGssvdsHI6_6N5eSE2Zq7wZCTWPosyFjfQq4YnpbdcypyUU2P3Q-xSyxohRH2Cjg8POHyuQr4dqig5fSYF8MRc36tQN1NbWlfLZDrzEaKOrH6TYfGpdX5bnvMAVK7ELolc4r4gMz_aH7yx_1TqzMvSSTIuvsc'),(93,22,1,'APA91bHbW_XjlwBKnOxuV4pq30Ufd3L64BXdR7ZVVxI6b1ZNnm2WOUQn4TTd5WSx5mP3SDG_BavwCXuWKpYQB7hjgf7ibfGlxzCdh66rxhPK-iduG-Dchy3oElNZKjCzL_lJyieKznhP2iRP6qETkWC6gJ8m9lcU9Zxqt8IR6USWmJPxFQRbbus'),(94,22,1,'APA91bETsesfuO6fP74W5RB6ysz3NY9DJc4PBwL7-ODF6Igoeo6E4CV17DdXg7EnZZRfgWOh-9wLaO5kRLvyA4LwoTUsBzYyKMCVUNs8Bhdbf4NIpoEO7vQ_-3ya2L4Vqk5AAe44UdNDfbnPFGHklVy9CN2g_7JTfKZLGqP4Jbmy5LOgn0ZFk00'),(95,22,1,'APA91bEdG-AKAcZiEk0KeErDMzvSnwji06w1esoVy0hR9g-86q2ch28nErB6ZOPqopYN0pE6zil_n2G7dzf_G5hTmnMW61CF4eT6AtHm_DRamZZ8k9c5us8Pzw2t4OE6ekFZ4PkWzzmsHfQ15DOI1d_WzXBTBmW7ZdoNLkGbd3ZL705XCcdSQDA'),(96,22,1,'APA91bHmhUGwlFh10WKgkbU7iX1yat7UV9wpPAOA50kn8AqL_hdgjW13Tm4HgitVtaffWiZ13GjX9Gf0AiE12tXHfiE9LpjSa6OTaMaxEATkCa_OWMqdXFSLZWgMlUu4heR6vYFfIjgh8DEUWJtx2Y_Pac3Ts2L-1JVNjxSt_MnVXn9OwzKRWwo'),(97,22,1,'APA91bG3vEtMVhpCuIph_pw9EjIUd3kGMN6VD4tgUdOUPcUOvZICh1amIt3JQVgn2fVkn_2Wq8_dIzhMpKztI1VOhL9zfFcrnCXh-2PnwSGjjvbuXLNHWqi04luc4xbX8iD9R9rcCQkFGZNHQvDR2dLdhM5Dj26SuMwkScZSlSjbiMgNsulPdhk'),(98,22,1,'APA91bGOfFTa_8Z4GRq6QHGd-NEI7Q6_9kJxKDF9i89XUww4VOTyQPE01F0Bp2oFg-8jbF0wEVAWSU1hnBbzOC7MmE2d_17f6VxvC0vl2p0Iwj-i8S3FDyrK1mopRWr7fFlKEgp-gsZeAJQijos-qjUV1OhexOln4Qwrb86k1IJ7d4pYOWL5zto');
/*!40000 ALTER TABLE `client_has_devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_has_theme`
--

DROP TABLE IF EXISTS `client_has_theme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_has_theme` (
  `id_client_has_theme` int(11) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) DEFAULT NULL,
  `id_theme` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_client_has_theme`),
  KEY `ix_client_has_theme_client_5` (`id_client`),
  KEY `ix_client_has_theme_theme_6` (`id_theme`),
  CONSTRAINT `fk_client_has_theme_client_5` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`),
  CONSTRAINT `fk_client_has_theme_theme_6` FOREIGN KEY (`id_theme`) REFERENCES `themes` (`id_theme`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_theme`
--

LOCK TABLES `client_has_theme` WRITE;
/*!40000 ALTER TABLE `client_has_theme` DISABLE KEYS */;
INSERT INTO `client_has_theme` VALUES (3,1,2),(5,1,1),(6,1,4),(22,10,2),(28,17,4),(29,5,4),(30,5,2),(31,18,1),(37,22,4),(38,24,2),(39,24,1),(41,24,4),(42,24,3),(44,24,5),(73,23,3),(74,22,5),(76,22,3),(77,23,2);
/*!40000 ALTER TABLE `client_has_theme` ENABLE KEYS */;
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
  `id_gender` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_client`),
  KEY `ix_clients_country_1` (`id_country`),
  KEY `ix_clients_gender_2` (`id_gender`),
  CONSTRAINT `fk_clients_country_1` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id_country`),
  CONSTRAINT `fk_clients_gender_2` FOREIGN KEY (`id_gender`) REFERENCES `genders` (`id_gender`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,NULL,2,NULL,NULL,'20141107',3,1),(2,NULL,2,NULL,NULL,'20141107',3,1),(3,NULL,2,NULL,NULL,'20141107',3,1),(4,NULL,2,NULL,NULL,'20141107',3,1),(5,NULL,2,NULL,NULL,'20141107',3,1),(6,NULL,2,NULL,NULL,'20141108',3,1),(7,NULL,2,NULL,NULL,'20141110',3,1),(8,NULL,2,NULL,NULL,'20141110',3,1),(9,NULL,2,NULL,NULL,'20141110',3,1),(10,NULL,2,NULL,NULL,'20141111',3,1),(11,NULL,2,NULL,NULL,'20141111',3,1),(12,NULL,2,NULL,NULL,'20141111',3,1),(13,NULL,2,NULL,NULL,'20141111',3,1),(14,NULL,2,NULL,NULL,'20141111',3,1),(15,NULL,2,NULL,NULL,'20141111',3,1),(16,NULL,2,NULL,NULL,'20141111',3,1),(17,NULL,2,NULL,NULL,'20141111',3,1),(18,NULL,-1,NULL,NULL,'20141118',3,1),(19,NULL,2,NULL,NULL,'20141111',3,1),(20,NULL,2,NULL,NULL,'20141111',3,1),(21,NULL,2,NULL,NULL,'20141111',3,1),(22,'324234345050505',1,'55123456789','qwer','20141204',3,1),(23,'324234345050505',1,'554142840999','ert','20141127',3,1),(24,'324234345050505',1,'55123456','fth','20141114',3,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configs`
--

LOCK TABLES `configs` WRITE;
/*!40000 ALTER TABLE `configs` DISABLE KEYS */;
INSERT INTO `configs` VALUES (1,'alarm-send-millis','300000','Tiempo entre envios en milisegundos'),(2,'alarm-smtp-server','smtp.gmail.com','Servidor SMTP'),(3,'alarm-sender-address','alarma.rk@hecticus.com','Direccion de email de las alarmas'),(4,'alarm-sender-pw','alarma12345','Password del email de las alarmas'),(5,'core-query-limit','5000','Tamano maximo del query utilizado en varios sitios'),(6,'config-read-millis','10000','Tiempo de refresh del estas variables de config'),(7,'support-level-1','soporte.daemons@hecticus.com','Correos separados por ;'),(8,'app-name','PIMP','Pais o aplicacion de la instacia'),(9,'ftp-route','/Users/plesse/Documents/projects/newsapps/AGataDoDia/Pimp/ftp/','ftp'),(10,'attachments-route','/home/pimp/attachments/','attachments'),(11,'rackspace-username','hctcsproddfw','Usuario de rackspace '),(12,'rackspace-apiKey','276ef48143b9cd81d3bef7ad9fbe4e06','clave de rackspacew'),(13,'rackspace-provider','cloudfiles-us','Nombre del proveedor de rackspace'),(14,'rks-CDN-URL','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/','url base del contenedor de noticias'),(15,'cdn-container','pimp','contendor en el cdn'),(16,'free-days','7','dias gratis'),(17,'push-generators','0','consumidores para generar push'),(18,'pmc-app-id','4','id del app en el pmc'),(19,'server-ip-file','/home/pimp/conf/server_ip','ip del sevidor'),(20,'pmc-url','pmc.hecticus.com','host del pmc'),(21,'ws-timeout-millis','30000','timeout ws'),(22,'app-version','1','version del app'),(23,'upstreamServiceID','prototype-app -SubscriptionDefault','Service ID de Upstream para la app'),(24,'upstreamAppVersion','gamingapi.v1','Version del api de Upstream'),(25,'upstreamAppKey','DEcxvzx98533fdsagdsfiou','Key de la App de Upstream'),(26,'upstreamURL','http://gatadodia.hecticus.com/garotas/v1/clients/upstream','URL base de Upstream'),(27,'post-to-deliver','2','posts a entregarle a la app'),(28,'post-to-main','1','post para la pantalla principal'),(29,'default-language','405','idioma default para los posts'),(30,'id-hall-of-fame','7','id del hall de la fama');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
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
-- Table structure for table `featured_image_has_resolution`
--

DROP TABLE IF EXISTS `featured_image_has_resolution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `featured_image_has_resolution` (
  `id_featured_image_has_resolution` int(11) NOT NULL AUTO_INCREMENT,
  `id_featured_image` int(11) DEFAULT NULL,
  `id_resolution` int(11) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_featured_image_has_resolution`),
  KEY `ix_featured_image_has_resolution_featuredImage_8` (`id_featured_image`),
  KEY `ix_featured_image_has_resolution_resolution_9` (`id_resolution`),
  CONSTRAINT `fk_featured_image_has_resolution_featuredImage_8` FOREIGN KEY (`id_featured_image`) REFERENCES `featured_images` (`id_featured_images`),
  CONSTRAINT `fk_featured_image_has_resolution_resolution_9` FOREIGN KEY (`id_resolution`) REFERENCES `resolutions` (`id_resolution`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `featured_image_has_resolution`
--

LOCK TABLES `featured_image_has_resolution` WRITE;
/*!40000 ALTER TABLE `featured_image_has_resolution` DISABLE KEYS */;
INSERT INTO `featured_image_has_resolution` VALUES (1,1,1,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/45f9f47c-9334-4e28-bd32-62997c17a7ed.jpg'),(2,1,2,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/e902bfde-707f-46bc-b203-2a9263dca6df.jpg'),(3,1,3,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/35626d84-955e-4c61-8a86-05b40223c6ce.jpg'),(4,1,4,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/52619f6d-5464-4d46-98fa-2e6a6cddb9e9.jpg'),(5,1,5,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/38727a91-3ac9-4c9c-b629-98ee82505ff4.jpg'),(6,1,6,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/34a7fa3d-ce7d-43da-ad29-9ef90fa0e0c3.jpg'),(7,1,7,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/e9f6d239-7b61-4842-93c9-72cc740b5163.jpg'),(8,1,8,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/e4b49511-c003-43bb-aa30-a9c36665f52d.jpg'),(9,1,9,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/0e363c59-e967-4b02-8ef6-e2c03fd1deb1.jpg'),(10,1,10,'http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/featured/1/1b287704-fe74-4b35-b199-77c8dea9a422.jpg');
/*!40000 ALTER TABLE `featured_image_has_resolution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `featured_images`
--

DROP TABLE IF EXISTS `featured_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `featured_images` (
  `id_featured_images` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_featured_images`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `featured_images`
--

LOCK TABLES `featured_images` WRITE;
/*!40000 ALTER TABLE `featured_images` DISABLE KEYS */;
INSERT INTO `featured_images` VALUES (1,'feature 1');
/*!40000 ALTER TABLE `featured_images` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_types`
--

LOCK TABLES `file_types` WRITE;
/*!40000 ALTER TABLE `file_types` DISABLE KEYS */;
INSERT INTO `file_types` VALUES (1,'image','image/jpeg'),(2,'audio','application/octet-stream'),(3,'image','image/png');
/*!40000 ALTER TABLE `file_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genders`
--

DROP TABLE IF EXISTS `genders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genders` (
  `id_gender` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_gender`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genders`
--

LOCK TABLES `genders` WRITE;
/*!40000 ALTER TABLE `genders` DISABLE KEYS */;
INSERT INTO `genders` VALUES (1,'Hombre'),(2,'Mujer'),(3,'Generico');
/*!40000 ALTER TABLE `genders` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instances`
--

LOCK TABLES `instances` WRITE;
/*!40000 ALTER TABLE `instances` DISABLE KEYS */;
INSERT INTO `instances` VALUES (1,'10.181.28.106','PIMP-04',1,0),(2,'10.182.0.213','PIMP-03',1,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=479 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (240,'Afrikaans','af',1),(241,'Afrikaans (South Africa)','af-ZA',0),(242,'Arabic','ar',0),(243,'Arabic (U.A.E.)','ar-AE',0),(244,'Arabic (Bahrain)','ar-BH',0),(245,'Arabic (Algeria)','ar-DZ',0),(246,'Arabic (Egypt)','ar-EG',0),(247,'Arabic (Iraq)','ar-IQ',0),(248,'Arabic (Jordan)','ar-JO',0),(249,'Arabic (Kuwait)','ar-KW',0),(250,'Arabic (Lebanon)','ar-LB',0),(251,'Arabic (Libya)','ar-LY',0),(252,'Arabic (Morocco)','ar-MA',0),(253,'Arabic (Oman)','ar-OM',0),(254,'Arabic (Qatar)','ar-QA',0),(255,'Arabic (Saudi Arabia)','ar-SA',0),(256,'Arabic (Syria)','ar-SY',0),(257,'Arabic (Tunisia)','ar-TN',0),(258,'Arabic (Yemen)','ar-YE',0),(259,'Azeri (Latin)','az',0),(260,'Azeri (Azerbaijan)','az-AZ',0),(262,'Belarusian','be',0),(263,'Belarusian (Belarus)','be-BY',0),(264,'Bulgarian','bg',0),(265,'Bulgarian (Bulgaria)','bg-BG',0),(266,'Bosnian (Bosnia and Herzegovina)','bs-BA',0),(267,'Catalan','ca',0),(268,'Catalan (Spain)','ca-ES',0),(269,'Czech','cs',0),(270,'Czech (Czech Republic)','cs-CZ',0),(271,'Welsh','cy',0),(272,'Welsh (United Kingdom)','cy-GB',0),(273,'Danish','da',0),(274,'Danish (Denmark)','da-DK',0),(275,'German','de',0),(276,'German (Austria)','de-AT',0),(277,'German (Switzerland)','de-CH',0),(278,'German (Germany)','de-DE',0),(279,'German (Liechtenstein)','de-LI',0),(280,'German (Luxembourg)','de-LU',0),(281,'Divehi','dv',0),(282,'Divehi (Maldives)','dv-MV',0),(283,'Greek','el',0),(284,'Greek (Greece)','el-GR',0),(285,'English','en',1),(286,'English (Australia)','en-AU',0),(287,'English (Belize)','en-BZ',0),(288,'English (Canada)','en-CA',0),(289,'English (Caribbean)','en-CB',0),(290,'English (United Kingdom)','en-GB',0),(291,'English (Ireland)','en-IE',0),(292,'English (Jamaica)','en-JM',0),(293,'English (New Zealand)','en-NZ',0),(294,'English (Republic of the Philippines)','en-PH',0),(295,'English (Trinidad and Tobago)','en-TT',0),(296,'English (United States)','en-US',0),(297,'English (South Africa)','en-ZA',0),(298,'English (Zimbabwe)','en-ZW',0),(299,'Esperanto','eo',0),(300,'Spanish','es',1),(301,'Spanish (Argentina)','es-AR',0),(302,'Spanish (Bolivia)','es-BO',0),(303,'Spanish (Chile)','es-CL',0),(304,'Spanish (Colombia)','es-CO',0),(305,'Spanish (Costa Rica)','es-CR',0),(306,'Spanish (Dominican Republic)','es-DO',0),(307,'Spanish (Ecuador)','es-EC',0),(308,'Spanish (Castilian-Spain)','es-ES',0),(310,'Spanish (Guatemala)','es-GT',0),(311,'Spanish (Honduras)','es-HN',0),(312,'Spanish (Mexico)','es-MX',0),(313,'Spanish (Nicaragua)','es-NI',0),(314,'Spanish (Panama)','es-PA',0),(315,'Spanish (Peru)','es-PE',0),(316,'Spanish (Puerto Rico)','es-PR',0),(317,'Spanish (Paraguay)','es-PY',0),(318,'Spanish (El Salvador)','es-SV',0),(319,'Spanish (Uruguay)','es-UY',0),(320,'Spanish (Venezuela)','es-VE',0),(321,'Estonian','et',0),(322,'Estonian (Estonia)','et-EE',0),(323,'Basque','eu',0),(324,'Basque (Spain)','eu-ES',0),(325,'Farsi','fa',0),(326,'Farsi (Iran)','fa-IR',0),(327,'Finnish','fi',0),(328,'Finnish (Finland)','fi-FI',0),(329,'Faroese','fo',0),(330,'Faroese (Faroe Islands)','fo-FO',0),(331,'French','fr',0),(332,'French (Belgium)','fr-BE',0),(333,'French (Canada)','fr-CA',0),(334,'French (Switzerland)','fr-CH',0),(335,'French (France)','fr-FR',0),(336,'French (Luxembourg)','fr-LU',0),(337,'French (Principality of Monaco)','fr-MC',0),(338,'Galician','gl',0),(339,'Galician (Spain)','gl-ES',0),(340,'Gujarati','gu',0),(341,'Gujarati (India)','gu-IN',0),(342,'Hebrew','he',0),(343,'Hebrew (Israel)','he-IL',0),(344,'Hindi','hi',0),(345,'Hindi (India)','hi-IN',0),(346,'Croatian','hr',0),(347,'Croatian (Bosnia and Herzegovina)','hr-BA',0),(348,'Croatian (Croatia)','hr-HR',0),(349,'Hungarian','hu',0),(350,'Hungarian (Hungary)','hu-HU',0),(351,'Armenian','hy',0),(352,'Armenian (Armenia)','hy-AM',0),(353,'Indonesian','id',0),(354,'Indonesian (Indonesia)','id-ID',0),(355,'Icelandic','is',0),(356,'Icelandic (Iceland)','is-IS',0),(357,'Italian','it',0),(358,'Italian (Switzerland)','it-CH',0),(359,'Italian (Italy)','it-IT',0),(360,'Japanese','ja',0),(361,'Japanese (Japan)','ja-JP',0),(362,'Georgian','ka',0),(363,'Georgian (Georgia)','ka-GE',0),(364,'Kazakh','kk',0),(365,'Kazakh (Kazakhstan)','kk-KZ',0),(366,'Kannada','kn',0),(367,'Kannada (India)','kn-IN',0),(368,'Korean','ko',0),(369,'Korean (Korea)','ko-KR',0),(370,'Konkani','kok',0),(371,'Konkani (India)','kok-IN',0),(372,'Kyrgyz','ky',0),(373,'Kyrgyz (Kyrgyzstan)','ky-KG',0),(374,'Lithuanian','lt',0),(375,'Lithuanian (Lithuania)','lt-LT',0),(376,'Latvian','lv',0),(377,'Latvian (Latvia)','lv-LV',0),(378,'Maori','mi',0),(379,'Maori (New Zealand)','mi-NZ',0),(380,'FYRO Macedonian','mk',0),(381,'FYRO Macedonian (Former Republic of Macedonia)','mk-MK',0),(382,'Mongolian','mn',0),(383,'Mongolian (Mongolia)','mn-MN',0),(384,'Marathi','mr',0),(385,'Marathi (India)','mr-IN',0),(386,'Malay','ms',0),(387,'Malay (Brunei Darussalam)','ms-BN',0),(388,'Malay (Malaysia)','ms-MY',0),(389,'Maltese','mt',0),(390,'Maltese (Malta)','mt-MT',0),(391,'Norwegian (Bokm?l)','nb',0),(392,'Norwegian (Bokm?l) (Norway)','nb-NO',0),(393,'Dutch','nl',0),(394,'Dutch (Belgium)','nl-BE',0),(395,'Dutch (Netherlands)','nl-NL',0),(396,'Norwegian (Nynorsk) (Norway)','nn-NO',0),(397,'Northern Sotho','ns',0),(398,'Northern Sotho (South Africa)','ns-ZA',0),(399,'Punjabi','pa',0),(400,'Punjabi (India)','pa-IN',0),(401,'Polish','pl',0),(402,'Polish (Poland)','pl-PL',0),(403,'Pashto','ps',0),(404,'Pashto (Afghanistan)','ps-AR',0),(405,'Portuguese','pt',1),(406,'Portuguese (Brazil)','pt-BR',0),(407,'Portuguese (Portugal)','pt-PT',0),(408,'Quechua','qu',0),(409,'Quechua (Bolivia)','qu-BO',0),(410,'Quechua (Ecuador)','qu-EC',0),(411,'Quechua (Peru)','qu-PE',0),(412,'Romanian','ro',0),(413,'Romanian (Romania)','ro-RO',0),(414,'Russian','ru',0),(415,'Russian (Russia)','ru-RU',0),(416,'Sanskrit','sa',0),(417,'Sanskrit (India)','sa-IN',0),(418,'Sami (Northern)','se',0),(419,'Sami (Finland)','se-FI',0),(422,'Sami (Norway)','se-NO',0),(425,'Sami (Sweden)','se-SE',0),(428,'Slovak','sk',0),(429,'Slovak (Slovakia)','sk-SK',0),(430,'Slovenian','sl',0),(431,'Slovenian (Slovenia)','sl-SI',0),(432,'Albanian','sq',0),(433,'Albanian (Albania)','sq-AL',0),(434,'Serbian (Bosnia and Herzegovina)','sr-BA',0),(436,'Serbian  (Serbia and Montenegro)','sr-SP',0),(438,'Swedish','sv',0),(439,'Swedish (Finland)','sv-FI',0),(440,'Swedish (Sweden)','sv-SE',0),(441,'Swahili','sw',0),(442,'Swahili (Kenya)','sw-KE',0),(443,'Syriac','syr',0),(444,'Syriac (Syria)','syr-SY',0),(445,'Tamil','ta',0),(446,'Tamil (India)','ta-IN',0),(447,'Telugu','te',0),(448,'Telugu (India)','te-IN',0),(449,'Thai','th',0),(450,'Thai (Thailand)','th-TH',0),(451,'Tagalog','tl',0),(452,'Tagalog (Philippines)','tl-PH',0),(453,'Tswana','tn',0),(454,'Tswana (South Africa)','tn-ZA',0),(455,'Turkish','tr',0),(456,'Turkish (Turkey)','tr-TR',0),(457,'Tatar','tt',0),(458,'Tatar (Russia)','tt-RU',0),(459,'Tsonga','ts',0),(460,'Ukrainian','uk',0),(461,'Ukrainian (Ukraine)','uk-UA',0),(462,'Urdu','ur',0),(463,'Urdu (Islamic Republic of Pakistan)','ur-PK',0),(464,'Uzbek (Latin)','uz',0),(465,'Uzbek (Uzbekistan)','uz-UZ',0),(467,'Vietnamese','vi',0),(468,'Vietnamese (Viet Nam)','vi-VN',0),(469,'Xhosa','xh',0),(470,'Xhosa (South Africa)','xh-ZA',0),(471,'Chinese','zh',0),(472,'Chinese (S)','zh-CN',0),(473,'Chinese (Hong Kong)','zh-HK',0),(474,'Chinese (Macau)','zh-MO',0),(475,'Chinese (Singapore)','zh-SG',0),(476,'Chinese (T)','zh-TW',0),(477,'Zulu','zu',0),(478,'Zulu (South Africa)','zu-ZA',0);
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
  KEY `ix_linked_account_user_10` (`user_id`),
  CONSTRAINT `fk_linked_account_user_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linked_account`
--

LOCK TABLES `linked_account` WRITE;
/*!40000 ALTER TABLE `linked_account` DISABLE KEYS */;
INSERT INTO `linked_account` VALUES (1,1,'$2a$10$z31M4Bmly.ricbfi9Ue2kejG62cHCrYHjlBSzlWtAYVrWwaZqTLoK','password'),(2,2,'$2a$10$oSM31J4qX/n4DKpxkPP2yO1OHBb/UewgK.41OveovxPEtajCjNtdy','password'),(3,3,'$2a$10$MmGn9/Jjr6UFqgqOCp6EVernDoo8l9ylR21ScXk5bxdCmuavxibmm','password'),(4,4,'$2a$10$Hc/S8sIU764PlpfuVWyX3eDNdTjE58oGILWPGmN9fA2ACeitOZVP6','password'),(5,5,'$2a$10$bqFsadoJ73jjwkRDpPnE5ODwxm.Gy3t00xH30IRo1viz/6vVCVg9e','password');
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
INSERT INTO `play_evolutions` VALUES (1,'da222f8da7e3c1339f8977b6c79d5aac1f171792','2014-12-04 15:55:01','create table categories (\nid_category               integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_categories primary key (id_category))\n;\n\ncreate table clients (\nid_client                 integer auto_increment not null,\nuser_id                   varchar(255),\nstatus                    integer,\nlogin                     varchar(255),\npassword                  varchar(255),\nlast_check_date           varchar(255),\nid_country                integer,\nid_gender                 integer,\nconstraint pk_clients primary key (id_client))\n;\n\ncreate table client_has_devices (\nid_client_has_devices     integer auto_increment not null,\nid_client                 integer,\nid_device                 integer,\nregistration_id           varchar(255),\nconstraint pk_client_has_devices primary key (id_client_has_devices))\n;\n\ncreate table client_has_theme (\nid_client_has_theme       integer auto_increment not null,\nid_client                 integer,\nid_theme                  integer,\nconstraint pk_client_has_theme primary key (id_client_has_theme))\n;\n\ncreate table configs (\nid_config                 bigint auto_increment not null,\nconfig_key                varchar(255),\nvalue                     varchar(255),\ndescription               varchar(255),\nconstraint pk_configs primary key (id_config))\n;\n\ncreate table countries (\nid_country                integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\nid_language               integer,\nconstraint pk_countries primary key (id_country))\n;\n\ncreate table devices (\nid_device                 integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_devices primary key (id_device))\n;\n\ncreate table featured_images (\nid_featured_images        integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_featured_images primary key (id_featured_images))\n;\n\ncreate table featured_image_has_resolution (\nid_featured_image_has_resolution integer auto_increment not null,\nid_featured_image         integer,\nid_resolution             integer,\nlink                      varchar(255),\nconstraint pk_featured_image_has_resolution primary key (id_featured_image_has_resolution))\n;\n\ncreate table file_types (\nid_file_type              integer auto_increment not null,\nname                      varchar(255),\nmime_type                 varchar(255),\nconstraint pk_file_types primary key (id_file_type))\n;\n\ncreate table genders (\nid_gender                 integer auto_increment not null,\nname                      varchar(255),\nconstraint pk_genders primary key (id_gender))\n;\n\ncreate table instances (\nid_instance               integer auto_increment not null,\nip                        varchar(255),\nname                      varchar(255),\nrunning                   integer,\ntest                      integer,\nconstraint pk_instances primary key (id_instance))\n;\n\ncreate table languages (\nid_language               integer auto_increment not null,\nname                      varchar(255),\nshort_name                varchar(255),\nactive                    integer,\nconstraint pk_languages primary key (id_language))\n;\n\ncreate table linked_account (\nid                        bigint auto_increment not null,\nuser_id                   bigint,\nprovider_user_id          varchar(255),\nprovider_key              varchar(255),\nconstraint pk_linked_account primary key (id))\n;\n\ncreate table post (\nid_post                   integer auto_increment not null,\nid_theme                  integer,\ndate                      varchar(255),\nsource                    varchar(255),\nid_social_network         integer,\nid_gender                 integer,\npush                      integer,\npush_date                 bigint,\nconstraint pk_post primary key (id_post))\n;\n\ncreate table post_has_countries (\nid_post_has_country       integer auto_increment not null,\nid_post                   integer,\nid_country                integer,\nconstraint pk_post_has_countries primary key (id_post_has_country))\n;\n\ncreate table post_has_localizations (\nid_post_has_localization  integer auto_increment not null,\nid_post                   integer,\nid_language               integer,\ntitle                     varchar(255),\ncontent                   varchar(255),\nconstraint pk_post_has_localizations primary key (id_post_has_localization))\n;\n\ncreate table post_has_media (\nid_post_has_media         integer auto_increment not null,\nid_post                   integer,\nid_file_type              integer,\nmd5                       varchar(255),\nlink                      varchar(255),\nmain_screen               integer,\nwidth                     integer,\nheight                    integer,\nconstraint pk_post_has_media primary key (id_post_has_media))\n;\n\ncreate table resolutions (\nid_resolution             integer auto_increment not null,\nwidth                     integer,\nheight                    integer,\nconstraint pk_resolutions primary key (id_resolution))\n;\n\ncreate table security_role (\nid                        bigint auto_increment not null,\nrole_name                 varchar(255),\nconstraint pk_security_role primary key (id))\n;\n\ncreate table social_networks (\nid_social_network         integer auto_increment not null,\nname                      varchar(255),\nhome                      varchar(255),\nconstraint pk_social_networks primary key (id_social_network))\n;\n\ncreate table themes (\nid_theme                  integer auto_increment not null,\nname                      varchar(255),\ndefault_photo             varchar(255),\nconstraint pk_themes primary key (id_theme))\n;\n\ncreate table theme_has_categories (\nid_theme_has_category     integer auto_increment not null,\nid_category               integer,\nid_theme                  integer,\nconstraint pk_theme_has_categories primary key (id_theme_has_category))\n;\n\ncreate table theme_has_social_network (\nid_theme_has_social_network integer auto_increment not null,\nid_theme                  integer,\nid_social_network         integer,\nlink                      varchar(255),\nconstraint pk_theme_has_social_network primary key (id_theme_has_social_network))\n;\n\ncreate table token_action (\nid                        bigint auto_increment not null,\ntoken                     varchar(255),\ntarget_user_id            bigint,\ntype                      varchar(2),\ncreated                   datetime,\nexpires                   datetime,\nconstraint ck_token_action_type check (type in (\'EV\',\'PR\')),\nconstraint uq_token_action_token unique (token),\nconstraint pk_token_action primary key (id))\n;\n\ncreate table users (\nid                        bigint auto_increment not null,\nemail                     varchar(255),\nname                      varchar(255),\nfirst_name                varchar(255),\nlast_name                 varchar(255),\nlast_login                datetime,\nactive                    tinyint(1) default 0,\nemail_validated           tinyint(1) default 0,\nconstraint pk_users primary key (id))\n;\n\ncreate table user_permission (\nid                        bigint auto_increment not null,\nvalue                     varchar(255),\nconstraint pk_user_permission primary key (id))\n;\n\n\ncreate table users_security_role (\nusers_id                       bigint not null,\nsecurity_role_id               bigint not null,\nconstraint pk_users_security_role primary key (users_id, security_role_id))\n;\n\ncreate table users_user_permission (\nusers_id                       bigint not null,\nuser_permission_id             bigint not null,\nconstraint pk_users_user_permission primary key (users_id, user_permission_id))\n;\nalter table clients add constraint fk_clients_country_1 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;\ncreate index ix_clients_country_1 on clients (id_country);\nalter table clients add constraint fk_clients_gender_2 foreign key (id_gender) references genders (id_gender) on delete restrict on update restrict;\ncreate index ix_clients_gender_2 on clients (id_gender);\nalter table client_has_devices add constraint fk_client_has_devices_client_3 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_devices_client_3 on client_has_devices (id_client);\nalter table client_has_devices add constraint fk_client_has_devices_device_4 foreign key (id_device) references devices (id_device) on delete restrict on update restrict;\ncreate index ix_client_has_devices_device_4 on client_has_devices (id_device);\nalter table client_has_theme add constraint fk_client_has_theme_client_5 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;\ncreate index ix_client_has_theme_client_5 on client_has_theme (id_client);\nalter table client_has_theme add constraint fk_client_has_theme_theme_6 foreign key (id_theme) references themes (id_theme) on delete restrict on update restrict;\ncreate index ix_client_has_theme_theme_6 on client_has_theme (id_theme);\nalter table countries add constraint fk_countries_language_7 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_countries_language_7 on countries (id_language);\nalter table featured_image_has_resolution add constraint fk_featured_image_has_resolution_featuredImage_8 foreign key (id_featured_image) references featured_images (id_featured_images) on delete restrict on update restrict;\ncreate index ix_featured_image_has_resolution_featuredImage_8 on featured_image_has_resolution (id_featured_image);\nalter table featured_image_has_resolution add constraint fk_featured_image_has_resolution_resolution_9 foreign key (id_resolution) references resolutions (id_resolution) on delete restrict on update restrict;\ncreate index ix_featured_image_has_resolution_resolution_9 on featured_image_has_resolution (id_resolution);\nalter table linked_account add constraint fk_linked_account_user_10 foreign key (user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_linked_account_user_10 on linked_account (user_id);\nalter table post add constraint fk_post_theme_11 foreign key (id_theme) references themes (id_theme) on delete restrict on update restrict;\ncreate index ix_post_theme_11 on post (id_theme);\nalter table post add constraint fk_post_socialNetwork_12 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;\ncreate index ix_post_socialNetwork_12 on post (id_social_network);\nalter table post add constraint fk_post_gender_13 foreign key (id_gender) references genders (id_gender) on delete restrict on update restrict;\ncreate index ix_post_gender_13 on post (id_gender);\nalter table post_has_countries add constraint fk_post_has_countries_post_14 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_countries_post_14 on post_has_countries (id_post);\nalter table post_has_countries add constraint fk_post_has_countries_country_15 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;\ncreate index ix_post_has_countries_country_15 on post_has_countries (id_country);\nalter table post_has_localizations add constraint fk_post_has_localizations_post_16 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_localizations_post_16 on post_has_localizations (id_post);\nalter table post_has_localizations add constraint fk_post_has_localizations_language_17 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;\ncreate index ix_post_has_localizations_language_17 on post_has_localizations (id_language);\nalter table post_has_media add constraint fk_post_has_media_post_18 foreign key (id_post) references post (id_post) on delete restrict on update restrict;\ncreate index ix_post_has_media_post_18 on post_has_media (id_post);\nalter table post_has_media add constraint fk_post_has_media_fileType_19 foreign key (id_file_type) references file_types (id_file_type) on delete restrict on update restrict;\ncreate index ix_post_has_media_fileType_19 on post_has_media (id_file_type);\nalter table theme_has_categories add constraint fk_theme_has_categories_category_20 foreign key (id_category) references categories (id_category) on delete restrict on update restrict;\ncreate index ix_theme_has_categories_category_20 on theme_has_categories (id_category);\nalter table theme_has_categories add constraint fk_theme_has_categories_theme_21 foreign key (id_theme) references themes (id_theme) on delete restrict on update restrict;\ncreate index ix_theme_has_categories_theme_21 on theme_has_categories (id_theme);\nalter table theme_has_social_network add constraint fk_theme_has_social_network_theme_22 foreign key (id_theme) references themes (id_theme) on delete restrict on update restrict;\ncreate index ix_theme_has_social_network_theme_22 on theme_has_social_network (id_theme);\nalter table theme_has_social_network add constraint fk_theme_has_social_network_socialNetwork_23 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;\ncreate index ix_theme_has_social_network_socialNetwork_23 on theme_has_social_network (id_social_network);\nalter table token_action add constraint fk_token_action_targetUser_24 foreign key (target_user_id) references users (id) on delete restrict on update restrict;\ncreate index ix_token_action_targetUser_24 on token_action (target_user_id);\n\n\n\nalter table users_security_role add constraint fk_users_security_role_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_security_role add constraint fk_users_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;\n\nalter table users_user_permission add constraint fk_users_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;','SET FOREIGN_KEY_CHECKS=0;\n\ndrop table categories;\n\ndrop table clients;\n\ndrop table client_has_devices;\n\ndrop table client_has_theme;\n\ndrop table configs;\n\ndrop table countries;\n\ndrop table devices;\n\ndrop table featured_images;\n\ndrop table featured_image_has_resolution;\n\ndrop table file_types;\n\ndrop table genders;\n\ndrop table instances;\n\ndrop table languages;\n\ndrop table linked_account;\n\ndrop table post;\n\ndrop table post_has_countries;\n\ndrop table post_has_localizations;\n\ndrop table post_has_media;\n\ndrop table resolutions;\n\ndrop table security_role;\n\ndrop table social_networks;\n\ndrop table themes;\n\ndrop table theme_has_categories;\n\ndrop table theme_has_social_network;\n\ndrop table token_action;\n\ndrop table users;\n\ndrop table users_security_role;\n\ndrop table users_user_permission;\n\ndrop table user_permission;\n\nSET FOREIGN_KEY_CHECKS=1;','applied','');
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
  `id_theme` int(11) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `id_social_network` int(11) DEFAULT NULL,
  `id_gender` int(11) DEFAULT NULL,
  `push` int(11) DEFAULT NULL,
  `push_date` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id_post`),
  KEY `ix_post_theme_11` (`id_theme`),
  KEY `ix_post_socialNetwork_12` (`id_social_network`),
  KEY `ix_post_gender_13` (`id_gender`),
  CONSTRAINT `fk_post_gender_13` FOREIGN KEY (`id_gender`) REFERENCES `genders` (`id_gender`),
  CONSTRAINT `fk_post_socialNetwork_12` FOREIGN KEY (`id_social_network`) REFERENCES `social_networks` (`id_social_network`),
  CONSTRAINT `fk_post_theme_11` FOREIGN KEY (`id_theme`) REFERENCES `themes` (`id_theme`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,1,'201411071236','http://instagram.com/p/u1Y5UapnTr/',1,1,1,1415363793540),(2,2,'201411071538','http://instagram.com/p/upDi3Ww-eu/?modal=true',1,1,1,1415374705844),(3,2,'201411071540','http://instagram.com/p/uepC59Q-Sn/?modal=true',1,1,1,1415374815321),(4,3,'201411071605','http://instagram.com/p/uy12lHKdDI/',1,1,1,1415376341229),(5,4,'201411071636','http://instagram.com/p/vHBdI1S4-2/',1,1,1,1415378216573),(6,2,'201411121708','http://instagram.com/luibarross',1,1,1,1415812092460),(7,5,'201411131626','https://twitter.com/gabiwolscham',3,1,1,1415895965706);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_has_countries`
--

LOCK TABLES `post_has_countries` WRITE;
/*!40000 ALTER TABLE `post_has_countries` DISABLE KEYS */;
INSERT INTO `post_has_countries` VALUES (2,1,3),(3,2,3),(4,3,3),(5,4,3),(6,5,3),(7,6,3),(8,7,3);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_has_localizations`
--

LOCK TABLES `post_has_localizations` WRITE;
/*!40000 ALTER TABLE `post_has_localizations` DISABLE KEYS */;
INSERT INTO `post_has_localizations` VALUES (2,1,405,'Katie Buehl suicide gata','Katie Buehl é natural Maryland menina está louco. Ele gosta de se comportar mal e tem tatuagens para provar isso.'),(3,2,405,'Fisher dos homens','Luiza Barros é uma menina que vai pescar com arpão, o peixe, temos todos a sua conta Instagram. Uma mistura de pescar com curvas.'),(4,3,405,'Luiza volta','Aqui uma foto de Luiza para trás, mantendo um peixe no porão.'),(5,4,405,'Domina-lo com a sua música','Niykee Heaton é uma modelo, cantora e escritora de música. quente e talentoso, o que mais se pode pedir'),(6,5,405,'Emily Sears es la Australiana que te volverá loco','sua tia era um modelo e ela agora é modelo, o sangue corre rico.'),(7,6,405,'o pescador de homens retornar para suas andanças','Luiza publicou recentemente estas imagens que nos mostra suas roupas de pesca e pequenos para o fazer.'),(8,7,405,'Gabi Wolscham paraguaio playmate que vai deixá-lo louco.','o que você tem em sua conta no Twitter que não podemos resolver aqui, mas você está convidado a seguir, é uma demência.');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_has_media`
--

LOCK TABLES `post_has_media` WRITE;
/*!40000 ALTER TABLE `post_has_media` DISABLE KEYS */;
INSERT INTO `post_has_media` VALUES (2,1,1,'a701a4b3f946356e938547e988431d0d','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/1/83c3094d-e3bc-42a6-b745-c4cfc6a5722b.jpg',640,640),(3,2,1,'096649c18c43417de5abf0cd27f3d5a6','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/2/dd8cba20-9309-4197-8383-b9de80e3330c.jpg',640,640),(4,3,1,'0b0eb2fb8025214b969ee21ad3ec8206','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/2/753d5752-c61b-48ac-a765-32b07f21604f.jpg',640,640),(5,4,1,'64196826d0065d408c5159cfd0429194','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/3/46944b6b-828f-4a7d-9c5c-194d72b02257.jpg',640,640),(6,4,1,'1e3bf97ae69e6a5a6e06b1e152b758eb','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/3/21057a9a-10f9-44e2-bce2-0ff6420e1c79.jpg',640,640),(7,4,1,'49b33d74f30b05d7fa637273db0a4b8d','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/3/6077ee2e-0864-42be-a6ad-3786e74a3a65.jpg',640,640),(8,5,1,'d6e3fb3e4b095553cbf774b73a9070cb','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/4/fd8c3e6d-627b-4d46-a271-67144fedd83b.jpg',640,640),(9,5,1,'da54f37df5af14761e2efdc80cc8fa58','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/4/d60f48cf-a45d-4cb2-a84d-12a32652a006.jpg',640,640),(10,5,1,'4c2484e398dde46898bdeefcff48208e','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/4/4df1e076-d6c6-487f-a28a-8aebd2d19b4c.jpg',640,640),(11,5,1,'39b1b44845eb54a9ba338eed4997a5d2','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/4/075c6d6b-295e-43e5-b162-9bd64c1ec108.jpg',640,640),(12,5,1,'134450c04319f70da03885b7c1d87ff5','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/4/edd202ad-6ad6-4ef1-9a81-f526f85187ca.jpg',640,640),(13,6,1,'d4900621d925d69dea048a35d1721563','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/2/9aa6e0f5-d45d-4234-8ca9-a280486df08f.jpg',640,640),(14,6,1,'7be635d9ea2a23c194d35721941180c6','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/2/1e28c71e-a092-4d3d-ac3f-0ebf101aa8c8.jpg',640,640),(15,6,1,'830650a552d124e1f9c519d8b3a788d7','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/2/20b1c975-c867-4dfc-ad28-5112d3214c3d.jpg',640,640),(16,6,1,'4f54a983df83cf9222cc75f65a636aa2','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/2/4e51865f-3cd7-4e56-b9db-52f751e8654c.jpg',640,640),(17,7,3,'2e647e82df30fe2594032b66b95b46ca','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/5/0353d4d4-6dc5-4162-8e80-1e9c2ad53db9.png',575,862),(18,7,3,'1976fdb21753289d9cb1d784985cda62','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/5/6335bd0d-a5a8-470a-b249-c7ad93331449.png',533,796),(19,7,3,'e8b8cdb2ac22d34bf770327ffcff51f7','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/5/11805935-7bc5-459f-90ef-2606b6ba27bd.png',525,796),(20,7,3,'4d2737a6d23c02b56c67bdd1e6823cba','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/5/a608eede-8c0a-412b-b8e7-103848d93ee4.png',684,1017);
/*!40000 ALTER TABLE `post_has_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resolutions`
--

DROP TABLE IF EXISTS `resolutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resolutions` (
  `id_resolution` int(11) NOT NULL AUTO_INCREMENT,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_resolution`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resolutions`
--

LOCK TABLES `resolutions` WRITE;
/*!40000 ALTER TABLE `resolutions` DISABLE KEYS */;
INSERT INTO `resolutions` VALUES (1,640,1136),(2,1080,1920),(3,640,960),(4,720,1280),(5,480,800),(6,540,960),(7,320,480),(8,480,854),(9,768,1280),(10,240,320);
/*!40000 ALTER TABLE `resolutions` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_networks`
--

LOCK TABLES `social_networks` WRITE;
/*!40000 ALTER TABLE `social_networks` DISABLE KEYS */;
INSERT INTO `social_networks` VALUES (1,'instagram','http://instagram.com/'),(2,'facebook','https://www.facebook.com/'),(3,'twitter','https://twitter.com/'),(4,'web',NULL);
/*!40000 ALTER TABLE `social_networks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theme_has_categories`
--

DROP TABLE IF EXISTS `theme_has_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `theme_has_categories` (
  `id_theme_has_category` int(11) NOT NULL AUTO_INCREMENT,
  `id_category` int(11) DEFAULT NULL,
  `id_theme` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_theme_has_category`),
  KEY `ix_theme_has_categories_category_20` (`id_category`),
  KEY `ix_theme_has_categories_theme_21` (`id_theme`),
  CONSTRAINT `fk_theme_has_categories_category_20` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`),
  CONSTRAINT `fk_theme_has_categories_theme_21` FOREIGN KEY (`id_theme`) REFERENCES `themes` (`id_theme`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theme_has_categories`
--

LOCK TABLES `theme_has_categories` WRITE;
/*!40000 ALTER TABLE `theme_has_categories` DISABLE KEYS */;
INSERT INTO `theme_has_categories` VALUES (2,8,2),(3,6,3),(4,6,4),(5,5,1),(6,7,1),(7,6,5);
/*!40000 ALTER TABLE `theme_has_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theme_has_social_network`
--

DROP TABLE IF EXISTS `theme_has_social_network`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `theme_has_social_network` (
  `id_theme_has_social_network` int(11) NOT NULL AUTO_INCREMENT,
  `id_theme` int(11) DEFAULT NULL,
  `id_social_network` int(11) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_theme_has_social_network`),
  KEY `ix_theme_has_social_network_theme_22` (`id_theme`),
  KEY `ix_theme_has_social_network_socialNetwork_23` (`id_social_network`),
  CONSTRAINT `fk_theme_has_social_network_socialNetwork_23` FOREIGN KEY (`id_social_network`) REFERENCES `social_networks` (`id_social_network`),
  CONSTRAINT `fk_theme_has_social_network_theme_22` FOREIGN KEY (`id_theme`) REFERENCES `themes` (`id_theme`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theme_has_social_network`
--

LOCK TABLES `theme_has_social_network` WRITE;
/*!40000 ALTER TABLE `theme_has_social_network` DISABLE KEYS */;
INSERT INTO `theme_has_social_network` VALUES (2,2,1,'http://instagram.com/luibarross'),(3,3,1,'http://instagram.com/niykeeheaton'),(4,4,4,'http://www.emilysears.com/'),(5,4,1,'http://instagram.com/emilysears'),(6,1,1,'http://instagram.com/kkbuehl'),(7,5,3,'https://twitter.com/gabiwolscham'),(8,5,1,'');
/*!40000 ALTER TABLE `theme_has_social_network` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `themes`
--

DROP TABLE IF EXISTS `themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `themes` (
  `id_theme` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `default_photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_theme`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `themes`
--

LOCK TABLES `themes` WRITE;
/*!40000 ALTER TABLE `themes` DISABLE KEYS */;
INSERT INTO `themes` VALUES (1,'Katie Buehl','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/1/ddb4e6cf-ff12-4cd8-b8d0-729eed58525bn.jpg'),(2,'Luiza Barros','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/2/89781897-3b82-4899-8f3f-f993e7b108e12.jpg'),(3,'Niykee Heaton','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/3/d10f796e-22d6-4863-a185-8ec2785d9c0dg.jpg'),(4,'Emily Sears','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/4/b87bfb6f-5dab-4004-903a-545aef3f05a21.jpg'),(5,'Gaby Wolscham','http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/5/89d06780-8d1d-4729-8839-34c6314a9a42M.png');
/*!40000 ALTER TABLE `themes` ENABLE KEYS */;
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
  KEY `ix_token_action_targetUser_24` (`target_user_id`),
  CONSTRAINT `fk_token_action_targetUser_24` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'inaki@hecticus.com','inaki',NULL,NULL,'2014-11-10 15:50:02',1,1),(2,'christian@hecticus.com','Christian',NULL,NULL,'2014-11-13 21:55:15',1,1),(3,'alil@hecticus.com','Alí Buanaño',NULL,NULL,'2014-10-30 21:19:24',1,1),(4,'alejandro@hecticus.com','Alejandro Carvallo',NULL,NULL,'2014-11-13 21:54:47',1,1),(5,'juan@hecticus.com','Juan Ramirez',NULL,NULL,'2014-11-07 20:12:12',1,1);
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

-- Dump completed on 2014-12-04 15:27:54
