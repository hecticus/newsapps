CREATE TABLE `football_manager`.`game_match_status` (
  `id_game_match_status` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `ext_id` INT NULL,
  PRIMARY KEY (`id_game_match_status`),
  UNIQUE INDEX `ext_id_UNIQUE` (`ext_id` ASC))
ENGINE = InnoDB;


ALTER TABLE `football_manager`.`game_matches` 
CHANGE COLUMN `status` `status` INT NULL DEFAULT NULL ;

update football_manager.game_matches set status = 1 where status = 0;


ALTER TABLE `football_manager`.`game_matches` 
ADD CONSTRAINT `fk_status`
  FOREIGN KEY (`status`)
  REFERENCES `football_manager`.`game_match_status` (`id_game_match_status`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `football_manager`.`game_matches` 
DROP FOREIGN KEY `fk_status`;
ALTER TABLE `football_manager`.`game_matches` 
CHANGE COLUMN `status` `id_game_match_status` INT(11) NULL DEFAULT NULL ;
ALTER TABLE `football_manager`.`game_matches` 
ADD CONSTRAINT `fk_status`
  FOREIGN KEY (`id_game_match_status`)
  REFERENCES `football_manager`.`game_match_status` (`id_game_match_status`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;








