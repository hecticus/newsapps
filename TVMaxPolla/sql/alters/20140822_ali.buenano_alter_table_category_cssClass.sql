ALTER TABLE `tvmax_polla_admin`.`news_category` ADD COLUMN `cssClass` VARCHAR(45) NULL  AFTER `sort` ;

UPDATE `tvmax_polla_admin`.`news_category` SET `cssClass`='icon-home' WHERE `id_news_category`='1';
UPDATE `tvmax_polla_admin`.`news_category` SET `cssClass`='icon-football' WHERE `id_news_category`='2';
UPDATE `tvmax_polla_admin`.`news_category` SET `cssClass`='icon-baseball' WHERE `id_news_category`='3';
UPDATE `tvmax_polla_admin`.`news_category` SET `cssClass`='icon-boxing' WHERE `id_news_category`='4';
UPDATE `tvmax_polla_admin`.`news_category` SET `cssClass`='icon-others' WHERE `id_news_category`='5';


