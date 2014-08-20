INSERT INTO `tvmax_polla_admin`.`configs` (`id_config`, `key`, `value`, `description`) VALUES ('', 'banner-interval', '60000', 'Rotación de banners en la app de tvn');

CREATE TABLE `banners` (
  `id_banner` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `sort` int(11) DEFAULT 0,
  PRIMARY KEY (`id_banner`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `banner_files` (
  `id_banner_file` bigint(20) NOT NULL AUTO_INCREMENT,
  `banner_id_banner` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `width` int(11) DEFAULT 0,
  `height` int(11) DEFAULT 0,
  PRIMARY KEY (`id_banner_file`),
  KEY `ix_banner_files_banners_1` (`banner_id_banner`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;