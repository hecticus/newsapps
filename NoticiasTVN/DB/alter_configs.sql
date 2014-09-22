CREATE  TABLE `configs` (
  `id_config` INT NOT NULL AUTO_INCREMENT ,
  `key` VARCHAR(50) NOT NULL ,
  `value` TEXT NOT NULL ,
  `description` TEXT NULL ,
  PRIMARY KEY (`id_config`) );
