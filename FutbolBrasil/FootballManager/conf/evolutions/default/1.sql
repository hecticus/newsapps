# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table actions (
  id_actions                integer auto_increment not null,
  mnemonic                  varchar(255),
  description               varchar(255),
  constraint uq_actions_1 unique (mnemonic),
  constraint pk_actions primary key (id_actions))
;

create table apps (
  id_app                    integer auto_increment not null,
  name                      varchar(255),
  status                    integer,
  debug                     tinyint(1) default 0,
  type                      integer,
  id_language               integer,
  id_timezone               integer,
  constraint pk_apps primary key (id_app))
;

create table competitions (
  id_competitions           bigint auto_increment not null,
  name                      varchar(255),
  ext_id                    bigint,
  id_app                    integer,
  status                    integer,
  id_comp_type              integer,
  constraint pk_competitions primary key (id_competitions))
;

create table competition_type (
  id_comp_type              integer auto_increment not null,
  status                    integer,
  name                      varchar(255),
  type                      integer,
  ext_id                    bigint,
  constraint pk_competition_type primary key (id_comp_type))
;

create table configs (
  id_config                 bigint auto_increment not null,
  key_name                  varchar(255),
  value                     varchar(255),
  description               varchar(255),
  constraint pk_configs primary key (id_config))
;

create table countries (
  id_countries              bigint auto_increment not null,
  name                      varchar(255),
  ext_id                    bigint,
  constraint pk_countries primary key (id_countries))
;

create table game_matches (
  id_game_matches           bigint auto_increment not null,
  id_phases                 bigint,
  id_home_team              bigint,
  id_away_team              bigint,
  id_venue                  bigint,
  fifa_match_number         bigint,
  home_team_name            varchar(255),
  away_team_name            varchar(255),
  home_team_goals           integer,
  away_team_goals           integer,
  date                      varchar(14),
  status                    varchar(255),
  started                   integer,
  live                      integer,
  finished                  integer,
  suspended                 integer,
  ext_id                    bigint,
  fn                        integer,
  id_competition            bigint,
  constraint pk_game_matches primary key (id_game_matches))
;

create table game_match_events (
  id_game_match_events      bigint auto_increment not null,
  id_game_matches           bigint,
  id_periods                integer,
  id_actions                integer,
  id_teams                  bigint,
  player_a                  varchar(255),
  player_b                  varchar(255),
  action_minute             integer,
  date                      varchar(255),
  _sort                     integer,
  constraint pk_game_match_events primary key (id_game_match_events))
;

create table game_match_results (
  id_game_match_results     bigint auto_increment not null,
  id_game_matches           bigint,
  home_team_goals_half      integer,
  away_team_goals_half      integer,
  home_team_goals_90        integer,
  away_team_goals_90        integer,
  home_team_goals_105       integer,
  away_team_goals_105       integer,
  home_team_goals_120       integer,
  away_team_goals_120       integer,
  home_team_goals_shootout  integer,
  away_team_goals_shootout  integer,
  score_str                 varchar(255),
  constraint pk_game_match_results primary key (id_game_match_results))
;

create table instances (
  id_instance               bigint auto_increment not null,
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

create table linked_account (
  id                        bigint auto_increment not null,
  user_id                   bigint,
  provider_user_id          varchar(255),
  provider_key              varchar(255),
  constraint pk_linked_account primary key (id))
;

create table news (
  id_news                   bigint auto_increment not null,
  status                    integer,
  title                     varchar(255),
  summary                   TEXT,
  categories                varchar(255),
  keyword                   varchar(255),
  author                    varchar(255),
  news_body                 TEXT,
  publication_date          varchar(14),
  inserted_date             varchar(14),
  updated_date              varchar(14),
  language                  integer,
  source                    varchar(255),
  featured                  tinyint(1) default 0,
  external_id               integer,
  push_status               integer,
  push_date                 bigint,
  id_category               bigint,
  id_app                    integer,
  id_language               integer,
  crc                       varchar(32),
  constraint pk_news primary key (id_news))
;

create table periods (
  id_periods                integer auto_increment not null,
  name                      varchar(255),
  short_name                varchar(255),
  ext_id                    bigint,
  constraint uq_periods_1 unique (name,short_name),
  constraint pk_periods primary key (id_periods))
;

create table phases (
  id_phases                 bigint auto_increment not null,
  id_competitions           bigint,
  global_name               varchar(255),
  name                      varchar(255),
  start_date                varchar(255),
  end_date                  varchar(255),
  ext_id                    bigint,
  orden                     integer,
  nivel                     integer,
  fn                        integer,
  constraint pk_phases primary key (id_phases))
;

create table ranking (
  id_ranking                bigint auto_increment not null,
  id_phases                 bigint,
  id_teams                  bigint,
  matches                   bigint,
  matches_won               bigint,
  matches_draw              bigint,
  matches_lost              bigint,
  points                    bigint,
  goals_for                 bigint,
  goal_against              bigint,
  matches_local             integer,
  matches_visitor           integer,
  matches_local_won         integer,
  matches_local_draw        integer,
  matches_local_lost        integer,
  matches_visitor_won       integer,
  matches_visitor_draw      integer,
  matches_visitor_lost      integer,
  goals_for_local           integer,
  goal_against_local        integer,
  goals_for_visitor         integer,
  goal_against_visitor      integer,
  goal_diff                 integer,
  points_local              integer,
  points_visitor            integer,
  yellow_cards              integer,
  red_cards                 integer,
  double_yellow_card        integer,
  penalty_fouls             integer,
  penalty_hands             integer,
  fouls_commited            integer,
  fouls_received            integer,
  penalty_fouls_received    integer,
  nivel                     integer,
  nivel_desc                varchar(255),
  orden                     integer,
  orden_desc                varchar(255),
  streak                    varchar(255),
  constraint pk_ranking primary key (id_ranking))
;

create table resources (
  id_resource               bigint auto_increment not null,
  name                      varchar(255),
  filename                  varchar(255),
  remote_location           varchar(255),
  generic_name              varchar(255),
  description               varchar(255),
  res                       varchar(255),
  type                      integer,
  status                    integer,
  inserted_time             varchar(255),
  creation_time             varchar(255),
  metadata                  TEXT,
  id_app                    integer,
  news_id_news              bigint,
  constraint pk_resources primary key (id_resource))
;

create table scorers (
  id_scorer                 integer auto_increment not null,
  name                      varchar(255),
  full_name                 varchar(255),
  nickname                  varchar(255),
  id_teams                  bigint,
  goals                     integer,
  byplay                    integer,
  header                    integer,
  free_kick                 integer,
  penalty                   integer,
  id_country                bigint,
  external_id               varchar(255),
  id_competition            bigint,
  date                      varchar(255),
  constraint pk_scorers primary key (id_scorer))
;

create table security_role (
  id                        bigint auto_increment not null,
  role_name                 varchar(255),
  constraint pk_security_role primary key (id))
;

create table teams (
  id_teams                  bigint auto_increment not null,
  name                      varchar(255),
  id_countries              bigint,
  ext_id                    bigint,
  constraint pk_teams primary key (id_teams))
;

create table timezones (
  id_timezone               integer auto_increment not null,
  name                      varchar(255),
  constraint pk_timezones primary key (id_timezone))
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

create table venues (
  id_venues                 bigint auto_increment not null,
  id_country                bigint,
  city_name                 varchar(255),
  stadium_name              varchar(255),
  ext_city_id               bigint,
  ext_stadium_id            bigint,
  ext_id                    bigint,
  constraint pk_venues primary key (id_venues))
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
alter table apps add constraint fk_apps_timezone_1 foreign key (id_timezone) references timezones (id_timezone) on delete restrict on update restrict;
create index ix_apps_timezone_1 on apps (id_timezone);
alter table competitions add constraint fk_competitions_type_2 foreign key (id_comp_type) references competition_type (id_comp_type) on delete restrict on update restrict;
create index ix_competitions_type_2 on competitions (id_comp_type);
alter table game_matches add constraint fk_game_matches_phase_3 foreign key (id_phases) references phases (id_phases) on delete restrict on update restrict;
create index ix_game_matches_phase_3 on game_matches (id_phases);
alter table game_matches add constraint fk_game_matches_homeTeam_4 foreign key (id_home_team) references teams (id_teams) on delete restrict on update restrict;
create index ix_game_matches_homeTeam_4 on game_matches (id_home_team);
alter table game_matches add constraint fk_game_matches_awayTeam_5 foreign key (id_away_team) references teams (id_teams) on delete restrict on update restrict;
create index ix_game_matches_awayTeam_5 on game_matches (id_away_team);
alter table game_matches add constraint fk_game_matches_venue_6 foreign key (id_venue) references venues (id_venues) on delete restrict on update restrict;
create index ix_game_matches_venue_6 on game_matches (id_venue);
alter table game_matches add constraint fk_game_matches_competition_7 foreign key (id_competition) references competitions (id_competitions) on delete restrict on update restrict;
create index ix_game_matches_competition_7 on game_matches (id_competition);
alter table game_match_events add constraint fk_game_match_events_gameMatch_8 foreign key (id_game_matches) references game_matches (id_game_matches) on delete restrict on update restrict;
create index ix_game_match_events_gameMatch_8 on game_match_events (id_game_matches);
alter table game_match_events add constraint fk_game_match_events_period_9 foreign key (id_periods) references periods (id_periods) on delete restrict on update restrict;
create index ix_game_match_events_period_9 on game_match_events (id_periods);
alter table game_match_events add constraint fk_game_match_events_action_10 foreign key (id_actions) references actions (id_actions) on delete restrict on update restrict;
create index ix_game_match_events_action_10 on game_match_events (id_actions);
alter table game_match_events add constraint fk_game_match_events_team_11 foreign key (id_teams) references teams (id_teams) on delete restrict on update restrict;
create index ix_game_match_events_team_11 on game_match_events (id_teams);
alter table game_match_results add constraint fk_game_match_results_gameMatch_12 foreign key (id_game_matches) references game_matches (id_game_matches) on delete restrict on update restrict;
create index ix_game_match_results_gameMatch_12 on game_match_results (id_game_matches);
alter table linked_account add constraint fk_linked_account_user_13 foreign key (user_id) references users (id) on delete restrict on update restrict;
create index ix_linked_account_user_13 on linked_account (user_id);
alter table phases add constraint fk_phases_comp_14 foreign key (id_competitions) references competitions (id_competitions) on delete restrict on update restrict;
create index ix_phases_comp_14 on phases (id_competitions);
alter table ranking add constraint fk_ranking_phase_15 foreign key (id_phases) references phases (id_phases) on delete restrict on update restrict;
create index ix_ranking_phase_15 on ranking (id_phases);
alter table ranking add constraint fk_ranking_team_16 foreign key (id_teams) references teams (id_teams) on delete restrict on update restrict;
create index ix_ranking_team_16 on ranking (id_teams);
alter table resources add constraint fk_resources_parent_17 foreign key (news_id_news) references news (id_news) on delete restrict on update restrict;
create index ix_resources_parent_17 on resources (news_id_news);
alter table scorers add constraint fk_scorers_team_18 foreign key (id_teams) references teams (id_teams) on delete restrict on update restrict;
create index ix_scorers_team_18 on scorers (id_teams);
alter table scorers add constraint fk_scorers_country_19 foreign key (id_country) references countries (id_countries) on delete restrict on update restrict;
create index ix_scorers_country_19 on scorers (id_country);
alter table teams add constraint fk_teams_country_20 foreign key (id_countries) references countries (id_countries) on delete restrict on update restrict;
create index ix_teams_country_20 on teams (id_countries);
alter table token_action add constraint fk_token_action_targetUser_21 foreign key (target_user_id) references users (id) on delete restrict on update restrict;
create index ix_token_action_targetUser_21 on token_action (target_user_id);
alter table venues add constraint fk_venues_country_22 foreign key (id_country) references countries (id_countries) on delete restrict on update restrict;
create index ix_venues_country_22 on venues (id_country);



alter table users_security_role add constraint fk_users_security_role_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;

alter table users_security_role add constraint fk_users_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;

alter table users_user_permission add constraint fk_users_user_permission_users_01 foreign key (users_id) references users (id) on delete restrict on update restrict;

alter table users_user_permission add constraint fk_users_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;

# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table actions;

drop table apps;

drop table competitions;

drop table competition_type;

drop table configs;

drop table countries;

drop table game_matches;

drop table game_match_events;

drop table game_match_results;

drop table instances;

drop table jobs;

drop table linked_account;

drop table news;

drop table periods;

drop table phases;

drop table ranking;

drop table resources;

drop table scorers;

drop table security_role;

drop table teams;

drop table timezones;

drop table token_action;

drop table users;

drop table users_security_role;

drop table users_user_permission;

drop table user_permission;

drop table venues;

SET FOREIGN_KEY_CHECKS=1;

