ALTER TABLE `tvmax_polla_admin`.`team` ADD COLUMN `original_name` VARCHAR(45) NULL DEFAULT NULL  AFTER `afp_id` , ADD COLUMN `original_shortname` VARCHAR(45) NULL DEFAULT NULL  AFTER `original_name` , ADD COLUMN `original_flag_file` VARCHAR(45) NULL DEFAULT NULL  AFTER `original_shortname` , ADD COLUMN `original_afp_id` BIGINT(20) NULL DEFAULT '-1'  AFTER `original_flag_file` ;


UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Alemania', `original_shortname`='GER', `original_flag_file`='gm-lgflag.png', `original_afp_id`='1500' WHERE `id_team`='1';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Argelia', `original_shortname`='ALG', `original_flag_file`='ag-lgflag.png', `original_afp_id`='3041' WHERE `id_team`='2';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Argentina', `original_shortname`='ARG', `original_flag_file`='ar-lgflag.png', `original_afp_id`='3029' WHERE `id_team`='3';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Australia', `original_shortname`='AUS', `original_flag_file`='as-lgflag.png', `original_afp_id`='3059' WHERE `id_team`='4';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Bélgica', `original_shortname`='BEL', `original_flag_file`='be-lgflag.png', `original_afp_id`='3004' WHERE `id_team`='5';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Bosnia y Hna.', `original_shortname`='BIH', `original_flag_file`='bk-lgflag.png', `original_afp_id`='3100' WHERE `id_team`='6';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Brasil', `original_shortname`='BRA', `original_flag_file`='br-lgflag.png', `original_afp_id`='1035' WHERE `id_team`='7';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Camerún', `original_shortname`='CMR', `original_flag_file`='cm-lgflag.png', `original_afp_id`='3075' WHERE `id_team`='8';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Chile', `original_shortname`='CHI', `original_flag_file`='ci-lgflag.png', `original_afp_id`='3015' WHERE `id_team`='9';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Colombia', `original_shortname`='COL', `original_flag_file`='co-lgflag.png', `original_afp_id`='3037' WHERE `id_team`='10';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Corea del Sur', `original_shortname`='KOR', `original_flag_file`='ks-lgflag.png', `original_afp_id`='3068' WHERE `id_team`='11';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Costa de Marfil', `original_shortname`='CIV', `original_flag_file`='iv-lgflag.png', `original_afp_id`='3038' WHERE `id_team`='12';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Costa Rica', `original_shortname`='CRC', `original_flag_file`='cs-lgflag.png', `original_afp_id`='3090' WHERE `id_team`='13';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Croacia', `original_shortname`='CRO', `original_flag_file`='hr-lgflag.png', `original_afp_id`='523' WHERE `id_team`='14';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Ecuador', `original_shortname`='ECU', `original_flag_file`='ec-lgflag.png', `original_afp_id`='3065' WHERE `id_team`='15';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='España', `original_shortname`='ESP', `original_flag_file`='sp-lgflag.png', `original_afp_id`='413' WHERE `id_team`='16';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Usa', `original_shortname`='USA', `original_flag_file`='us-lgflag.png', `original_afp_id`='3019' WHERE `id_team`='17';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Francia', `original_shortname`='FRA', `original_flag_file`='fr-lgflag.png', `original_afp_id`='461' WHERE `id_team`='18';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Ghana', `original_shortname`='GHA', `original_flag_file`='gh-lgflag.png', `original_afp_id`='3025' WHERE `id_team`='19';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Grecia', `original_shortname`='GRE', `original_flag_file`='gr-lgflag.png', `original_afp_id`='3012' WHERE `id_team`='20';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Honduras', `original_shortname`='HON', `original_flag_file`='ho-lgflag.png', `original_afp_id`='3048' WHERE `id_team`='21';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Inglaterra', `original_shortname`='ENG', `original_flag_file`='en-lgflag.png', `original_afp_id`='436' WHERE `id_team`='22';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Irán', `original_shortname`='IRN', `original_flag_file`='ir-lgflag.png', `original_afp_id`='3033' WHERE `id_team`='23';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Italia', `original_shortname`='ITA', `original_flag_file`='it-lgflag.png', `original_afp_id`='445' WHERE `id_team`='24';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Japón', `original_shortname`='JPN', `original_flag_file`='ja-lgflag.png', `original_afp_id`='3062' WHERE `id_team`='25';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='México', `original_shortname`='MEX', `original_flag_file`='mx-lgflag.png', `original_afp_id`='3010' WHERE `id_team`='26';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Nigeria', `original_shortname`='NGA', `original_flag_file`='ni-lgflag.png', `original_afp_id`='3084' WHERE `id_team`='27';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Países Bajos', `original_shortname`='NED', `original_flag_file`='nl-lgflag.png', `original_afp_id`='411' WHERE `id_team`='28';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Portugal', `original_shortname`='POR', `original_flag_file`='po-lgflag.png', `original_afp_id`='450' WHERE `id_team`='29';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Rusia', `original_shortname`='RUS', `original_flag_file`='rs-lgflag.png', `original_afp_id`='1063' WHERE `id_team`='30';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Suiza', `original_shortname`='SUI', `original_flag_file`='sz-lgflag.png', `original_afp_id`='408' WHERE `id_team`='31';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='Uruguay', `original_shortname`='URU', `original_flag_file`='uy-lgflag.png', `original_afp_id`='3024' WHERE `id_team`='32';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='A1', `original_shortname`='A1' WHERE `id_team`='33';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='A2', `original_shortname`='A2' WHERE `id_team`='34';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='B1', `original_shortname`='B1' WHERE `id_team`='35';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='B2', `original_shortname`='B2' WHERE `id_team`='36';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='C1', `original_shortname`='C1' WHERE `id_team`='37';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='C2', `original_shortname`='C2' WHERE `id_team`='38';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='D1', `original_shortname`='D1' WHERE `id_team`='39';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='D2', `original_shortname`='D2' WHERE `id_team`='40';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='E1', `original_shortname`='E1' WHERE `id_team`='41';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='E2', `original_shortname`='E2' WHERE `id_team`='42';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='F1', `original_shortname`='F1' WHERE `id_team`='43';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='F2', `original_shortname`='F2' WHERE `id_team`='44';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='G1', `original_shortname`='G1' WHERE `id_team`='45';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='G2', `original_shortname`='G2' WHERE `id_team`='46';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='H1', `original_shortname`='H1' WHERE `id_team`='47';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='H2', `original_shortname`='H2' WHERE `id_team`='48';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='A1B2', `original_shortname`='A1B2' WHERE `id_team`='49';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='C1D2', `original_shortname`='C1D2' WHERE `id_team`='50';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='E1F2', `original_shortname`='E1F2' WHERE `id_team`='51';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='G1H2', `original_shortname`='G1H2' WHERE `id_team`='52';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='B1A2', `original_shortname`='B1A2' WHERE `id_team`='53';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='D1C2', `original_shortname`='D1C2' WHERE `id_team`='54';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='F1E2', `original_shortname`='F1E2' WHERE `id_team`='55';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='H1G2', `original_shortname`='H1G2' WHERE `id_team`='56';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='A1B2C1D2', `original_shortname`='A1B2C1D2' WHERE `id_team`='57';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='E1F2G1H2', `original_shortname`='E1F2G1H2' WHERE `id_team`='58';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='B1A2D1C2', `original_shortname`='B1A2D1C2' WHERE `id_team`='59';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='F1E2H1G2', `original_shortname`='F1E2H1G2' WHERE `id_team`='60';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='A1B2C1D2E1F2G1H2L', `original_shortname`='A1B2C1D2E1F2G1H2L' WHERE `id_team`='61';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='B1A2D1C2F1E2H1G2L', `original_shortname`='B1A2D1C2F1E2H1G2L' WHERE `id_team`='62';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='A1B2C1D2E1F2G1H2W', `original_shortname`='A1B2C1D2E1F2G1H2W' WHERE `id_team`='63';
UPDATE `tvmax_polla_admin`.`team` SET `original_name`='B1A2D1C2F1E2H1G2W', `original_shortname`='B1A2D1C2F1E2H1G2W' WHERE `id_team`='64';




UPDATE `tvmax_polla_admin`.`team` SET `name`='Brasil', `shortname`='BRA', `flag_file`='br-lgflag.png', `afp_id`='1035' WHERE `id_team`='33';
UPDATE `tvmax_polla_admin`.`team` SET `name`='México', `shortname`='MEX', `flag_file`='mx-lgflag.png', `afp_id`='3010' WHERE `id_team`='34';
UPDATE `tvmax_polla_admin`.`team` SET `name`='Países Bajos', `shortname`='NED', `flag_file`='nl-lgflag.png', `afp_id`='411' WHERE `id_team`='35';
UPDATE `tvmax_polla_admin`.`team` SET `name`='Chile', `shortname`='CHI', `flag_file`='ci-lgflag.png', `afp_id`='3015' WHERE `id_team`='36';
UPDATE `tvmax_polla_admin`.`team` SET `name`='Colombia', `shortname`='COL', `flag_file`='co-lgflag.png', `afp_id`='3037' WHERE `id_team`='37';
UPDATE `tvmax_polla_admin`.`team` SET `name`='Grecia', `shortname`='GRE', `flag_file`='gr-lgflag.png', `afp_id`='3012' WHERE `id_team`='38';
UPDATE `tvmax_polla_admin`.`team` SET `name`='Costa Rica', `shortname`='CRC', `flag_file`='cs-lgflag.png', `afp_id`='3090' WHERE `id_team`='39';
UPDATE `tvmax_polla_admin`.`team` SET `name`='Uruguay', `shortname`='URU', `flag_file`='uy-lgflag.png', `afp_id`='3024' WHERE `id_team`='40';
