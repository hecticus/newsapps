ALTER TABLE `tvmax_polla_admin`.`match_group` ADD COLUMN `original_name` VARCHAR(45) NULL DEFAULT NULL  AFTER `name` ;



UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='A' WHERE `id_group`='1';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='B' WHERE `id_group`='2';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='C' WHERE `id_group`='3';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='D' WHERE `id_group`='4';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='E' WHERE `id_group`='5';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='F' WHERE `id_group`='6';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='G' WHERE `id_group`='7';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='H' WHERE `id_group`='8';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='A1B2' WHERE `id_group`='9';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='C1D2' WHERE `id_group`='10';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='B1A2' WHERE `id_group`='11';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='D1C2' WHERE `id_group`='12';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='E1F2' WHERE `id_group`='13';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='G1H2' WHERE `id_group`='14';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='F1E2' WHERE `id_group`='15';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='H1G2' WHERE `id_group`='16';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='A1B2C1D2' WHERE `id_group`='17';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='E1F2G1H2' WHERE `id_group`='18';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='B1A2D1C2' WHERE `id_group`='19';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='F1E2H1G2' WHERE `id_group`='20';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='A1B2C1D2E1F2G1H2' WHERE `id_group`='21';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='B1A2D1C2F1E2H1G2' WHERE `id_group`='22';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='A1B2C1D2E1F2G1H2B1A2D1C2F1E2H1G2L' WHERE `id_group`='23';
UPDATE `tvmax_polla_admin`.`match_group` SET `original_name`='A1B2C1D2E1F2G1H2B1A2D1C2F1E2H1G2W' WHERE `id_group`='24';




UPDATE `tvmax_polla_admin`.`match_group` SET `name`='Octavos 49' WHERE `id_group`='9';
UPDATE `tvmax_polla_admin`.`match_group` SET `name`='Octavos 50' WHERE `id_group`='10';
UPDATE `tvmax_polla_admin`.`match_group` SET `name`='Octavos 51' WHERE `id_group`='11';
UPDATE `tvmax_polla_admin`.`match_group` SET `name`='Octavos 52' WHERE `id_group`='12';
UPDATE `tvmax_polla_admin`.`match_group` SET `name`='Octavos 53' WHERE `id_group`='13';
UPDATE `tvmax_polla_admin`.`match_group` SET `name`='Octavos 54' WHERE `id_group`='14';
UPDATE `tvmax_polla_admin`.`match_group` SET `name`='Octavos 55' WHERE `id_group`='15';
UPDATE `tvmax_polla_admin`.`match_group` SET `name`='Octavos 56' WHERE `id_group`='16';


