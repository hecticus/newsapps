# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table categories (
  id_category               integer auto_increment not null,
  name                      varchar(255),
  constraint pk_categories primary key (id_category))
;

create table clients (
  id_client                 integer auto_increment not null,
  user_id                   varchar(255),
  status                    integer,
  login                     varchar(255),
  password                  varchar(255),
  last_check_date           varchar(255),
  id_country                integer,
  id_gender                 integer,
  constraint pk_clients primary key (id_client))
;

create table client_has_devices (
  id_client_has_devices     integer auto_increment not null,
  id_client                 integer,
  id_device                 integer,
  registration_id           varchar(255),
  constraint pk_client_has_devices primary key (id_client_has_devices))
;

create table client_has_theme (
  id_client_has_theme       integer auto_increment not null,
  id_client                 integer,
  id_theme                  integer,
  constraint pk_client_has_theme primary key (id_client_has_theme))
;

create table configs (
  id_config                 bigint auto_increment not null,
  config_key                varchar(255),
  value                     varchar(255),
  description               varchar(255),
  constraint pk_configs primary key (id_config))
;

create table countries (
  id_country                integer auto_increment not null,
  name                      varchar(255),
  short_name                varchar(255),
  active                    integer,
  id_language               integer,
  constraint pk_countries primary key (id_country))
;

create table devices (
  id_device                 integer auto_increment not null,
  name                      varchar(255),
  constraint pk_devices primary key (id_device))
;

create table featured_images (
  id_featured_images        integer auto_increment not null,
  name                      varchar(255),
  constraint pk_featured_images primary key (id_featured_images))
;

create table featured_image_has_resolution (
  id_featured_image_has_resolution integer auto_increment not null,
  id_featured_image         integer,
  id_resolution             integer,
  link                      varchar(255),
  constraint pk_featured_image_has_resolution primary key (id_featured_image_has_resolution))
;

create table file_types (
  id_file_type              integer auto_increment not null,
  name                      varchar(255),
  mime_type                 varchar(255),
  constraint pk_file_types primary key (id_file_type))
;

create table genders (
  id_gender                 integer auto_increment not null,
  name                      varchar(255),
  constraint pk_genders primary key (id_gender))
;

create table instances (
  id_instance               integer auto_increment not null,
  ip                        varchar(255),
  name                      varchar(255),
  running                   integer,
  test                      integer,
  constraint pk_instances primary key (id_instance))
;

create table languages (
  id_language               integer auto_increment not null,
  name                      varchar(255),
  short_name                varchar(255),
  active                    integer,
  constraint pk_languages primary key (id_language))
;

create table linked_account (
  id                        bigint auto_increment not null,
  user_id                   bigint,
  provider_user_id          varchar(255),
  provider_key              varchar(255),
  constraint pk_linked_account primary key (id))
;

create table post (
  id_post                   integer auto_increment not null,
  id_theme                  integer,
  date                      varchar(255),
  source                    varchar(255),
  id_social_network         integer,
  id_gender                 integer,
  push                      integer,
  push_date                 bigint,
  constraint pk_post primary key (id_post))
;

create table post_has_countries (
  id_post_has_country       integer auto_increment not null,
  id_post                   integer,
  id_country                integer,
  constraint pk_post_has_countries primary key (id_post_has_country))
;

create table post_has_localizations (
  id_post_has_localization  integer auto_increment not null,
  id_post                   integer,
  id_language               integer,
  title                     varchar(255),
  content                   varchar(255),
  constraint pk_post_has_localizations primary key (id_post_has_localization))
;

create table post_has_media (
  id_post_has_media         integer auto_increment not null,
  id_post                   integer,
  id_file_type              integer,
  md5                       varchar(255),
  link                      varchar(255),
  main_screen               integer,
  width                     integer,
  height                    integer,
  constraint pk_post_has_media primary key (id_post_has_media))
;

create table resolutions (
  id_resolution             integer auto_increment not null,
  width                     integer,
  height                    integer,
  constraint pk_resolutions primary key (id_resolution))
;

create table security_role (
  id                        bigint auto_increment not null,
  role_name                 varchar(255),
  constraint pk_security_role primary key (id))
;

create table social_networks (
  id_social_network         integer auto_increment not null,
  name                      varchar(255),
  home                      varchar(255),
  constraint pk_social_networks primary key (id_social_network))
;

create table themes (
  id_theme                  integer auto_increment not null,
  name                      varchar(255),
  default_photo             varchar(255),
  constraint pk_themes primary key (id_theme))
;

create table theme_has_categories (
  id_theme_has_category     integer auto_increment not null,
  id_category               integer,
  id_theme                  integer,
  constraint pk_theme_has_categories primary key (id_theme_has_category))
;

create table theme_has_social_network (
  id_theme_has_social_network integer auto_increment not null,
  id_theme                  integer,
  id_social_network         integer,
  link                      varchar(255),
  constraint pk_theme_has_social_network primary key (id_theme_has_social_network))
;

create table token_action (
  id                        bigint auto_increment not null,
  token                     varchar(255),
  target_user_id            bigint,
  type                      varchar(2),
  created                   datetime,
  expires                   datetime,
  constraint ck_token_action_type check (type in ('EV','PR')),
  constraint uq_token_action_token unique (token),
  constraint pk_token_action primary key (id))
;

create table users (
  id                        bigint auto_increment not null,
  email                     varchar(255),
  name                      varchar(255),
  first_name                varchar(255),
  last_name                 varchar(255),
  last_login                datetime,
  active                    tinyint(1) default 0,
  email_validated           tinyint(1) default 0,
  constraint pk_users primary key (id))
;

create table user_permission (
  id                        bigint auto_increment not null,
  value                     varchar(255),
  constraint pk_user_permission primary key (id))
;


create table users_security_role (
  users_id                       bigint not null,
  security_role_id               bigint not null,
  constraint pk_users_security_role primary key (users_id, security_role_id))
;

create table users_user_permission (
  users_id                       bigint not null,
  user_permission_id             bigint not null,
  constraint pk_users_user_permission primary key (users_id, user_permission_id))
;
alter table clients add constraint fk_clients_country_1 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;
create index ix_clients_country_1 on clients (id_country);
alter table clients add constraint fk_clients_gender_2 foreign key (id_gender) references genders (id_gender) on delete restrict on update restrict;
create index ix_clients_gender_2 on clients (id_gender);
alter table client_has_devices add constraint fk_client_has_devices_client_3 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;
create index ix_client_has_devices_client_3 on client_has_devices (id_client);
alter table client_has_devices add constraint fk_client_has_devices_device_4 foreign key (id_device) references devices (id_device) on delete restrict on update restrict;
create index ix_client_has_devices_device_4 on client_has_devices (id_device);
alter table client_has_theme add constraint fk_client_has_theme_client_5 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;
create index ix_client_has_theme_client_5 on client_has_theme (id_client);
alter table client_has_theme add constraint fk_client_has_theme_theme_6 foreign key (id_theme) references themes (id_theme) on delete restrict on update restrict;
create index ix_client_has_theme_theme_6 on client_has_theme (id_theme);
alter table countries add constraint fk_countries_language_7 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;
create index ix_countries_language_7 on countries (id_language);
alter table featured_image_has_resolution add constraint fk_featured_image_has_resolution_featuredImage_8 foreign key (id_featured_image) references featured_images (id_featured_images) on delete restrict on update restrict;
create index ix_featured_image_has_resolution_featuredImage_8 on featured_image_has_resolution (id_featured_image);
alter table featured_image_has_resolution add constraint fk_featured_image_has_resolution_resolution_9 foreign key (id_resolution) references resolutions (id_resolution) on delete restrict on update restrict;
create index ix_featured_image_has_resolution_resolution_9 on featured_image_has_resolution (id_resolution);
alter table linked_account add constraint fk_linked_account_user_10 foreign key (user_id) references users (id) on delete restrict on update restrict;
create index ix_linked_account_user_10 on linked_account (user_id);
alter table post add constraint fk_post_theme_11 foreign key (id_theme) references themes (id_theme) on delete restrict on update restrict;
create index ix_post_theme_11 on post (id_theme);
alter table post add constraint fk_post_socialNetwork_12 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;
create index ix_post_socialNetwork_12 on post (id_social_network);
alter table post add constraint fk_post_gender_13 foreign key (id_gender) references genders (id_gender) on delete restrict on update restrict;
create index ix_post_gender_13 on post (id_gender);
alter table post_has_countries add constraint fk_post_has_countries_post_14 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_countries_post_14 on post_has_countries (id_post);
alter table post_has_countries add constraint fk_post_has_countries_country_15 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;
create index ix_post_has_countries_country_15 on post_has_countries (id_country);
alter table post_has_localizations add constraint fk_post_has_localizations_post_16 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_localizations_post_16 on post_has_localizations (id_post);
alter table post_has_localizations add constraint fk_post_has_localizations_language_17 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;
create index ix_post_has_localizations_language_17 on post_has_localizations (id_language);
alter table post_has_media add constraint fk_post_has_media_post_18 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_media_post_18 on post_has_media (id_post);
alter table post_has_media add constraint fk_post_has_media_fileType_19 foreign key (id_file_type) references file_types (id_file_type) on delete restrict on update restrict;
create index ix_post_has_media_fileType_19 on post_has_media (id_file_type);
alter table theme_has_categories add constraint fk_theme_has_categories_category_20 foreign key (id_category) references categories (id_category) on delete restrict on update restrict;
create index ix_theme_has_categories_category_20 on theme_has_categories (id_category);
alter table theme_has_categories add constraint fk_theme_has_categories_theme_21 foreign key (id_theme) references themes (id_theme) on delete restrict on update restrict;
create index ix_theme_has_categories_theme_21 on theme_has_categories (id_theme);
alter table theme_has_social_network add constraint fk_theme_has_social_network_theme_22 foreign key (id_theme) references themes (id_theme) on delete restrict on update restrict;
create index ix_theme_has_social_network_theme_22 on theme_has_social_network (id_theme);
alter table theme_has_social_network add constraint fk_theme_has_social_network_socialNetwork_23 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;
create index ix_theme_has_social_network_socialNetwork_23 on theme_has_social_network (id_social_network);
alter table token_action add constraint fk_token_action_targetUser_24 foreign key (target_user_id) references users (id) on delete restrict on update restrict;
create index ix_token_action_targetUser_24 on token_action (target_user_id);



alter table users_security_role add constraint fk_users_security_role_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;

alter table users_security_role add constraint fk_users_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;

alter table users_user_permission add constraint fk_users_user_permission_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;

alter table users_user_permission add constraint fk_users_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;

# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table categories;

drop table clients;

drop table client_has_devices;

drop table client_has_theme;

drop table configs;

drop table countries;

drop table devices;

drop table featured_images;

drop table featured_image_has_resolution;

drop table file_types;

drop table genders;

drop table instances;

drop table languages;

drop table linked_account;

drop table post;

drop table post_has_countries;

drop table post_has_localizations;

drop table post_has_media;

drop table resolutions;

drop table security_role;

drop table social_networks;

drop table themes;

drop table theme_has_categories;

drop table theme_has_social_network;

drop table token_action;

drop table users;

drop table users_security_role;

drop table users_user_permission;

drop table user_permission;

SET FOREIGN_KEY_CHECKS=1;

