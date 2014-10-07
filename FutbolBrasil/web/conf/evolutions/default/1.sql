# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table news (
  id                        bigint auto_increment not null,
  head_line                 varchar(255),
  xml                       varchar(255),
  date                      varchar(255),
  sort                      integer,
  constraint pk_news primary key (id))
;

create table resource (
  id                        bigint auto_increment not null,
  url                       varchar(255),
  tags                      varchar(255),
  meta_data                 varchar(255),
  date                      varchar(255),
  constraint pk_resource primary key (id))
;


create table news_resource (
  news_id                        bigint not null,
  resource_id                    bigint not null,
  constraint pk_news_resource primary key (news_id, resource_id))
;



alter table news_resource add constraint fk_news_resource_news_01 foreign key (news_id) references news (id) on delete restrict on update restrict;

alter table news_resource add constraint fk_news_resource_resource_02 foreign key (resource_id) references resource (id) on delete restrict on update restrict;

# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table news;

drop table news_resource;

drop table resource;

SET FOREIGN_KEY_CHECKS=1;

