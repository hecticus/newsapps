ALTER TABLE `football_manager`.`competitions` 
ADD UNIQUE INDEX `uq_competition_app_extid` (`ext_id` ASC, `id_app` ASC, `id_comp_type` ASC);

ALTER TABLE `football_manager`.`competition_type` 
ADD UNIQUE INDEX `uq_extid` (`ext_id` ASC);

ALTER TABLE `football_manager`.`phases` 
ADD UNIQUE INDEX `uq_competition_extid` (`id_competitions` ASC, `ext_id` ASC);

ALTER TABLE `football_manager`.`teams` 
ADD UNIQUE INDEX `uq_extid` (`ext_id` ASC);

ALTER TABLE `football_manager`.`scorers` 
ADD UNIQUE INDEX `uq_competition_extid` (`id_competition` ASC, `external_id` ASC);


