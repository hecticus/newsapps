
INSERT INTO `tvn_admin`.`configs` (`key`, `value`, `description`) VALUES ('rks-CDN-URL-BANNER', 'http://ed77a5482266a2da7be3-a37b01026a6a3cd6cafffe441531b836.r2.cf1.rackcdn.com/', 'Url base de banners de tvn noticias');
INSERT INTO `tvn_admin`.`configs` (`key`, `value`, `description`) VALUES ('img-Folder-Route-Banner', 'C:\Server\www\PhoneGap\newsapps\NoticiasTVN\web\TvnAdmin\public\banners\', 'Ruta de la carpeta de banners');
INSERT INTO `tvn_admin`.`configs` (`key`, `value`, `description`) VALUES ('banner-interval', '60000', 'Rotación de banners en la app de tvn');


INSERT INTO `tvn_admin`.`u02_profiles` (`u02_name`) VALUES ('Administrador');
INSERT INTO `tvn_admin`.`u02_profiles` (`u02_name`) VALUES ('User');


ALTER TABLE `tvn_admin`.`u01_users` ADD COLUMN `profiles_u02_id` BIGINT(20) NULL DEFAULT NULL  AFTER `u01_email`;


ALTER TABLE `tvn_admin`.`banners` ADD COLUMN `sort` INT(11) NULL DEFAULT NULL  AFTER `sort` ;


INSERT INTO `tvn_admin`.`u01_users` (`u01_login`, `u01_password`, `u01_email`, `profiles_u02_id`) VALUES ('admin', '$2a$10$sr2yUzTlWRTJ8xaykjnFMORpCUHroaiPSDrPSNblIRmdgroAeV45W', 'admin@admin.com', 1);