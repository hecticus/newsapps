ALTER TABLE `football_brazil`.`client_bets` 
ADD COLUMN `id_phase` INT(11) NULL AFTER `id_tournament`;

ALTER TABLE `football_brazil`.`leaderboard` 
ADD COLUMN `id_phase` INT(11) NULL AFTER `id_tournament`;

ALTER TABLE `football_brazil`.`leaderboard_global` 
ADD COLUMN `id_tournament` INT(11) NULL AFTER `id_client`;