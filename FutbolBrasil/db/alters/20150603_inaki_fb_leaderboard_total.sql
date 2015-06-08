CREATE TABLE `leaderboard_total` (
  `id_leaderboard_total` int(11) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `correct_bets` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_leaderboard_total`),
  UNIQUE KEY `uq_leaderboard_total_client` (`id_client`),
  KEY `fk_leaderboard_total_1_idx` (`id_client`),
  CONSTRAINT `fk_leaderboard_total_1` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
