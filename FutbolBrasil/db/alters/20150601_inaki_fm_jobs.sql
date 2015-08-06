
ALTER TABLE `football_manager`.`jobs` 
ADD COLUMN `running` TINYINT NULL AFTER `daemon`,
ADD COLUMN `id_instance` INT NULL AFTER `running`,
ADD INDEX `fk_jobs_instance_1_idx` (`id_instance` ASC);
ALTER TABLE `football_manager`.`jobs` 
ADD CONSTRAINT `fk_jobs_instance_1`
  FOREIGN KEY (`id_instance`)
  REFERENCES `football_manager`.`instances` (`id_instance`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
