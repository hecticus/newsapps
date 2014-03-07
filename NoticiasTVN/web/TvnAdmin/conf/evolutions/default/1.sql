# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table category (
  id_category               bigint auto_increment not null,
  name                      varchar(255),
  feed_url                  varchar(255),
  pushable                  tinyint(1) default 0,
  sort                      integer,
  short_name                varchar(255),
  internal_url              varchar(255),
  trending                  tinyint(1) default 0,
  status                    integer,
  hidden                    tinyint(1) default 0,
  constraint pk_category primary key (id_category))
;

create table news (
  id_news                   bigint auto_increment not null,
  external_id               integer,
  author                    varchar(255),
  pub_date                  varchar(255),
  category                  varchar(255),
  id_category               bigint,
  image                     varchar(255),
  image_caption             varchar(255),
  video_url                 varchar(255),
  title                     varchar(255),
  top_news                  tinyint(1) default 0,
  uploaded_video            varchar(255),
  description               text,
  visits                    integer,
  crc                       varchar(255),
  inserted_time             varchar(255),
  generated                 tinyint(1) default 0,
  category_name             varchar(255),
  video_time                varchar(255),
  id_trending               varchar(255),
  constraint pk_news primary key (id_news))
;

create table u01_users (
  u01_id                    integer auto_increment not null,
  u01_login                 varchar(255),
  u01_password              varchar(255),
  u01_email                 varchar(255),
  u01_all_countries         tinyint(1) default 0,
  constraint pk_u01_users primary key (u01_id))
;

create table u02_profiles (
  u02_id                    integer auto_increment not null,
  u02_name                  varchar(255),
  constraint pk_u02_profiles primary key (u02_id))
;


create table u01_users_u02_profiles (
  u01_users_u01_id               integer not null,
  u02_profiles_u02_id            integer not null,
  constraint pk_u01_users_u02_profiles primary key (u01_users_u01_id, u02_profiles_u02_id))
;



alter table u01_users_u02_profiles add constraint fk_u01_users_u02_profiles_u01_users_01 foreign key (u01_users_u01_id) references u01_users (u01_id) on delete restrict on update restrict;

alter table u01_users_u02_profiles add constraint fk_u01_users_u02_profiles_u02_profiles_02 foreign key (u02_profiles_u02_id) references u02_profiles (u02_id) on delete restrict on update restrict;

# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table category;

drop table news;

drop table u01_users;

drop table u01_users_u02_profiles;

drop table u02_profiles;

SET FOREIGN_KEY_CHECKS=1;

