CREATE TABLE `genders` (
  `id_gender` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_gender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `pimp`.`genders` (`id_gender`, `name`) VALUES ('1', 'Hombre');
INSERT INTO `pimp`.`genders` (`id_gender`, `name`) VALUES ('2', 'Mujer');
INSERT INTO `pimp`.`genders` (`id_gender`, `name`) VALUES ('3', 'Generico');

ALTER TABLE `pimp`.`post` 
ADD COLUMN `id_gender` INT NULL AFTER `push_date`,
ADD INDEX `fk_id_gender_idx` (`id_gender` ASC);
ALTER TABLE `pimp`.`post` 
ADD CONSTRAINT `fk_id_gender`
  FOREIGN KEY (`id_gender`)
  REFERENCES `pimp`.`genders` (`id_gender`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `pimp`.`clients` 
ADD COLUMN `id_gender` INT NULL AFTER `id_country`,
ADD INDEX `fk_id_gender_client_idx` (`id_gender` ASC);
ALTER TABLE `pimp`.`clients` 
ADD CONSTRAINT `fk_id_gender_client`
  FOREIGN KEY (`id_gender`)
  REFERENCES `pimp`.`genders` (`id_gender`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


