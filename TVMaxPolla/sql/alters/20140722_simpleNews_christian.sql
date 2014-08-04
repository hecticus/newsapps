CREATE  TABLE `tvmax_polla_admin`.`news_category` (
  `id_news_category` INT NOT NULL AUTO_INCREMENT ,
  `display_name` VARCHAR(255) NOT NULL ,
  `keywords` TEXT NOT NULL ,
  `status` INT NOT NULL DEFAULT 0 ,
  PRIMARY KEY (`id_news_category`) );


CREATE  TABLE `tvmax_polla_admin`.`tvmax_simple_news` (
  `id_news` BIGINT(20) NOT NULL AUTO_INCREMENT ,
  `external_id` BIGINT(20) NOT NULL ,
  `title` TEXT NOT NULL ,
  `main` TINYINT(1) NOT NULL DEFAULT 0 ,
  `received_date` VARCHAR(255) NOT NULL ,
  `category` VARCHAR(255) NOT NULL ,
  `sub_category` VARCHAR(255) NULL ,
  `image` VARCHAR(255) NULL ,
  `news_text` TEXT NULL ,
  PRIMARY KEY (`id_news`) );

ALTER TABLE `tvmax_polla_admin`.`news_category` ADD COLUMN `id_category` INT(11) NOT NULL DEFAULT 0  AFTER `status` ;



INSERT INTO `tvmax_polla_admin`.`news_category` (`display_name`, `keywords`, `status`, `id_category`) VALUES ('Principales', 'Main', '1', '46');
INSERT INTO `tvmax_polla_admin`.`news_category` (`display_name`, `keywords`, `status`, `id_category`) VALUES ('Fútbol', 'Fútbol', '1', '46');
INSERT INTO `tvmax_polla_admin`.`news_category` (`display_name`, `keywords`, `status`, `id_category`) VALUES ('Béisbol', 'Béisbol', '1', '46');
INSERT INTO `tvmax_polla_admin`.`news_category` (`display_name`, `keywords`, `status`, `id_category`) VALUES ('Boxeo', 'Boxeo', '1', '46');
INSERT INTO `tvmax_polla_admin`.`news_category` (`display_name`, `keywords`, `status`, `id_category`) VALUES ('Otros', 'Otros', '1', '46');


ALTER TABLE `tvmax_polla_admin`.`news_category` ADD COLUMN `main` TINYINT(1) NOT NULL DEFAULT 0  AFTER `id_category` ;

UPDATE `tvmax_polla_admin`.`news_category` SET `main`='1' WHERE `id_news_category`='1';

ALTER TABLE `tvmax_polla_admin`.`tvmax_simple_news` ADD COLUMN `crc` VARCHAR(255) NOT NULL  AFTER `news_text` , ADD COLUMN `inserted_time` BIGINT(20) NOT NULL  AFTER `crc` , ADD COLUMN `generated` TINYINT(1) NOT NULL DEFAULT 0  AFTER `inserted_time` , ADD COLUMN `generation_time` BIGINT(20) NOT NULL DEFAULT 0  AFTER `generated` , ADD COLUMN `pub_date_formated` BIGINT(20) NULL DEFAULT NULL  AFTER `generation_time` ;


INSERT INTO `tvmax_polla_admin`.`category` (`name`, `id_team`) VALUES ('Fútbol', '2');
INSERT INTO `tvmax_polla_admin`.`category` (`name`, `id_team`) VALUES ('Béisbol', '3');
INSERT INTO `tvmax_polla_admin`.`category` (`name`, `id_team`) VALUES ('Boxeo', '4');
INSERT INTO `tvmax_polla_admin`.`category` (`name`, `id_team`) VALUES ('Otros', '5');
INSERT INTO `tvmax_polla_admin`.`category` (`name`, `id_team`) VALUES ('Principales', '1');


ALTER TABLE `tvmax_polla_admin`.`news_category` ADD COLUMN `sort` INT(11) NOT NULL DEFAULT 0  AFTER `main` ;

UPDATE `tvmax_polla_admin`.`news_category` SET `sort`='1' WHERE `id_news_category`='1';
UPDATE `tvmax_polla_admin`.`news_category` SET `sort`='2' WHERE `id_news_category`='2';
UPDATE `tvmax_polla_admin`.`news_category` SET `sort`='3' WHERE `id_news_category`='3';
UPDATE `tvmax_polla_admin`.`news_category` SET `sort`='4' WHERE `id_news_category`='4';
UPDATE `tvmax_polla_admin`.`news_category` SET `sort`='5' WHERE `id_news_category`='5';


INSERT INTO `tvmax_polla_admin`.`actions` (`id_action`, `name`, `template`, `pushable`) VALUES ('17', 'Principales', 'Principales', '0');
INSERT INTO `tvmax_polla_admin`.`actions` (`id_action`, `name`, `template`, `pushable`) VALUES ('18', 'Fútbol', 'Fútbol', '0');
INSERT INTO `tvmax_polla_admin`.`actions` (`id_action`, `name`, `template`, `pushable`) VALUES ('19', 'Béisbol', 'Béisbol', '0');
INSERT INTO `tvmax_polla_admin`.`actions` (`id_action`, `name`, `template`, `pushable`) VALUES ('20', 'Boxeo', 'Boxeo', '0');
INSERT INTO `tvmax_polla_admin`.`actions` (`id_action`, `name`, `template`, `pushable`) VALUES ('21', 'Otros', 'Otros', '0');



UPDATE `tvmax_polla_admin`.`news_category` SET `keywords`='Principales' WHERE `id_news_category`='1';



ALTER TABLE `tvmax_polla_admin`.`news_category` ADD COLUMN `id_action` INT(11) NOT NULL DEFAULT 0  AFTER `id_category` ;

UPDATE `tvmax_polla_admin`.`news_category` SET `id_category`='75', `id_action`='18' WHERE `id_news_category`='2';
UPDATE `tvmax_polla_admin`.`news_category` SET `id_category`='76', `id_action`='19' WHERE `id_news_category`='3';
UPDATE `tvmax_polla_admin`.`news_category` SET `id_category`='77', `id_action`='20' WHERE `id_news_category`='4';
UPDATE `tvmax_polla_admin`.`news_category` SET `id_category`='78', `id_action`='21' WHERE `id_news_category`='5';
UPDATE `tvmax_polla_admin`.`news_category` SET `id_category`='79', `id_action`='17' WHERE `id_news_category`='1';


