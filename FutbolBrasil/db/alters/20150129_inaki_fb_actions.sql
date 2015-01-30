CREATE TABLE `football_brazil`.`actions` (
  `id_action` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `msg` VARCHAR(100) NULL,
  `ext_id` INT NULL,
  PRIMARY KEY (`id_action`))
ENGINE = InnoDB;
