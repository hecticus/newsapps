# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table category (
  id_category               bigint auto_increment not null,
  name                      varchar(255),
  short_name                varchar(255),
  feed_url                  varchar(255),
  internal_url              varchar(255),
  sort                      integer,
  pushable                  tinyint(1) default 0,
  trending                  tinyint(1) default 0,
  constraint pk_category primary key (id_category))
;

create table news (
  id_news                   bigint auto_increment not null,
  external_id               integer,
  author                    varchar(255),
  pub_date                  varchar(255),
  category                  varchar(255),
  image                     varchar(255),
  image_caption             varchar(255),
  video_url                 varchar(255),
  title                     varchar(255),
  top_news                  tinyint(1) default 0,
  uploaded_video            varchar(255),
  description               varchar(255),
  visits                    integer,
  crc                       varchar(255),
  inserted_time             varchar(255),
  constraint pk_news primary key (id_news))
;




# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table category;

drop table news;

SET FOREIGN_KEY_CHECKS=1;

