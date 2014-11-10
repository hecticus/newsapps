ALTER TABLE `pimp`.`post_has_media` 
ADD COLUMN `width` INT NOT NULL DEFAULT 0 AFTER `main_screen`,
ADD COLUMN `height` INT NOT NULL DEFAULT 0 AFTER `width`;
