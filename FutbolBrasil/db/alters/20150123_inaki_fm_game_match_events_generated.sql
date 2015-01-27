ALTER TABLE `football_manager`.`game_match_events` 
ADD COLUMN `generated` TINYINT(1) NOT NULL DEFAULT 0 AFTER `ext_id`;

ALTER TABLE `football_manager`.`news` 
ADD COLUMN `generated` TINYINT(1) NOT NULL DEFAULT 0 AFTER `crc`;

INSERT INTO `football_manager`.`configs` (`key_name`, `value`, `description`) VALUES ('push-all-news', '1', 'flag para enviar todas las noticias o solo las featured');

INSERT INTO `football_brazil`.`configs` (`key_name`, `value`, `description`) VALUES ('football-manager-url', 'footballmanager.hecticus.com', 'host del football manager');

