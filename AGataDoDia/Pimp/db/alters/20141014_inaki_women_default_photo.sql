ALTER TABLE `pimp`.`women` ADD COLUMN `default_photo` VARCHAR(255) NULL AFTER `name`;

UPDATE `pimp`.`women` SET `default_photo`='http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/1/1e6c69a0-313a-4ad7-a5d7-b69ae07116961.jpg' WHERE `id_woman`='1';
UPDATE `pimp`.`women` SET `default_photo`='http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/2/fb1c50b4-89fc-47ba-a460-691ab3b7751eM.jpg' WHERE `id_woman`='2';
UPDATE `pimp`.`women` SET `default_photo`='http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/3/58418244-e3b4-48e0-8fe9-ec36c3f0ddc0L.jpg' WHERE `id_woman`='3';
UPDATE `pimp`.`women` SET `default_photo`='http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/4/8b92ee90-6889-42d9-8768-5d2776035d38D.jpg' WHERE `id_woman`='4';
UPDATE `pimp`.`women` SET `default_photo`='http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/5/18476045-db89-494d-9ccf-cfd90eafbb182.jpg' WHERE `id_woman`='5';