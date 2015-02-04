ALTER TABLE `football_brazil`.`clients` 
ADD COLUMN `id_language` INT(11) NULL AFTER `id_country`,
ADD INDEX `fk_clients_language_1_idx` (`id_language` ASC);
ALTER TABLE `football_brazil`.`clients` 
ADD CONSTRAINT `fk_clients_language_1`
  FOREIGN KEY (`id_language`)
  REFERENCES `football_brazil`.`languages` (`id_language`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
