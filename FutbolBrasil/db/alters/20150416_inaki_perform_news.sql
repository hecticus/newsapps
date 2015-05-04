ALTER TABLE `football_manager`.`news` 
CHANGE COLUMN `keyword` `keyword` TEXT NULL DEFAULT NULL ,
CHANGE COLUMN `updated_date` `updated_date` BIGINT NULL DEFAULT NULL ,
CHANGE COLUMN `external_id` `external_id` VARCHAR(45) NULL DEFAULT NULL ;


ALTER TABLE `football_manager`.`resources` 
CHANGE COLUMN `metadata` `external_id` VARCHAR(45) NULL DEFAULT NULL ;

ALTER TABLE `football_manager`.`resources` 
ADD COLUMN `md5` VARCHAR(45) NULL AFTER `news_id_news`;

INSERT INTO `football_manager`.`configs` (`key_name`, `value`) VALUES ('perform_image_host', 'images.performgroup.com');



