
CREATE TABLE `u02_profiles` (
  `u02_id` int(11) NOT NULL AUTO_INCREMENT,
  `u02_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`u02_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8


INSERT INTO `tvn_admin`.`u02_profiles` (`u02_name`) VALUES ('Administrator');
INSERT INTO `tvn_admin`.`u02_profiles` (`u02_name`) VALUES ('User');


CREATE TABLE `u01_users` (
  `u01_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `u01_login` varchar(255) DEFAULT NULL,
  `u01_password` varchar(255) DEFAULT NULL,
  `u01_email` varchar(255) DEFAULT NULL,
  `profiles_u02_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`u01_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8

INSERT INTO `tvn_admin`.`u01_users` (`u01_login`, `u01_password`, `u01_email`, `profiles_u02_id`) VALUES ('admin', '$2a$10$qCupCLirPXlZRMu2GbVA.ezJ0BctwuidUvqXaXNbdrUXGNfQnTKPy', 'admin@hecticus.com', 1);



