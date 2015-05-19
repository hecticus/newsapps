CREATE TABLE `instances` (
  `id_instance` bigint(20) NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `running` int(11) DEFAULT NULL,
  `test` int(11) DEFAULT NULL,
  `master` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_instance`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `jobs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `status` int(11) DEFAULT NULL,
  `class_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `params` varchar(255) DEFAULT NULL,
  `id_app` int(11) DEFAULT NULL,
  `next_timestamp` bigint(20) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `time_params` varchar(255) DEFAULT NULL,
  `frequency` int(11) DEFAULT NULL,
  `daemon` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `tvn_admin`.`configs` (`id_config`, `key`, `value`, `description`) VALUES (NULL, 'server-ip-file', '/Users/plesse/Documents/projects/PMC/server_ip', 'ip del sevidor');
INSERT INTO `tvn_admin`.`configs` (`id_config`, `key`, `value`, `description`) VALUES (NULL, 'app-name', 'tvn-admin', 'Pais o aplicacion de la instacia');
INSERT INTO `tvn_admin`.`configs` (`id_config`, `key`, `value`, `description`) VALUES (NULL, 'job-delay', '10', 'delay de ejecucion de un job en segundos');
INSERT INTO `tvn_admin`.`configs` (`id_config`, `key`, `value`, `description`) VALUES (NULL, 'jobs-keep-alive-allowed', '30000', 'Tiempo en milisegundos para determinar timeout del job. Default 3600000');
INSERT INTO `tvn_admin`.`configs` (`key`, `value`, `description`) VALUES ('cdn-container', 'tvnimg', 'container en rackspace');

