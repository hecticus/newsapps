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
  constraint pk_clients primary key (id_client))
;

create table client_has_devices (
  id_client_has_devices     integer auto_increment not null,
  id_client                 integer,
  id_device                 integer,
  registration_id           varchar(255),
  constraint pk_client_has_devices primary key (id_client_has_devices))
;

create table client_has_woman (
  id_client_has_woman       integer auto_increment not null,
  id_client                 integer,
  id_woman                  integer,
  constraint pk_client_has_woman primary key (id_client_has_woman))
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
  id_woman                  integer,
  date                      varchar(255),
  source                    varchar(255),
  id_social_network         integer,
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

create table women (
  id_woman                  integer auto_increment not null,
  name                      varchar(255),
  default_photo             varchar(255),
  constraint pk_women primary key (id_woman))
;

create table woman_has_categories (
  id_woman_has_category     integer auto_increment not null,
  id_category               integer,
  id_woman                  integer,
  constraint pk_woman_has_categories primary key (id_woman_has_category))
;

create table woman_has_social_network (
  id_woman_has_social_network integer auto_increment not null,
  id_woman                  integer,
  id_social_network         integer,
  link                      varchar(255),
  constraint pk_woman_has_social_network primary key (id_woman_has_social_network))
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
alter table client_has_devices add constraint fk_client_has_devices_client_2 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;
create index ix_client_has_devices_client_2 on client_has_devices (id_client);
alter table client_has_devices add constraint fk_client_has_devices_device_3 foreign key (id_device) references devices (id_device) on delete restrict on update restrict;
create index ix_client_has_devices_device_3 on client_has_devices (id_device);
alter table client_has_woman add constraint fk_client_has_woman_client_4 foreign key (id_client) references clients (id_client) on delete restrict on update restrict;
create index ix_client_has_woman_client_4 on client_has_woman (id_client);
alter table client_has_woman add constraint fk_client_has_woman_woman_5 foreign key (id_woman) references women (id_woman) on delete restrict on update restrict;
create index ix_client_has_woman_woman_5 on client_has_woman (id_woman);
alter table countries add constraint fk_countries_language_6 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;
create index ix_countries_language_6 on countries (id_language);
alter table linked_account add constraint fk_linked_account_user_7 foreign key (user_id) references users (id) on delete restrict on update restrict;
create index ix_linked_account_user_7 on linked_account (user_id);
alter table post add constraint fk_post_woman_8 foreign key (id_woman) references women (id_woman) on delete restrict on update restrict;
create index ix_post_woman_8 on post (id_woman);
alter table post add constraint fk_post_socialNetwork_9 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;
create index ix_post_socialNetwork_9 on post (id_social_network);
alter table post_has_countries add constraint fk_post_has_countries_post_10 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_countries_post_10 on post_has_countries (id_post);
alter table post_has_countries add constraint fk_post_has_countries_country_11 foreign key (id_country) references countries (id_country) on delete restrict on update restrict;
create index ix_post_has_countries_country_11 on post_has_countries (id_country);
alter table post_has_localizations add constraint fk_post_has_localizations_post_12 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_localizations_post_12 on post_has_localizations (id_post);
alter table post_has_localizations add constraint fk_post_has_localizations_language_13 foreign key (id_language) references languages (id_language) on delete restrict on update restrict;
create index ix_post_has_localizations_language_13 on post_has_localizations (id_language);
alter table post_has_media add constraint fk_post_has_media_post_14 foreign key (id_post) references post (id_post) on delete restrict on update restrict;
create index ix_post_has_media_post_14 on post_has_media (id_post);
alter table post_has_media add constraint fk_post_has_media_fileType_15 foreign key (id_file_type) references file_types (id_file_type) on delete restrict on update restrict;
create index ix_post_has_media_fileType_15 on post_has_media (id_file_type);
alter table token_action add constraint fk_token_action_targetUser_16 foreign key (target_user_id) references users (id) on delete restrict on update restrict;
create index ix_token_action_targetUser_16 on token_action (target_user_id);
alter table woman_has_categories add constraint fk_woman_has_categories_category_17 foreign key (id_category) references categories (id_category) on delete restrict on update restrict;
create index ix_woman_has_categories_category_17 on woman_has_categories (id_category);
alter table woman_has_categories add constraint fk_woman_has_categories_woman_18 foreign key (id_woman) references women (id_woman) on delete restrict on update restrict;
create index ix_woman_has_categories_woman_18 on woman_has_categories (id_woman);
alter table woman_has_social_network add constraint fk_woman_has_social_network_woman_19 foreign key (id_woman) references women (id_woman) on delete restrict on update restrict;
create index ix_woman_has_social_network_woman_19 on woman_has_social_network (id_woman);
alter table woman_has_social_network add constraint fk_woman_has_social_network_socialNetwork_20 foreign key (id_social_network) references social_networks (id_social_network) on delete restrict on update restrict;
create index ix_woman_has_social_network_socialNetwork_20 on woman_has_social_network (id_social_network);



alter table users_security_role add constraint fk_users_security_role_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;

alter table users_security_role add constraint fk_users_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;

alter table users_user_permission add constraint fk_users_user_permission_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;

alter table users_user_permission add constraint fk_users_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;

# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table categories;

drop table clients;

drop table client_has_devices;

drop table client_has_woman;

drop table configs;

drop table countries;

drop table devices;

drop table file_types;

drop table instances;

drop table languages;

drop table linked_account;

drop table post;

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

drop table women;

drop table woman_has_categories;

drop table woman_has_social_network;

SET FOREIGN_KEY_CHECKS=1;

