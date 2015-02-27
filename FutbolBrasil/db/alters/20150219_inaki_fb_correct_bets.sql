ALTER TABLE `football_brazil`.`leaderboard` 
ADD COLUMN `correct_bets` INT(11) NULL AFTER `score`;

ALTER TABLE `football_brazil`.`leaderboard_global` 
ADD COLUMN `correct_bets` INT(11) NULL AFTER `score`;

