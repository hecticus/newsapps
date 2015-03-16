CREATE TABLE `groups` (
  `id_group` int(11) NOT NULL AUTO_INCREMENT,
  `id_competition` bigint(20) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_group`),
  UNIQUE KEY `uq_competition_name` (`id_competition`,`name`),
  KEY `fk_group_competition_idx` (`id_competition`),
  CONSTRAINT `fk_group_competition` FOREIGN KEY (`id_competition`) REFERENCES `competitions` (`id_competitions`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `group_has_localization` (
  `id_group_has_localization` int(11) NOT NULL AUTO_INCREMENT,
  `id_group` int(11) DEFAULT NULL,
  `id_language` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_group_has_localization`),
  KEY `fk_group_loc_group_idx` (`id_group`),
  KEY `fk_group_loc_language_idx` (`id_language`),
  CONSTRAINT `fk_group_loc_group` FOREIGN KEY (`id_group`) REFERENCES `groups` (`id_group`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_group_loc_language` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id_language`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `football_manager`.`ranking` 
ADD COLUMN `id_group` INT NULL AFTER `streak`,
ADD INDEX `fk_ranking_group_idx` (`id_group` ASC);
ALTER TABLE `football_manager`.`ranking` 
ADD CONSTRAINT `fk_ranking_group`
  FOREIGN KEY (`id_group`)
  REFERENCES `football_manager`.`groups` (`id_group`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;