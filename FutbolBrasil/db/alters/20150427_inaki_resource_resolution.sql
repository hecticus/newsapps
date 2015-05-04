CREATE TABLE `resolutions` (
  `id_resolution` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_resolution`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `football_manager_2`.`resources` 
ADD COLUMN `id_resolution` INT NULL AFTER `md5`,
ADD INDEX `fk_resolution_idx` (`id_resolution` ASC);
ALTER TABLE `football_manager_2`.`resources` 
ADD CONSTRAINT `fk_resolution`
  FOREIGN KEY (`id_resolution`)
  REFERENCES `football_manager_2`.`resolutions` (`id_resolution`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
