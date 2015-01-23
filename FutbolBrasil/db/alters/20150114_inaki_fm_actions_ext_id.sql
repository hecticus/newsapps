ALTER TABLE `football_manager`.`actions` 
ADD COLUMN `ext_id` INT NULL AFTER `description`,
DROP INDEX `uq_actions_1` ,
ADD UNIQUE INDEX `uq_ext_id_1` (`ext_id` ASC);
