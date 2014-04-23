# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table banners (
  id_banner                 bigint auto_increment not null,
  name                      varchar(255),
  description               varchar(255),
  link                      varchar(255),
  status                    integer,
  constraint pk_banners primary key (id_banner))
;

create table banner_files (
  id_banner_file            bigint auto_increment not null,
  banner_id_banner          bigint not null,
  name                      varchar(255),
  location                  varchar(255),
  width                     integer,
  height                    integer,
  constraint pk_banner_files primary key (id_banner_file))
;

create table categories (
  id_category               bigint auto_increment not null,
  name                      varchar(255),
  feed_url                  varchar(255),
  pushable                  tinyint(1) default 0,
  sort                      integer,
  short_name                varchar(255),
  internal_url              varchar(255),
  trending                  tinyint(1) default 0,
  video                     tinyint(1) default 0,
  status                    integer,
  hidden                    tinyint(1) default 0,
  constraint pk_categories primary key (id_category))
;

create table news (
  id_news                   bigint auto_increment not null,
  body                      TEXT,
  categories                varchar(255),
  pub_date                  varchar(255),
  featured                  tinyint(1) default 0,
  first_video               varchar(255),
  external_id               integer,
  image                     varchar(255),
  portal_image              varchar(255),
  portal_image_desc         TEXT,
  pub_time                  varchar(255),
  push_notifications        tinyint(1) default 0,
  second_video              varchar(255),
  size                      integer,
  title                     varchar(255),
  url                       varchar(255),
  id_category               bigint,
  crc                       varchar(255),
  inserted_time             bigint,
  generated                 tinyint(1) default 0,
  generation_time           bigint,
  pub_date_formated         bigint,
  constraint pk_news primary key (id_news))
;

create table resources (
  news_id_news              bigint not null,
  name                      varchar(255),
  filename                  varchar(255),
  generic_name              varchar(255),
  description               varchar(255),
  res                       varchar(255),
  type                      integer,
  status                    integer,
  id_news                   bigint)
;

create table trendingTopics (
  id_trending_topics        bigint auto_increment not null,
  category                  varchar(255),
  title                     varchar(255),
  image                     varchar(255),
  constraint pk_trendingTopics primary key (id_trending_topics))
;

create table u01_users (
  u01_id                    bigint auto_increment not null,
  u01_login                 varchar(255),
  u01_password              varchar(255),
  u01_email                 varchar(255),
  constraint pk_u01_users primary key (u01_id))
;

create table u02_profiles (
  u02_id                    integer auto_increment not null,
  u02_name                  varchar(255),
  constraint pk_u02_profiles primary key (u02_id))
;


create table u01_users_u02_profiles (
  u01_users_u01_id               bigint not null,
  u02_profiles_u02_id            integer not null,
  constraint pk_u01_users_u02_profiles primary key (u01_users_u01_id, u02_profiles_u02_id))
;
alter table banner_files add constraint fk_banner_files_banners_1 foreign key (banner_id_banner) references banners (id_banner) on delete restrict on update restrict;
create index ix_banner_files_banners_1 on banner_files (banner_id_banner);
alter table resources add constraint fk_resources_news_2 foreign key (news_id_news) references news (id_news) on delete restrict on update restrict;
create index ix_resources_news_2 on resources (news_id_news);



alter table u01_users_u02_profiles add constraint fk_u01_users_u02_profiles_u01_users_01 foreign key (u01_users_u01_id) references u01_users (u01_id) on delete restrict on update restrict;

alter table u01_users_u02_profiles add constraint fk_u01_users_u02_profiles_u02_profiles_02 foreign key (u02_profiles_u02_id) references u02_profiles (u02_id) on delete restrict on update restrict;

# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table banners;

drop table banner_files;

drop table categories;

drop table news;

drop table resources;

drop table trendingTopics;

drop table u01_users;

drop table u01_users_u02_profiles;

drop table u02_profiles;

SET FOREIGN_KEY_CHECKS=1;

