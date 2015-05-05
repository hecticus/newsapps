ALTER TABLE `football_brazil`.`actions` 
ADD COLUMN `id_language` INT NULL AFTER `ext_id`,
ADD INDEX `fk_language_action_idx` (`id_language` ASC);
ALTER TABLE `football_brazil`.`actions` 
ADD CONSTRAINT `fk_language_action`
  FOREIGN KEY (`id_language`)
  REFERENCES `football_brazil`.`languages` (`id_language`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
