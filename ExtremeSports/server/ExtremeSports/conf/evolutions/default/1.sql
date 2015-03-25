# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table athletes (
  id_athlete                integer auto_increment not null,
  name                      varchar(255),
  default_photo             varchar(255),
  constraint pk_athletes primary key (id_athlete))
;

create table athlete_has_social_network (
  id_athlete_has_social_network integer auto_increment not null,
  id_theme                  integer,
  id_social_network         integer,
  link                      varchar(255),
  constraint pk_athlete_has_social_network primary key (id_athlete_has_social_network))
;

create table categories (
  id_category               integer auto_increment not null,
  name                      varchar(255),
  followable                tinyint(1) default 0,
  constraint pk_categories primary key (id_category))
;

create table category_has_localizations (
  id_category_has_localization integer auto_increment not null,
  id_category               integer,
  id_language               integer,
  name                      varchar(255),
  constraint pk_category_has_localizations primary key (id_category_has_localization))
;

create table clients (
  id_client                 integer auto_increment not null,
  user_id                   varchar(255),
  status                    integer,
  login                     varchar(255),
  password                  varchar(255),
  last_check_date           varchar(255),
  id_country                integer,
  id_language               integer,
  constraint pk_clients primary key (id_client))
;

create table client_has_athlete (
  id_client_has_theme       integer auto_increment not null,
  id_client                 integer,
  id_athlete                integer,
  constraint pk_client_has_athlete primary key (id_client_has_theme))
;

create table client_has_category (
  id_client_has_category    integer auto_increment not null,
  id_client                 integer,
  id_category               integer,
  constraint pk_client_has_category primary key (id_client_has_category))
;

create table client_has_devices (
  id_client_has_devices     integer auto_increment not null,
  id_client                 integer,
  id_device                 integer,
  registration_id           varchar(255),
  constraint pk_client_has_devices primary key (id_client_has_devices))
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

create table file_types (
  id_file_type              integer auto_increment not null,
  name                      varchar(255),
  mime_type                 varchar(255),
  constraint pk_file_types primary key (id_file_type))
;

create table instances (
  id_instance               integer auto_increment not null,
  ip                        varchar(255),
  name                      varchar(255),
  running                   integer,
  test                      integer,
  master                    tinyint(1) default 0,
  constraint pk_instances primary key (id_instance))
;

create table jobs (
  id                        bigint auto_increment not null,
  status                    integer,
  class_name                varchar(255),
  name                      varchar(255),
  params                    varchar(255),
  id_app                    integer,
  next_timestamp            bigint,
  time                      varchar(255),
  time_params               varchar(255),
  frequency                 integer,
  daemon                    tinyint(1) default 0,
  constraint pk_jobs primary key (id))
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
  date                      varchar(255),
  source                    varchar(255),
  id_social_network         integer,
  push                      integer,
  push_date                 bigint,
  constraint pk_post primary key (id_post))
;

create table post_has_athlete (
  id_post_has_athlete       integer auto_increment not null,
  id_post                   integer,
  id_athlete                integer,
  constraint pk_post_has_athlete primary key (id_post_has_athlete))
;

create table post_has_category (
  id_post_has_athlete       integer auto_increment not null,
  id_post                   integer,
  id_category               integer,
  constraint pk_post_has_category primary key (id_post_has_athlete))
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
  content                   TEXT,
  constraint pk_post_has_localizations primary key (id_post_has_localization))
;

create table post_has_media (
  id_post_has_media         integer auto_increment not null,
  id_post                   integer,
  id_file_type              integer,
  md5                       varchar(255),
  link                      varchar(255),
  width                     integer,
  height                    integer,
  wistia_id                 varchar(255),
  wistia_player             TEXT,
  constraint pk_post_has_media primary key (id_post_has_media))
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
alter table athlete_has_social_network add constraint fk_athlete_has_social_network_athlete_1 foreign key (id_theme) references athletes (id_athlete) on delete restrict on update restrict;
create index ix_athlete_has_social_network_athlete_1 on athlete_has_social_network (id_theme);
alter table athlete_has_social_network add constraint fk_athlete_has_social_network_socialNetwork_2 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;
create index ix_athlete_has_social_network_socialNetwork_2 on athlete_has_social_network (id_social_network);
alter table category_has_localizations add constraint fk_category_has_localizations_category_3 foreign key (id_category) references categories (id_category) on delete restrict on update restrict;
create index ix_category_has_localizations_category_3 on category_has_localizations (id_category);
alter table category_has_localizations add constraint fk_category_has_localizations_language_4 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;
create index ix_category_has_localizations_language_4 on category_has_localizations (id_language);
alter table clients add constraint fk_clients_country_5 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;
create index ix_clients_country_5 on clients (id_country);
alter table clients add constraint fk_clients_language_6 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;
create index ix_clients_language_6 on clients (id_language);
alter table client_has_athlete add constraint fk_client_has_athlete_client_7 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;
create index ix_client_has_athlete_client_7 on client_has_athlete (id_client);
alter table client_has_athlete add constraint fk_client_has_athlete_athlete_8 foreign key (id_athlete) references athletes (id_athlete) on delete restrict on update restrict;
create index ix_client_has_athlete_athlete_8 on client_has_athlete (id_athlete);
alter table client_has_category add constraint fk_client_has_category_client_9 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;
create index ix_client_has_category_client_9 on client_has_category (id_client);
alter table client_has_category add constraint fk_client_has_category_category_10 foreign key (id_category) references categories (id_category) on delete restrict on update restrict;
create index ix_client_has_category_category_10 on client_has_category (id_category);
alter table client_has_devices add constraint fk_client_has_devices_client_11 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;
create index ix_client_has_devices_client_11 on client_has_devices (id_client);
alter table client_has_devices add constraint fk_client_has_devices_device_12 foreign key (id_device) references devices (id_device) on delete restrict on update restrict;
create index ix_client_has_devices_device_12 on client_has_devices (id_device);
alter table countries add constraint fk_countries_language_13 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;
create index ix_countries_language_13 on countries (id_language);
alter table linked_account add constraint fk_linked_account_user_14 foreign key (user_id) references users (id) on delete restrict on update restrict;
create index ix_linked_account_user_14 on linked_account (user_id);
alter table post add constraint fk_post_socialNetwork_15 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;
create index ix_post_socialNetwork_15 on post (id_social_network);
alter table post_has_athlete add constraint fk_post_has_athlete_post_16 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_athlete_post_16 on post_has_athlete (id_post);
alter table post_has_athlete add constraint fk_post_has_athlete_athlete_17 foreign key (id_athlete) references athletes (id_athlete) on delete restrict on update restrict;
create index ix_post_has_athlete_athlete_17 on post_has_athlete (id_athlete);
alter table post_has_category add constraint fk_post_has_category_post_18 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_category_post_18 on post_has_category (id_post);
alter table post_has_category add constraint fk_post_has_category_category_19 foreign key (id_category) references categories (id_category) on delete restrict on update restrict;
create index ix_post_has_category_category_19 on post_has_category (id_category);
alter table post_has_countries add constraint fk_post_has_countries_post_20 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_countries_post_20 on post_has_countries (id_post);
alter table post_has_countries add constraint fk_post_has_countries_country_21 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;
create index ix_post_has_countries_country_21 on post_has_countries (id_country);
alter table post_has_localizations add constraint fk_post_has_localizations_post_22 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_localizations_post_22 on post_has_localizations (id_post);
alter table post_has_localizations add constraint fk_post_has_localizations_language_23 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;
create index ix_post_has_localizations_language_23 on post_has_localizations (id_language);
alter table post_has_media add constraint fk_post_has_media_post_24 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_media_post_24 on post_has_media (id_post);
alter table post_has_media add constraint fk_post_has_media_fileType_25 foreign key (id_file_type) references file_types (id_file_type) on delete restrict on update restrict;
create index ix_post_has_media_fileType_25 on post_has_media (id_file_type);
alter table token_action add constraint fk_token_action_targetUser_26 foreign key (target_user_id) references users (id) on delete restrict on update restrict;
create index ix_token_action_targetUser_26 on token_action (target_user_id);



alter table users_security_role add constraint fk_users_security_role_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;

alter table users_security_role add constraint fk_users_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;

alter table users_user_permission add constraint fk_users_user_permission_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;

alter table users_user_permission add constraint fk_users_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;

# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table athletes;

drop table athlete_has_social_network;

drop table categories;

drop table category_has_localizations;

drop table clients;

drop table client_has_athlete;

drop table client_has_category;

drop table client_has_devices;

drop table configs;

drop table countries;

drop table devices;

drop table file_types;

drop table instances;

drop table jobs;

drop table languages;

drop table linked_account;

drop table post;

drop table post_has_athlete;

drop table post_has_category;

drop table post_has_countries;

drop table post_has_localizations;

drop table post_has_media;

drop table security_role;

drop table social_networks;

drop table token_action;

drop table users;

drop table users_security_role;

drop table users_user_permission;

drop table user_permission;

SET FOREIGN_KEY_CHECKS=1;

