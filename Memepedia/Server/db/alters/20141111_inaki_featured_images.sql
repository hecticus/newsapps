CREATE TABLE `pimp`.`featured_images` (
  `id_featured_images` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_featured_images`))
ENGINE = InnoDB;

CREATE TABLE `pimp`.`resolutions` (
  `id_resolution` INT NOT NULL AUTO_INCREMENT,
  `width` INT NOT NULL DEFAULT 0,
  `height` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_resolution`))
ENGINE = InnoDB;

CREATE TABLE `pimp`.`featured_image_has_resolution` (
  `id_featured_image_has_resolution` INT NOT NULL AUTO_INCREMENT,
  `id_featured_image` INT NOT NULL,
  `id_resolution` INT NOT NULL,
  `link` VARCHAR(255) NULL,
  PRIMARY KEY (`id_featured_image_has_resolution`),
  INDEX `fk_featured_image_idx` (`id_featured_image` ASC),
  INDEX `fk_resolution_idx` (`id_resolution` ASC),
  CONSTRAINT `fk_featured_image`
    FOREIGN KEY (`id_featured_image`)
    REFERENCES `pimp`.`featured_images` (`id_featured_images`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_resolution`
    FOREIGN KEY (`id_resolution`)
    REFERENCES `pimp`.`resolutions` (`id_resolution`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
