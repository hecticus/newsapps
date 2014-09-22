
CREATE TABLE `banner_resolution` (
  `id_banner_resolution` bigint(20) NOT NULL AUTO_INCREMENT,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_banner_resolution`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1


INSERT INTO `banner_resolution` (`width`, `height`) VALUES (540, 54);
INSERT INTO `banner_resolution` (`width`, `height`) VALUES (720, 72);
INSERT INTO `banner_resolution` (`width`, `height`) VALUES (800, 80);
INSERT INTO `banner_resolution` (`width`, `height`) VALUES (1080, 108);
INSERT INTO `banner_resolution` (`width`, `height`) VALUES (1280, 128);
INSERT INTO `banner_resolution` (`width`, `height`) VALUES (1600, 160);
