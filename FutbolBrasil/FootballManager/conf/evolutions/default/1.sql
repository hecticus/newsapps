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
  constraint pk_apps primary key (id_app))
;

create table competitions (
  id_competitions           bigint auto_increment not null,
  name                      varchar(255),
  ext_id                    bigint,
  id_app                    integer,
  status                    integer,
  constraint pk_competitions primary key (id_competitions))
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

create table fixtures (
  id_fixture                bigint auto_increment not null,
  external_id               bigint,
  match_date                varchar(255),
  phase                     varchar(255),
  stadium                   varchar(255),
  local_team                varchar(255),
  local_team_goals          varchar(255),
  local_team_penalties      varchar(255),
  local_team_scoring_players varchar(255),
  away_team                 varchar(255),
  away_team_goals           varchar(255),
  away_team_penalties       varchar(255),
  away_team_scoring_players varchar(255),
  match_status              varchar(255),
  match_description         varchar(255),
  formated_date             varchar(255),
  media                     varchar(255),
  constraint pk_fixtures primary key (id_fixture))
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
  date                      varchar(255),
  status                    varchar(255),
  started                   integer,
  live                      integer,
  finished                  integer,
  suspended                 integer,
  ext_id                    bigint,
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
  constraint pk_jobs primary key (id))
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
  ranking                   bigint,
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
  id_round                  integer,
  id_competition            bigint,
  date                      varchar(255),
  constraint pk_scorers primary key (id_scorer))
;

create table teams (
  id_teams                  bigint auto_increment not null,
  name                      varchar(255),
  id_countries              bigint,
  ext_id                    bigint,
  constraint pk_teams primary key (id_teams))
;

create table venues (
  id_venues                 bigint auto_increment not null,
  id_country                bigint,
  city_name                 varchar(255),
  stadium_name              varchar(255),
  ext_city_id               bigint,
  ext_stadium_id            bigint,
  constraint pk_venues primary key (id_venues))
;

alter table game_matches add constraint fk_game_matches_phase_1 foreign key (id_phases) references phases (id_phases) on delete restrict on update restrict;
create index ix_game_matches_phase_1 on game_matches (id_phases);
alter table game_matches add constraint fk_game_matches_homeTeam_2 foreign key (id_home_team) references teams (id_teams) on delete restrict on update restrict;
create index ix_game_matches_homeTeam_2 on game_matches (id_home_team);
alter table game_matches add constraint fk_game_matches_awayTeam_3 foreign key (id_away_team) references teams (id_teams) on delete restrict on update restrict;
create index ix_game_matches_awayTeam_3 on game_matches (id_away_team);
alter table game_matches add constraint fk_game_matches_venue_4 foreign key (id_venue) references venues (id_venues) on delete restrict on update restrict;
create index ix_game_matches_venue_4 on game_matches (id_venue);
alter table game_match_events add constraint fk_game_match_events_gameMatch_5 foreign key (id_game_matches) references game_matches (id_game_matches) on delete restrict on update restrict;
create index ix_game_match_events_gameMatch_5 on game_match_events (id_game_matches);
alter table game_match_events add constraint fk_game_match_events_period_6 foreign key (id_periods) references periods (id_periods) on delete restrict on update restrict;
create index ix_game_match_events_period_6 on game_match_events (id_periods);
alter table game_match_events add constraint fk_game_match_events_action_7 foreign key (id_actions) references actions (id_actions) on delete restrict on update restrict;
create index ix_game_match_events_action_7 on game_match_events (id_actions);
alter table game_match_events add constraint fk_game_match_events_team_8 foreign key (id_teams) references teams (id_teams) on delete restrict on update restrict;
create index ix_game_match_events_team_8 on game_match_events (id_teams);
alter table game_match_results add constraint fk_game_match_results_gameMatch_9 foreign key (id_game_matches) references game_matches (id_game_matches) on delete restrict on update restrict;
create index ix_game_match_results_gameMatch_9 on game_match_results (id_game_matches);
alter table phases add constraint fk_phases_comp_10 foreign key (id_competitions) references competitions (id_competitions) on delete restrict on update restrict;
create index ix_phases_comp_10 on phases (id_competitions);
alter table ranking add constraint fk_ranking_phase_11 foreign key (id_phases) references phases (id_phases) on delete restrict on update restrict;
create index ix_ranking_phase_11 on ranking (id_phases);
alter table ranking add constraint fk_ranking_team_12 foreign key (id_teams) references teams (id_teams) on delete restrict on update restrict;
create index ix_ranking_team_12 on ranking (id_teams);
alter table resources add constraint fk_resources_parent_13 foreign key (news_id_news) references news (id_news) on delete restrict on update restrict;
create index ix_resources_parent_13 on resources (news_id_news);
alter table scorers add constraint fk_scorers_team_14 foreign key (id_teams) references teams (id_teams) on delete restrict on update restrict;
create index ix_scorers_team_14 on scorers (id_teams);
alter table scorers add constraint fk_scorers_country_15 foreign key (id_country) references countries (id_countries) on delete restrict on update restrict;
create index ix_scorers_country_15 on scorers (id_country);
alter table teams add constraint fk_teams_country_16 foreign key (id_countries) references countries (id_countries) on delete restrict on update restrict;
create index ix_teams_country_16 on teams (id_countries);
alter table venues add constraint fk_venues_country_17 foreign key (id_country) references countries (id_countries) on delete restrict on update restrict;
create index ix_venues_country_17 on venues (id_country);



# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table actions;

drop table apps;

drop table competitions;

drop table configs;

drop table countries;

drop table fixtures;

drop table game_matches;

drop table game_match_events;

drop table game_match_results;

drop table instances;

drop table jobs;

drop table news;

drop table periods;

drop table phases;

drop table ranking;

drop table resources;

drop table scorers;

drop table teams;

drop table venues;

SET FOREIGN_KEY_CHECKS=1;

