
drop table if exists activities cascade;
drop table if exists debug;
drop table if exists fund;
drop table if exists issues;
drop table if exists location;
drop table if exists notification;
drop table if exists organizations;
drop table if exists personelle;
drop table if exists public_holidays;
drop table if exists rdo_eligibility;   --Deprecated
drop table if exists recipient;
drop table if exists timesheets;
drop table if exists ts_issue;
drop table if exists ts_user_t;
drop table if exists user_work_schedule;
drop table if exists users cascade;
drop table if exists work_schedule;
drop view if exists leave_balances cascade;
drop table if exists ts_timesheet_t cascade;
drop table if exists staff_hierarchy;

/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 160002 (160002)
 Source Host           : localhost:5432
 Source Catalog        : ntimes
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 160002 (160002)
 File Encoding         : 65001

 Date: 03/07/2024 20:18:53
*/


-- ----------------------------
-- Type structure for status_enum
-- ----------------------------
DROP TYPE IF EXISTS "public"."status_enum";
CREATE TYPE "public"."status_enum" AS ENUM (
  'user_defined',
  'emergency'
);
ALTER TYPE "public"."status_enum" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for activities_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."activities_id_seq";
CREATE SEQUENCE "public"."activities_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for fund_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."fund_id_seq";
CREATE SEQUENCE "public"."fund_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for issues_issue_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."issues_issue_id_seq";
CREATE SEQUENCE "public"."issues_issue_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for location_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."location_id_seq";
CREATE SEQUENCE "public"."location_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_notification_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notification_notification_id_seq";
CREATE SEQUENCE "public"."notification_notification_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for organizations_org_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."organizations_org_id_seq";
CREATE SEQUENCE "public"."organizations_org_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for public_holidays_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."public_holidays_id_seq";
CREATE SEQUENCE "public"."public_holidays_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for recipient_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."recipient_id_seq";
CREATE SEQUENCE "public"."recipient_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for timesheets_timesheet_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."timesheets_timesheet_id_seq";
CREATE SEQUENCE "public"."timesheets_timesheet_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ts_timesheet_t_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ts_timesheet_t_id_seq";
CREATE SEQUENCE "public"."ts_timesheet_t_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ts_user_t_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ts_user_t_id_seq";
CREATE SEQUENCE "public"."ts_user_t_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for work_schedule_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."work_schedule_id_seq";
CREATE SEQUENCE "public"."work_schedule_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP TABLE IF EXISTS "public"."activities";
CREATE TABLE "public"."activities" (
  "id" int4 NOT NULL DEFAULT nextval('activities_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "programs" int4[],
  "percentages" numeric(5,2)[],
  "status" "public"."status_enum" NOT NULL DEFAULT 'user_defined'::status_enum,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "user_id" int4,
  "org_id" int4
)
;

-- ----------------------------
-- Records of activities
-- ----------------------------
INSERT INTO "public"."activities" VALUES (8, 'asdf', '{123,123123}', '{123.00,123.00}', 'emergency', '2024-04-08 22:05:25.981509', '2024-04-08 22:05:25.981509', NULL, 1);
INSERT INTO "public"."activities" VALUES (1, 'Activity', '{615,665}', '{60.00,40.00}', 'user_defined', '2024-04-05 06:21:36.943327', '2024-04-09 09:49:58.198278', 1, 1);
INSERT INTO "public"."activities" VALUES (6, 'gwapo ko', '{515,555,222}', '{30.00,70.00,12.00}', 'emergency', '2024-04-06 07:09:35.502979', '2024-04-09 09:50:57.99317', 1, 1);
INSERT INTO "public"."activities" VALUES (7, 'Activty Gwapo ko ', '{414,424,212}', '{50.00,50.00,12.00}', 'emergency', '2024-04-06 07:10:32.519919', '2024-04-09 09:52:18.549419', 1, 1);
INSERT INTO "public"."activities" VALUES (9, 'jayajay', '{123123,123}', '{30.00,100.00}', 'emergency', '2024-04-09 06:45:43.959776', '2024-04-09 09:53:17.845679', 1, 1);
INSERT INTO "public"."activities" VALUES (14, 'Gwapo ko Activity', '{123,123}', '{12.00,12.00}', 'emergency', '2024-04-09 08:08:03.415185', '2024-04-09 20:40:03.749021', 1, 1);
INSERT INTO "public"."activities" VALUES (16, '2', '{12}', '{10.00}', 'emergency', '2024-06-25 12:20:27.943323', '2024-06-25 12:20:27.943323', 21, NULL);
INSERT INTO "public"."activities" VALUES (17, 'asdf', '{123}', '{20.00}', 'emergency', '2024-06-25 14:33:31.149778', '2024-06-25 14:33:31.149778', 21, NULL);
INSERT INTO "public"."activities" VALUES (18, 'asdasd', '{123,1233}', '{12.00,10.00}', 'user_defined', '2024-06-25 14:36:19.927906', '2024-06-25 14:36:19.927906', 21, NULL);
INSERT INTO "public"."activities" VALUES (19, 'asdfasdf', '{123,1231231}', '{20.00,20.00}', 'emergency', '2024-06-25 14:39:54.976916', '2024-06-25 14:40:07.90104', 21, 1);

-- ----------------------------
-- Table structure for fund
-- ----------------------------
DROP TABLE IF EXISTS "public"."fund";
CREATE TABLE "public"."fund" (
  "id" int4 NOT NULL DEFAULT nextval('fund_id_seq'::regclass),
  "fund_source_num" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "fund_source_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of fund
-- ----------------------------
INSERT INTO "public"."fund" VALUES (1, '000', '000 Non Fund Source Related');
INSERT INTO "public"."fund" VALUES (2, '100', '100 Insurance Claims - General');
INSERT INTO "public"."fund" VALUES (3, '200', '200 Box Ironbark - Output');
INSERT INTO "public"."fund" VALUES (4, '210', '210 DSE - Devil Bend - Output');
INSERT INTO "public"."fund" VALUES (5, '220', '220 DSE - Point Nepean');
INSERT INTO "public"."fund" VALUES (6, '230', '230 BERC (Bays and Maritime) - Output');
INSERT INTO "public"."fund" VALUES (7, '240', '240 BERC (Enhancing Vic''s Parks and Reserves) - Output');
INSERT INTO "public"."fund" VALUES (8, '250', '250 BERC (Great Trails for a Liveable City) - Output');
INSERT INTO "public"."fund" VALUES (9, '260', '260 BERC (Mullum Mullum) - Output');
INSERT INTO "public"."fund" VALUES (10, '270', '270 BERC (National Park Upgrades) - Output');
INSERT INTO "public"."fund" VALUES (11, '280', '280 BERC (Natural Values Management) - Output');
INSERT INTO "public"."fund" VALUES (12, '290', '290 BERC (Otways) - Output');
INSERT INTO "public"."fund" VALUES (13, '300', '300 BERC (Point Nepean) - Output');
INSERT INTO "public"."fund" VALUES (14, '310', '310 BERC (Urban Parks and Trails) - Output');

-- ----------------------------
-- Table structure for issues
-- ----------------------------
DROP TABLE IF EXISTS "public"."issues";
CREATE TABLE "public"."issues" (
  "issue_code" varchar(255) COLLATE "pg_catalog"."default",
  "issue_type" varchar(255) COLLATE "pg_catalog"."default",
  "issue_message" text COLLATE "pg_catalog"."default",
  "issue_id" int4 NOT NULL DEFAULT nextval('issues_issue_id_seq'::regclass)
)
;

-- ----------------------------
-- Records of issues
-- ----------------------------
INSERT INTO "public"."issues" VALUES ('issue1', 'non-check', 'The Variance is Greater than 2', 1);
INSERT INTO "public"."issues" VALUES ('issue2', 'check', 'The Total hours is less than 4 hours', 2);
INSERT INTO "public"."issues" VALUES ('issue3', 'check', 'The Total hours is greater than 11 hours', 3);
INSERT INTO "public"."issues" VALUES ('issue4', 'check', 'The User work more than 10 days in a row', 4);
INSERT INTO "public"."issues" VALUES ('issue5', 'check', 'The User work more than 7 days in a row', 5);

-- ----------------------------
-- Table structure for location
-- ----------------------------
DROP TABLE IF EXISTS "public"."location";
CREATE TABLE "public"."location" (
  "id" int4 NOT NULL DEFAULT nextval('location_id_seq'::regclass),
  "location_id" int4,
  "location_name" varchar(255) COLLATE "pg_catalog"."default",
  "role_id" int4,
  "org_id" int4
)
;

-- ----------------------------
-- Records of location
-- ----------------------------
INSERT INTO "public"."location" VALUES (6, 149, 'Anglesea Do Not Use', NULL, 1);
INSERT INTO "public"."location" VALUES (8, 127348, 'Bacchus Marsh Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (9, 151, 'Bacchus Marsh Office', NULL, 1);
INSERT INTO "public"."location" VALUES (10, 152, 'Bairnsdale', NULL, 1);
INSERT INTO "public"."location" VALUES (11, 135695, 'Bairnsdale (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (155, 245, 'Warrnambool', NULL, 1);
INSERT INTO "public"."location" VALUES (156, 246, 'Werribee Park', NULL, 1);
INSERT INTO "public"."location" VALUES (157, 247, 'Werrimull', NULL, 1);
INSERT INTO "public"."location" VALUES (158, 248, 'Westerfolds', NULL, 1);
INSERT INTO "public"."location" VALUES (12, 153, 'Ballarat', NULL, 1);
INSERT INTO "public"."location" VALUES (13, 127349, 'Balook Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (14, 154, 'Beaufort', NULL, 1);
INSERT INTO "public"."location" VALUES (15, 155, 'Beechworth', NULL, 1);
INSERT INTO "public"."location" VALUES (16, 156, 'Benalla', NULL, 1);
INSERT INTO "public"."location" VALUES (17, 157, 'Bendigo', NULL, 1);
INSERT INTO "public"."location" VALUES (18, 158, 'Bendoc', NULL, 1);
INSERT INTO "public"."location" VALUES (19, 127350, 'Blackbird Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (20, 263, 'Bourke Street', NULL, 1);
INSERT INTO "public"."location" VALUES (21, 142, 'Bourke Street - OLD', NULL, 1);
INSERT INTO "public"."location" VALUES (22, 22186, 'Box Hill', NULL, 1);
INSERT INTO "public"."location" VALUES (23, 159, 'Braeside Park', NULL, 1);
INSERT INTO "public"."location" VALUES (24, 135687, 'Bright (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (25, 160, 'Bright (Office)', NULL, 1);
INSERT INTO "public"."location" VALUES (26, 135696, 'Brimbank (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (27, 161, 'Brimbank Park', NULL, 1);
INSERT INTO "public"."location" VALUES (28, 162, 'Brimbank Park -Ctl Ro', NULL, 1);
INSERT INTO "public"."location" VALUES (29, 127351, 'Buchan Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (30, 163, 'Buchan Office', NULL, 1);
INSERT INTO "public"."location" VALUES (31, 164, 'Burnley', NULL, 1);
INSERT INTO "public"."location" VALUES (32, 165, 'Bushy Park (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (33, 166, 'Cann River', NULL, 1);
INSERT INTO "public"."location" VALUES (34, 130975, 'Cape Conran (Office)', NULL, 1);
INSERT INTO "public"."location" VALUES (35, 167, 'Casterton', NULL, 1);
INSERT INTO "public"."location" VALUES (36, 168, 'Castlemaine', NULL, 1);
INSERT INTO "public"."location" VALUES (37, 10395, 'Cohuna', NULL, 1);
INSERT INTO "public"."location" VALUES (38, 10374, 'Cohuna (OLD)', NULL, 1);
INSERT INTO "public"."location" VALUES (39, 169, 'Colac', NULL, 1);
INSERT INTO "public"."location" VALUES (40, 135697, 'Colac (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (41, 170, 'Coolart', NULL, 1);
INSERT INTO "public"."location" VALUES (42, 171, 'Creswick', NULL, 1);
INSERT INTO "public"."location" VALUES (43, 224, 'Dandenong Ranges Botanic Garden', NULL, 1);
INSERT INTO "public"."location" VALUES (44, 172, 'Dargo', NULL, 1);
INSERT INTO "public"."location" VALUES (45, 127352, 'Deddick (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (46, 173, 'Dharnya Centre', NULL, 1);
INSERT INTO "public"."location" VALUES (47, 174, 'Dunkeld', NULL, 1);
INSERT INTO "public"."location" VALUES (48, 127353, 'Echuca Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (49, 175, 'Echuca Office', NULL, 1);
INSERT INTO "public"."location" VALUES (50, 176, 'Erica', NULL, 1);
INSERT INTO "public"."location" VALUES (51, 177, 'Ferntree Gully', NULL, 1);
INSERT INTO "public"."location" VALUES (52, 178, 'Forrest', NULL, 1);
INSERT INTO "public"."location" VALUES (53, 179, 'Foster (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (54, 135699, 'Foster (Office)', NULL, 1);
INSERT INTO "public"."location" VALUES (55, 135698, 'Foster Primary (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (56, 180, 'French Island', NULL, 1);
INSERT INTO "public"."location" VALUES (57, 181, 'Gabo Island', NULL, 1);
INSERT INTO "public"."location" VALUES (58, 182, 'Geelong Do Not Use', NULL, 1);
INSERT INTO "public"."location" VALUES (59, 183, 'Gembrook', NULL, 1);
INSERT INTO "public"."location" VALUES (60, 127354, 'Halls Gap Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (61, 184, 'Halls Gap Office', NULL, 1);
INSERT INTO "public"."location" VALUES (62, 127355, 'Hattah Kulkyne Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (63, 185, 'Hattah Kulkyne Office', NULL, 1);
INSERT INTO "public"."location" VALUES (64, 186, 'Heyfield', NULL, 1);
INSERT INTO "public"."location" VALUES (65, 187, 'Hopetoun (Office)', NULL, 1);
INSERT INTO "public"."location" VALUES (66, 188, 'Horsham', NULL, 1);
INSERT INTO "public"."location" VALUES (67, 189, 'Inglewood', NULL, 1);
INSERT INTO "public"."location" VALUES (68, 135700, 'Inverloch (Office & Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (69, 190, 'Irymple', NULL, 1);
INSERT INTO "public"."location" VALUES (70, 191, 'Kerang (Office)', NULL, 1);
INSERT INTO "public"."location" VALUES (71, 192, 'Kinglake', NULL, 1);
INSERT INTO "public"."location" VALUES (72, 135701, 'Kinglake (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (73, 119588, 'Knoxfield', NULL, 1);
INSERT INTO "public"."location" VALUES (74, 127358, 'Lake Eildon Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (75, 193, 'Lake Eildon Office', NULL, 1);
INSERT INTO "public"."location" VALUES (76, 23092, 'Launching Way', NULL, 1);
INSERT INTO "public"."location" VALUES (77, 194, 'Lavers Hill', NULL, 1);
INSERT INTO "public"."location" VALUES (78, 195, 'Loch Sport', NULL, 1);
INSERT INTO "public"."location" VALUES (79, 196, 'Lorne', NULL, 1);
INSERT INTO "public"."location" VALUES (80, 197, 'Lysterfield', NULL, 1);
INSERT INTO "public"."location" VALUES (81, 198, 'Macarthur Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (82, 199, 'Macedon', NULL, 1);
INSERT INTO "public"."location" VALUES (83, 127359, 'Mallacoota Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (84, 200, 'Mallacoota Office', NULL, 1);
INSERT INTO "public"."location" VALUES (85, 201, 'Mansfield', NULL, 1);
INSERT INTO "public"."location" VALUES (86, 202, 'Maroondah', NULL, 1);
INSERT INTO "public"."location" VALUES (87, 135702, 'Maroondah (Office and Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (88, 203, 'Maryborough', NULL, 1);
INSERT INTO "public"."location" VALUES (89, 204, 'Marysville', NULL, 1);
INSERT INTO "public"."location" VALUES (90, 205, 'Mildura', NULL, 1);
INSERT INTO "public"."location" VALUES (91, 135703, 'Morwell (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (92, 121468, 'Mount Eccles', NULL, 1);
INSERT INTO "public"."location" VALUES (93, 206, 'Mt Beauty', NULL, 1);
INSERT INTO "public"."location" VALUES (94, 207, 'Mt Buffalo', NULL, 1);
INSERT INTO "public"."location" VALUES (95, 127360, 'Nathalia Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (96, 208, 'Nathalia Office', NULL, 1);
INSERT INTO "public"."location" VALUES (97, 209, 'Natimuk', NULL, 1);
INSERT INTO "public"."location" VALUES (98, 210, 'National WSC', NULL, 1);
INSERT INTO "public"."location" VALUES (99, 211, 'Nelson', NULL, 1);
INSERT INTO "public"."location" VALUES (100, 212, 'Nhill', NULL, 1);
INSERT INTO "public"."location" VALUES (101, 16423, 'Nicholson Street', NULL, 1);
INSERT INTO "public"."location" VALUES (102, 213, 'Nyerimilang', NULL, 1);
INSERT INTO "public"."location" VALUES (103, 214, 'Olinda', NULL, 1);
INSERT INTO "public"."location" VALUES (104, 127361, 'Omeo Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (105, 215, 'Omeo Office', NULL, 1);
INSERT INTO "public"."location" VALUES (106, 216, 'Orbost', NULL, 1);
INSERT INTO "public"."location" VALUES (107, 135704, 'Orbost (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (108, 217, 'Organ Pipes', NULL, 1);
INSERT INTO "public"."location" VALUES (109, 302, 'Parks Victoria', NULL, 1);
INSERT INTO "public"."location" VALUES (110, 9260, 'Patterson River', NULL, 1);
INSERT INTO "public"."location" VALUES (111, 218, 'Plenty Gorge', NULL, 1);
INSERT INTO "public"."location" VALUES (112, 219, 'Point Cook', NULL, 1);
INSERT INTO "public"."location" VALUES (113, 130972, 'Point Hicks Lighthouse', NULL, 1);
INSERT INTO "public"."location" VALUES (114, 127397, 'Point Nepean Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (115, 9261, 'Point Nepean Office', NULL, 1);
INSERT INTO "public"."location" VALUES (116, 220, 'Port Campbell', NULL, 1);
INSERT INTO "public"."location" VALUES (117, 135705, 'Port Campbell (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (118, 135694, 'Port Welshpool (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (119, 127362, 'Portland Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (159, 249, 'Whitfield', NULL, 1);
INSERT INTO "public"."location" VALUES (160, 250, 'William Ricketts', NULL, 1);
INSERT INTO "public"."location" VALUES (161, 251, 'Williamstown', NULL, 1);
INSERT INTO "public"."location" VALUES (162, 252, 'Wilsons Promontory Lightstation', NULL, 1);
INSERT INTO "public"."location" VALUES (120, 221, 'Portland Office', NULL, 1);
INSERT INTO "public"."location" VALUES (121, 143, 'Queen St', NULL, 1);
INSERT INTO "public"."location" VALUES (122, 222, 'Queenscliff', NULL, 1);
INSERT INTO "public"."location" VALUES (123, 135706, 'Queenscliff Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (124, 424, 'Rainbow', NULL, 1);
INSERT INTO "public"."location" VALUES (125, 223, 'Redcliffs', NULL, 1);
INSERT INTO "public"."location" VALUES (126, 10375, 'Robinvale', NULL, 1);
INSERT INTO "public"."location" VALUES (127, 225, 'Rosebud', NULL, 1);
INSERT INTO "public"."location" VALUES (128, 226, 'Sale', NULL, 1);
INSERT INTO "public"."location" VALUES (129, 227, 'San Remo', NULL, 1);
INSERT INTO "public"."location" VALUES (130, 135707, 'San Remo Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (131, 135708, 'Seawinds (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (132, 228, 'Serendip', NULL, 1);
INSERT INTO "public"."location" VALUES (133, 229, 'Shepherd Road', NULL, 1);
INSERT INTO "public"."location" VALUES (134, 230, 'Shepparton - Do Not Use', NULL, 1);
INSERT INTO "public"."location" VALUES (135, 10376, 'Shepparton Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (136, 231, 'Silvan', NULL, 1);
INSERT INTO "public"."location" VALUES (137, 232, 'Speed', NULL, 1);
INSERT INTO "public"."location" VALUES (138, 233, 'St Arnaud', NULL, 1);
INSERT INTO "public"."location" VALUES (139, 234, 'State Coal Mine', NULL, 1);
INSERT INTO "public"."location" VALUES (140, 235, 'Stawell', NULL, 1);
INSERT INTO "public"."location" VALUES (141, 127363, 'Swan Hill Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (142, 236, 'Swan Hill Office', NULL, 1);
INSERT INTO "public"."location" VALUES (143, 237, 'Tallangatta', NULL, 1);
INSERT INTO "public"."location" VALUES (144, 238, 'Tidal River', NULL, 1);
INSERT INTO "public"."location" VALUES (146, 239, 'Traralgon', NULL, 1);
INSERT INTO "public"."location" VALUES (148, 23090, 'Twelve Apostles Kiosk', NULL, 1);
INSERT INTO "public"."location" VALUES (149, 240, 'Underbool', NULL, 1);
INSERT INTO "public"."location" VALUES (151, 242, 'Wail', NULL, 1);
INSERT INTO "public"."location" VALUES (152, 135711, 'Wangaratta (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (153, 243, 'Wangaratta Office', NULL, 1);
INSERT INTO "public"."location" VALUES (154, 244, 'Warrandyte', NULL, 1);
INSERT INTO "public"."location" VALUES (7, 150, 'Apollo Bay', 123123, 1);
INSERT INTO "public"."location" VALUES (3, 146, 'Alfred Nicolas Gardens ', NULL, 1);
INSERT INTO "public"."location" VALUES (147, 147, 'Anakie', 12031231, 1);
INSERT INTO "public"."location" VALUES (163, 253, 'Wodonga', NULL, 1);
INSERT INTO "public"."location" VALUES (164, 254, 'Wonthaggi', NULL, 1);
INSERT INTO "public"."location" VALUES (165, 255, 'Woodlands', NULL, 1);
INSERT INTO "public"."location" VALUES (166, 256, 'Woori Yallock', NULL, 1);
INSERT INTO "public"."location" VALUES (167, 257, 'Wyperfeld', NULL, 1);
INSERT INTO "public"."location" VALUES (168, 423, 'Yaapeet', NULL, 1);
INSERT INTO "public"."location" VALUES (169, 258, 'Yanakie', NULL, 1);
INSERT INTO "public"."location" VALUES (170, 135712, 'Yanakie (Depot)', NULL, 1);
INSERT INTO "public"."location" VALUES (171, 259, 'Yarra Bend', NULL, 1);
INSERT INTO "public"."location" VALUES (172, 260, 'Yarram (Office)', NULL, 1);
INSERT INTO "public"."location" VALUES (173, 261, 'Yarrawonga', NULL, 1);
INSERT INTO "public"."location" VALUES (174, 262, 'You Yangs Depot', NULL, 1);
INSERT INTO "public"."location" VALUES (175, 127364, 'You Yangs Office', NULL, 1);
INSERT INTO "public"."location" VALUES (176, 1, 'Work from Home', NULL, 1);
INSERT INTO "public"."location" VALUES (177, 2, 'Other Agency Office', NULL, 1);
INSERT INTO "public"."location" VALUES (178, 3, 'F&E Deployment', NULL, 1);
INSERT INTO "public"."location" VALUES (179, 4, 'Remote Location', NULL, 1);
INSERT INTO "public"."location" VALUES (180, 148, 'Anglesea', NULL, 1);
INSERT INTO "public"."location" VALUES (184, 14433, 'Albert Park', 123, 2);
INSERT INTO "public"."location" VALUES (1, 14433, 'Albert Park', NULL, 1);

-- ----------------------------
-- Table structure for notification
-- ----------------------------
DROP TABLE IF EXISTS "public"."notification";
CREATE TABLE "public"."notification" (
  "notification_id" int4 NOT NULL DEFAULT nextval('notification_notification_id_seq'::regclass),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "archive" BOOLEAN DEFAULT FALSE,
  "sender_id" int4 NOT NULL,
  "receiver_id" int4 NOT NULL,
  "read_status" bool DEFAULT false,
  "created_at" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz(6),
  "timesheet_id" int4,
  "sender_message" text COLLATE "pg_catalog"."default",
  "sender_title" varchar(255) COLLATE "pg_catalog"."default",
  "notification_type" varchar(255) COLLATE "pg_catalog"."default",
  "sender_read_status" bool,
  "receiver_read_status" bool
)
;

-- ----------------------------
-- Records of notification
-- ----------------------------
-- INSERT INTO "public"."notification" VALUES (216, 'Timesheet Submitted', 'Your timesheet for the week has been submitted and is pending approval.', 21, 21, 'f', '2024-06-28 17:31:28.020301+08', NULL, 456, NULL, NULL, 'timesheet', 't', 't');




-- ----------------------------
-- Table structure for organizations
-- ----------------------------
DROP TABLE IF EXISTS "public"."organizations";
CREATE TABLE "public"."organizations" (
  "org_name" varchar(255) COLLATE "pg_catalog"."default",
  "org_description" text COLLATE "pg_catalog"."default",
  "org_id" int4 NOT NULL DEFAULT nextval('organizations_org_id_seq'::regclass)
)
;

-- ----------------------------
-- Records of organizations
-- ----------------------------
INSERT INTO "public"."organizations" VALUES ('Org 1', 'The Org 1', 1);
INSERT INTO "public"."organizations" VALUES ('Org 2', 'The Org 2', 2);

-- ----------------------------
-- Table structure for personelle
-- ----------------------------
DROP TABLE IF EXISTS "public"."personelle";
CREATE TABLE "public"."personelle" (
  "person_id" int4,
  "position" varchar(255) COLLATE "pg_catalog"."default",
  "first_name" varchar(255) COLLATE "pg_catalog"."default",
  "last_name" varchar(255) COLLATE "pg_catalog"."default",
  "org_id" int4
)
;

-- ----------------------------
-- Records of personelle
-- ----------------------------
INSERT INTO "public"."personelle" VALUES (1, 'manager', 'John', 'Maher', 1);
INSERT INTO "public"."personelle" VALUES (2, 'manager', 'Tyronne', 'Casboult', 1);
INSERT INTO "public"."personelle" VALUES (3, 'user', 'Nehemiah', 'Gaas', 1);
INSERT INTO "public"."personelle" VALUES (4, 'user', 'Lovely', 'Minoza', 1);
INSERT INTO "public"."personelle" VALUES (5, 'user', 'Jay', 'Flores', 1);


-- ----------------------------
-- Table structure for public_holidays
-- ----------------------------
DROP TABLE IF EXISTS "public"."public_holidays";
CREATE TABLE "public"."public_holidays" (
  "id" int4 NOT NULL DEFAULT nextval('public_holidays_id_seq'::regclass),
  "holiday_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "holiday_date" date NOT NULL
)
;

-- ----------------------------
-- Records of public_holidays
-- ----------------------------
INSERT INTO "public"."public_holidays" VALUES (1, 'New Year''s Day', '2024-01-01');
INSERT INTO "public"."public_holidays" VALUES (2, 'Australia Day', '2024-01-26');
INSERT INTO "public"."public_holidays" VALUES (3, 'Labour Day', '2024-03-11');
INSERT INTO "public"."public_holidays" VALUES (4, 'Good Friday', '2024-03-29');
INSERT INTO "public"."public_holidays" VALUES (5, 'Saturday before Easter Sunday', '2024-03-30');
INSERT INTO "public"."public_holidays" VALUES (6, 'Easter Sunday', '2024-03-31');
INSERT INTO "public"."public_holidays" VALUES (8, 'ANZAC Day', '2024-04-25');
INSERT INTO "public"."public_holidays" VALUES (9, 'King''s Birthday', '2024-06-10');
INSERT INTO "public"."public_holidays" VALUES (10, 'Friday before the AFL Grand Final', '2024-09-27');
INSERT INTO "public"."public_holidays" VALUES (11, 'Melbourne Cup', '2024-11-05');
INSERT INTO "public"."public_holidays" VALUES (12, 'Christmas Day', '2024-12-25');
INSERT INTO "public"."public_holidays" VALUES (13, 'Boxing Day', '2024-12-26');
INSERT INTO "public"."public_holidays" VALUES (7, 'Easter Monday', '2024-04-01');


-- ----------------------------
-- Table structure for recipient
-- ----------------------------
DROP TABLE IF EXISTS "public"."recipient";
CREATE TABLE "public"."recipient" (
  "id" int4 NOT NULL DEFAULT nextval('recipient_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "manager_id" int4,
  "notification_id" int4 NOT NULL,
  "seen" bool DEFAULT false
)
;

-- ----------------------------
-- Records of recipient
-- ----------------------------
INSERT INTO "public"."recipient" VALUES (42, 5, NULL, 42, 't');
INSERT INTO "public"."recipient" VALUES (41, 5, NULL, 41, 't');
INSERT INTO "public"."recipient" VALUES (44, 5, NULL, 44, 't');
INSERT INTO "public"."recipient" VALUES (46, 5, NULL, 46, 't');
INSERT INTO "public"."recipient" VALUES (45, 5, NULL, 45, 't');
INSERT INTO "public"."recipient" VALUES (40, 5, NULL, 40, 't');
INSERT INTO "public"."recipient" VALUES (43, 5, NULL, 43, 't');

-- ----------------------------
-- Table structure for staff_hierarchy
-- ----------------------------
DROP TABLE IF EXISTS "public"."staff_hierarchy";
CREATE TABLE "public"."staff_hierarchy" (
  "user_id" int4 NOT NULL,
  "manager_id" int4 NOT NULL
)
;

-- ----------------------------
-- Records of staff_hierarchy
-- ----------------------------
INSERT INTO "public"."staff_hierarchy" VALUES (1, 2);
INSERT INTO "public"."staff_hierarchy" VALUES (3, 1);
INSERT INTO "public"."staff_hierarchy" VALUES (4, 1);
INSERT INTO "public"."staff_hierarchy" VALUES (5, 1);

-- ----------------------------
-- Table structure for ts_issue
-- ----------------------------
DROP TABLE IF EXISTS "public"."ts_issue";
CREATE TABLE "public"."ts_issue" (
  "ts_id" int4,
  "issue_code" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of ts_issue
-- ----------------------------
INSERT INTO "public"."ts_issue" VALUES (335, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (335, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (335, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (335, 'issue4');
INSERT INTO "public"."ts_issue" VALUES (349, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (350, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (351, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (357, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (358, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (358, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (363, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (365, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (371, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (372, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (377, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (383, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (384, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (386, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (388, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (389, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (392, 'issue4');
INSERT INTO "public"."ts_issue" VALUES (393, 'issue4');
INSERT INTO "public"."ts_issue" VALUES (393, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (393, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (394, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (394, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (394, 'issue4');
INSERT INTO "public"."ts_issue" VALUES (395, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (396, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (402, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (403, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (404, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (405, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (406, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (406, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (412, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (413, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (413, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (414, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (414, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (415, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (432, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (432, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (433, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (434, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (435, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (436, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (438, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (439, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (440, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (442, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (444, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (447, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (448, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (448, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (449, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (450, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (451, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (452, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (453, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (454, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (455, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (457, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (458, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (459, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (460, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (461, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (462, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (463, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (464, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (466, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (466, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (467, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (469, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (470, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (471, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (472, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (474, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (474, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (475, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (475, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (476, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (477, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (477, 'issue3');
INSERT INTO "public"."ts_issue" VALUES (478, 'issue2');
INSERT INTO "public"."ts_issue" VALUES (479, 'issue1');
INSERT INTO "public"."ts_issue" VALUES (479, 'issue3');

-- ----------------------------
-- Table structure for ts_timesheet_t
-- ----------------------------
DROP TABLE IF EXISTS "public"."ts_timesheet_t";
CREATE TABLE "public"."ts_timesheet_t" (
  "id" int4 NOT NULL DEFAULT nextval('ts_timesheet_t_id_seq'::regclass),
  "person_id" int4,
  "username" varchar(31) COLLATE "pg_catalog"."default",
  "work_date" date,
  "time_start" varchar(8) COLLATE "pg_catalog"."default",
  "time_finish" varchar(8) COLLATE "pg_catalog"."default",
  "time_lunch" varchar(8) COLLATE "pg_catalog"."default",
  "time_extra_break" varchar(8) COLLATE "pg_catalog"."default",
  "time_total" varchar(8) COLLATE "pg_catalog"."default",
  "time_flexi" numeric(12,4),
  "time_til" numeric(12,4),
  "time_leave" numeric(12,4),
  "time_overtime" numeric(12,4),
  "time_comm_svs" numeric(12,4),
  "t_comment" text COLLATE "pg_catalog"."default",
  "location_id" int4,
  "activity" varchar(255) COLLATE "pg_catalog"."default",
  "notes" text COLLATE "pg_catalog"."default",
  "entry_date" date,
  "on_duty" int2,
  "duty_category" int2,
  "status" varchar(10) COLLATE "pg_catalog"."default",
  "rwe_day" int2,
  "fund_src" varchar(10) COLLATE "pg_catalog"."default",
  "variance" varchar(255) COLLATE "pg_catalog"."default",
  "variance_type" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of ts_timesheet_t
-- ----------------------------
INSERT INTO "public"."ts_timesheet_t" VALUES (137, 1, 'edflores240@gmail.com', '2024-04-12', '09:00', '23:00', '00:30', '00:00', '14:00', 0.0000, 0.0000, NULL, NULL, NULL, 'okay', 14433, '', '', '2024-04-12', 1, NULL, 'entered', NULL, '', '6.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (140, 1, 'edflores240@gmail.com', '2024-04-17', '09:00', '23:00', '00:30', '00:00', '14:00', 0.0000, 0.0000, NULL, NULL, NULL, 'gh', 14433, '', '', '2024-04-12', 1, NULL, 'entered', NULL, '', '6.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (390, 5, 'edflores250@gmail.com', '2024-01-29', '09:00', '17:06', '30', '0', '07:36', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (136, 1, 'edflores240@gmail.com', '2024-04-12', '09:00', '17:00', '00:30', '00:00', '08:00', 0.0000, 0.0000, NULL, NULL, NULL, '', 14433, '', '', '2024-04-12', 1, NULL, 'entered', NULL, '', '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (135, 1, 'edflores240@gmail.com', '2024-04-11', '09:00', '17:00', '00:30', '00:00', '8:00', 0.0000, 0.0000, NULL, NULL, NULL, '', 14433, '', '', '2024-04-12', 1, NULL, 'entered', NULL, '', '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (139, 1, 'edflores240@gmail.com', '2024-04-16', '09:00', '23:00', '00:30', '00:00', '14:00', 0.0000, NULL, NULL, NULL, NULL, 'k', 14433, '', '', '2024-04-12', 1, NULL, 'entered', NULL, '', '6.0000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (138, 1, 'edflores240@gmail.com', '2024-04-15', '09:00', '23:00', '00:30', '00:00', '14:00', 0.0000, 0.0000, NULL, NULL, NULL, 'koko', 14433, '', '', '2024-04-12', 1, NULL, 'entered', NULL, '', '6.0000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (186, 1, NULL, '2024-04-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (388, 5, 'edflores250@gmail.com', '2024-01-27', '09:00', '09:30', '30', '0', '00:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (242, 4, 's.flores.edgarjr@cmu.edu.ph', '2024-04-24', '09:00', '17:00', '00:30', '00:00', '08:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Rejected by the Manager', '', '2024-04-30', 1, NULL, 'reject', NULL, '', '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (398, 5, 'edflores250@gmail.com', '2024-02-05', '09:00', '17:06', '30', '0', '07:36', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-14', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (147, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, 0.0000, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (150, NULL, NULL, '2024-05-11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (325, 5, 'edflores250@gmail.com', '2024-01-08', '09:00', '17:06', '30', '0', '07:36', -0.4000, NULL, NULL, NULL, NULL, 'zxc', 14433, 'Move to pending by the Manager', '', '2024-05-31', 0, NULL, 'entered', NULL, NULL, '-0.4000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (175, 1, NULL, '2024-04-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (357, 5, 'edflores250@gmail.com', '2024-01-21', '09:00', '05:30', '30', '0', '-4:00', -4.0000, NULL, NULL, NULL, NULL, 'asdf', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '-4.0000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (188, 1, NULL, '2024-04-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (173, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, 0.0000, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Day Off Using TIL Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (327, 5, 'edflores250@gmail.com', '2024-01-10', '09:00', '17:06', '30', '0', '07:36', -0.4000, NULL, NULL, NULL, NULL, 'qweqw', 14433, 'Move to pending by the Manager', '', '2024-05-31', 0, NULL, 'entered', NULL, NULL, '-0.4000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (394, 5, 'edflores250@gmail.com', '2024-02-02', '09:00', '22:06', '30', '0', '12:36', NULL, 5.0000, NULL, NULL, NULL, 'asdas', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '5.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (125, 1, 'edflores240@gmail.com', '2024-04-23', NULL, NULL, NULL, NULL, NULL, 0.0000, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved Leave', '', '2024-04-11', 0, 3, 'entered', NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (190, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (151, 1, NULL, '2024-05-11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'RDO Used', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (155, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using RDO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (178, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (428, 21, 'edflores20@gmail.com', '2024-06-06', '09:00', '13:30', '30', '0', '04:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-20', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (332, 5, 'edflores250@gmail.com', '2024-01-06', '09:00', '14:00', '30', '0', '05:00', NULL, 0.0000, NULL, NULL, NULL, 'asdf', 14433, 'Move to pending by the Manager', '', '2024-06-10', 0, NULL, 'entered', NULL, NULL, '5.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (157, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (330, 5, 'edflores250@gmail.com', '2024-01-04', '09:00', '13:00', '30', '0', '04:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-10', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (126, 1, 'edflores240@gmail.com', '2024-04-25', NULL, NULL, NULL, NULL, NULL, 0.0000, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Approved Leave', '', '2024-04-11', 0, 3, 'entered', NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (192, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (124, 1, 'edflores240@gmail.com', '2024-12-25', NULL, NULL, NULL, NULL, NULL, 0.0000, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved Leave', '', '2024-04-10', 0, 3, 'entered', NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (141, NULL, NULL, '2024-04-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (142, NULL, NULL, '2024-04-17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (152, 1, NULL, '2024-05-10', NULL, NULL, NULL, NULL, NULL, 0.0000, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Day Off Using TIL Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (63, 1, 'edflores240@gmail.com', '2024-03-26', NULL, NULL, NULL, NULL, NULL, 0.0000, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved Leave', '', '2024-04-10', 0, 3, 'entered', NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (143, NULL, NULL, '2024-04-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (144, NULL, NULL, '2024-04-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (359, 5, 'edflores250@gmail.com', '2024-01-23', '09:00', '17:06', '30', '0', '07:36', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (127, 1, 'edflores240@gmail.com', '2024-04-26', NULL, NULL, NULL, NULL, NULL, 0.0000, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Approved Leave', '', '2024-04-11', 0, 3, 'entered', NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (145, NULL, NULL, '2024-04-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (146, NULL, NULL, '2024-04-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (321, 5, 'edflores250@gmail.com', '2024-01-02', '09:00', '17:06', '30', '0', '07:36', -0.4000, NULL, NULL, NULL, NULL, 'qwe`', 14433, 'Move to pending by the Manager', '', '2024-05-31', 0, NULL, 'entered', NULL, NULL, '-0.4000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (194, 1, NULL, '2024-05-10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (163, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (392, 5, 'edflores250@gmail.com', '2024-01-31', '09:00', '13:30', '30', '0', '04:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (182, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (355, 5, 'edflores250@gmail.com', '2024-01-19', '09:00', '10:06', '30', '0', '00:36', NULL, -7.0000, NULL, NULL, NULL, 'asdas', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '-7.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (437, 21, 'edflores20@gmail.com', '2024-06-04', '09:00', '19:30', '30', '50', '09:10', NULL, NULL, NULL, NULL, NULL, 'asdfasdfasdf', 14433, 'Move to pending by the Manager', 'asdfasdfasdf', '2024-06-20', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (430, 21, 'edflores20@gmail.com', '2024-06-11', '09:00', '11:30', '30', '0', '02:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-20', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (422, 5, 'edflores250@gmail.com', '2024-01-16', '09:00', '17:06', '30', '0', '07:36', NULL, NULL, NULL, NULL, NULL, 'asdfasdfasdfasdfasdfasdfas', 14433, 'Move to pending by the Manager', 'afasdfasdfasdf', '2024-06-17', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (204, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (212, 1, NULL, '2024-04-19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (200, 1, NULL, '2024-04-19', NULL, NULL, NULL, NULL, NULL, 0.0000, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (207, 1, NULL, '2024-04-19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (172, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, 0.0000, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (197, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (201, 1, NULL, '2024-04-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (205, 1, NULL, '2024-04-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (206, 1, NULL, '2024-04-19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (202, 1, NULL, '2024-04-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (353, 5, 'edflores250@gmail.com', '2024-01-17', '09:00', '13:30', '30', '0', '04:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (213, 1, NULL, '2024-04-25', NULL, NULL, NULL, NULL, NULL, NULL, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (211, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, NULL, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (199, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, 0.0000, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (216, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, NULL, 80.0000, NULL, NULL, NULL, NULL, NULL, 'Day Off Using TIL Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (185, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, 2.0000, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (214, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using TIL Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (208, 1, NULL, '2024-04-19', NULL, NULL, NULL, NULL, NULL, 0.0000, 0.0000, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (473, 21, 'edflores20@gmail.com', '2024-06-02', '09:00', '09:33', '30', '0', '00:03', NULL, NULL, NULL, NULL, NULL, 'asdaasd', 151, NULL, '', '2024-06-29', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (218, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (219, 1, NULL, '2024-04-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (222, 1, NULL, '2024-04-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (224, 1, NULL, '2024-05-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using RDO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (225, 1, NULL, '2024-04-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using TIL Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (226, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (227, 1, NULL, '2024-04-20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'RDO Used', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (228, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using RDO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (229, 1, NULL, '2024-04-20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (231, 1, NULL, '2024-04-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using TIL Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (234, 1, NULL, '2024-04-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Mix Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (326, 5, 'edflores250@gmail.com', '2024-01-09', '09:00', '17:06', '30', '0', '07:36', -0.4000, NULL, NULL, NULL, NULL, 'asdas', 14433, 'Move to pending by the Manager', '', '2024-05-31', 0, NULL, 'entered', NULL, NULL, '-0.4000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (223, 1, 'edflores240@gmail.com', '2024-04-27', '09:00', '17:00', '00:30', '00:00', '08:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'RDO Used', '', '2024-04-17', 1, NULL, 'entered', NULL, '', '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (389, 5, 'edflores250@gmail.com', '2024-01-28', '09:00', '20:30', '30', '0', '11:00', NULL, 0.0000, NULL, NULL, NULL, 'asdfasdf', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '11.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (387, 5, 'edflores250@gmail.com', '2024-01-26', '09:00', '17:06', '30', '0', '07:36', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (361, 5, 'edflores250@gmail.com', '2024-01-25', '09:00', '16:06', '30', '0', '06:36', -1.0000, NULL, NULL, NULL, NULL, 'sdfa', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '-1.0000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (239, 4, 's.flores.edgarjr@cmu.edu.ph', '2024-05-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Rejected by the Manager', '', '2024-04-29', 0, 3, 'reject', NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (360, 5, 'edflores250@gmail.com', '2024-01-24', '09:00', '19:06', '30', '0', '09:36', 2.0000, NULL, NULL, NULL, NULL, 'asdfasd', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '2.0000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (358, 5, 'edflores250@gmail.com', '2024-01-22', '09:00', '23:06', '30', '0', '13:36', 6.0000, NULL, NULL, NULL, NULL, 'as', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '6.0000', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (240, 4, 's.flores.edgarjr@cmu.edu.ph', '2024-05-02', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved by the Manager', '', '2024-04-29', 0, 3, 'entered', NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (237, 4, 's.flores.edgarjr@cmu.edu.ph', '2024-04-29', '09:00', '17:00', '00:30', '00:00', '08:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Approved by the Manager', '', '2024-04-29', 1, NULL, 'entered', NULL, '', '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (238, 4, 's.flores.edgarjr@cmu.edu.ph', '2024-04-30', '09:00', '17:00', '00:30', '00:00', '08:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Approved by the Manager', '', '2024-04-29', 1, NULL, 'entered', NULL, '', '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (333, 5, 'edflores250@gmail.com', '2024-01-07', '09:00', '17:00', '30', '0', '08:00', NULL, 0.0000, NULL, NULL, NULL, 'asdf', 14433, 'Move to pending by the Manager', '', '2024-06-10', 0, NULL, 'entered', NULL, NULL, '8.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (356, 5, 'edflores250@gmail.com', '2024-01-20', '09:00', '06:30', '30', '0', '-3:00', NULL, NULL, 3.0000, NULL, NULL, 'asdf', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '-3.0000', 'leave');
INSERT INTO "public"."ts_timesheet_t" VALUES (354, 5, 'edflores250@gmail.com', '2024-01-18', '09:00', '08:40', '30', '0', '-1:-50', -4.8333, NULL, NULL, NULL, NULL, 'asdasd', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '-4.8333', 'flexi');
INSERT INTO "public"."ts_timesheet_t" VALUES (230, 1, NULL, '2024-04-24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Off Using Flexi Time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_timesheet_t" VALUES (336, 5, 'edflores250@gmail.com', '2024-01-12', '09:00', '17:06', '30', '0', '07:36', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-12', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (436, 21, 'edflores20@gmail.com', '2024-06-05', '09:00', '23:30', '60', '0', '13:30', NULL, NULL, NULL, NULL, NULL, 'qwerqwerasdasdfasd', 151, NULL, 'qwerqwer', '2024-06-20', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (442, 21, 'edflores20@gmail.com', '2024-06-17', '09:00', '09:30', '30', '0', '00:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-26', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (444, 21, 'edflores20@gmail.com', '2024-06-19', '09:00', '12:30', '30', '0', '03:00', NULL, -1.0000, NULL, NULL, NULL, 'asdsd', 14433, NULL, '', '2024-06-27', 0, NULL, 'entered', NULL, NULL, '-1.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (395, 5, 'edflores250@gmail.com', '2024-02-28', '09:00', '18:30', '30', '0', '09:00', NULL, NULL, NULL, NULL, NULL, 'fred asked me to do extra work', 14433, 'Move to pending by the Manager', 'clean toilets
check emails', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '5.0000', 'mixed');
INSERT INTO "public"."ts_timesheet_t" VALUES (439, 21, 'edflores20@gmail.com', '2024-06-13', '09:00', '09:30', '30', '0', '00:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-26', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (393, 5, 'edflores250@gmail.com', '2024-02-01', '09:00', '23:30', '30', '0', '14:00', NULL, 10.0000, NULL, NULL, NULL, 'asdasd', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '10.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (391, 5, 'edflores250@gmail.com', '2024-01-30', '09:00', '17:06', '30', '0', '07:36', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-13', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (331, 5, 'edflores250@gmail.com', '2024-01-05', '09:00', '17:00', '30', '0', '08:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-10', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (431, 21, 'edflores20@gmail.com', '2024-06-12', '09:00', '20:30', '30', '0', '11:00', NULL, NULL, NULL, NULL, NULL, 'aSDSDADWF', 14433, 'Move to pending by the Manager', 'ASDFASDF', '2024-06-20', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (328, 5, 'edflores250@gmail.com', '2024-01-11', '09:00', '17:06', '30', '0', '07:36', NULL, -0.4000, NULL, NULL, NULL, 'asdf', 14433, 'Move to pending by the Manager', '', '2024-05-31', 0, NULL, 'entered', NULL, NULL, '-0.4000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (429, 21, 'edflores20@gmail.com', '2024-06-07', '09:00', '15:30', '30', '0', '06:00', NULL, NULL, NULL, NULL, NULL, 'asdasd', 14433, 'Move to pending by the Manager', 'asdasd', '2024-06-20', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (441, 21, 'edflores20@gmail.com', '2024-06-14', '09:00', '13:30', '30', '0', '04:00', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-26', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (447, 21, 'edflores20@gmail.com', '2024-06-03', '09:00', '07:06', '30', '0', '10:36', NULL, 0.0000, NULL, NULL, NULL, 'jkk', 14433, NULL, '', '2024-06-28', 0, NULL, 'entered', NULL, NULL, '3.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (446, 21, 'edflores20@gmail.com', '2024-06-20', '09:00', '13:54', '30', '0', '04:24', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-28', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (443, 21, 'edflores20@gmail.com', '2024-06-18', '09:00', '17:06', '30', '0', '07:36', NULL, NULL, NULL, NULL, NULL, '', 14433, 'Move to pending by the Manager', '', '2024-06-27', 0, NULL, 'entered', NULL, NULL, '', '');
INSERT INTO "public"."ts_timesheet_t" VALUES (448, 21, 'edflores20@gmail.com', '2024-06-01', '09:00', '08:30', '30', '0', '23:00', NULL, 23.0000, NULL, NULL, NULL, 'ok', 14433, 'Approved by the Manager', '', '2024-06-28', 0, NULL, 'approved', NULL, NULL, '23.0000', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (479, 21, 'edflores20@gmail.com', '2024-07-01', '09:00', '01:10', '30', '0', '15:40', NULL, 8.0667, NULL, NULL, NULL, 'asd', 146, 'Rejected by the Manager', '', '2024-07-01', 0, NULL, 'reject', NULL, NULL, '8.0667', 'til');
INSERT INTO "public"."ts_timesheet_t" VALUES (465, 21, 'edflores20@gmail.com', '2024-06-21', '09:00', '19:06', '30', '0', '09:36', 2.0000, NULL, NULL, NULL, NULL, 'asdasd', 146, 'Rejected by the Manager', '', '2024-06-28', 0, NULL, 'reject', NULL, NULL, '2.0000', 'flexi');

-- ----------------------------
-- Table structure for ts_user_t
-- ----------------------------
DROP TABLE IF EXISTS "public"."ts_user_t";
CREATE TABLE "public"."ts_user_t" (
  "id" int4 NOT NULL DEFAULT nextval('ts_user_t_id_seq'::regclass),
  "person_id" int4,
  "advance_entry_days" int4,
  "at_agreement" varchar(255) COLLATE "pg_catalog"."default",
  "at_balance" numeric(6,2),
  "at_carried" int4,
  "at_limit_hours" numeric(6,2),
  "at_max" numeric(6,2),
  "at_open" numeric(6,2),
  "auto_calculate_hours" bool,
  "current_period" int4,
  "default_location" varchar(255) COLLATE "pg_catalog"."default",
  "fire_role" varchar(255) COLLATE "pg_catalog"."default",
  "fund_source" varchar(255) COLLATE "pg_catalog"."default",
  "last_update" date,
  "location_id" int8,
  "normal_start" time(6),
  "rdo_balance" numeric(6,2),
  "rdo_carried" int4,
  "rdo_minimum" numeric(6,2),
  "rdo_open" int4,
  "rostered_days" int4,
  "takes_rdos" bool,
  "timesheet_mode" varchar(255) COLLATE "pg_catalog"."default",
  "timesheet_version" varchar(255) COLLATE "pg_catalog"."default",
  "weekends_worked" int4,
  "workcentre" varchar(255) COLLATE "pg_catalog"."default",
  "file_location" varchar(256) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of ts_user_t
-- ----------------------------
INSERT INTO "public"."ts_user_t" VALUES (1, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (2, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (3, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (4, 11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (5, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (6, 13, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (7, 14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (8, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (9, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (10, 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (11, 18, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (12, 19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (13, 20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (14, 21, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (15, 22, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ts_user_t" VALUES (16, 23, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for user_work_schedule
-- NOTE: user_work_schedule should probably be called user_eba because it contains the rules that define the eba benefits (til, flexi, rdo, etc)
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_work_schedule";
CREATE TABLE "public"."user_work_schedule" (
  "user_id" int4 NOT NULL,
  "schedule_id" int4 DEFAULT 0,
  "disable_til" bool DEFAULT false,
  "disable_flexi" bool DEFAULT false,
  "disable_rdo" bool DEFAULT false
)
;

-- ----------------------------
-- Records of user_work_schedule
-- ----------------------------
INSERT INTO "public"."user_work_schedule" VALUES (1, 1, 'f', 'f', 'f');
INSERT INTO "public"."user_work_schedule" VALUES (2, 2, 'f', 'f', 'f');
INSERT INTO "public"."user_work_schedule" VALUES (3, 3, 't', 't', 't');
INSERT INTO "public"."user_work_schedule" VALUES (4, 4, 'f', 'f', 'f');
INSERT INTO "public"."user_work_schedule" VALUES (5, 5, 't', 't', 't');


-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "username" varchar(31) COLLATE "pg_catalog"."default",
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "password" varchar(64) COLLATE "pg_catalog"."default",
  "role" varchar(15) COLLATE "pg_catalog"."default",
  "verification_token" varchar(255) COLLATE "pg_catalog"."default",
  "verified_email" bool
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES (1, 'biggles', 'tsnumbat@maherco.com.au', '$2b$10$qXC.ZLkefwk83rQ3IeKZ9u6XQKTk54c7IdjzXnDAnhyGbmncsiS3e', 'user', '9926b17411bf46ff81bb624662a7d89c9badb203', 't');
INSERT INTO "public"."users" VALUES (2, 'trac', 'tstrac@maherco.com.au', '$2b$10$qXC.ZLkefwk83rQ3IeKZ9u6XQKTk54c7IdjzXnDAnhyGbmncsiS3e', 'user', '9926b17411bf46ff81bb624662a7d89c9badb203', 't');
INSERT INTO "public"."users" VALUES (3, 'umcool', 'tsdesign@maherco.com.au', '$2b$10$qXC.ZLkefwk83rQ3IeKZ9u6XQKTk54c7IdjzXnDAnhyGbmncsiS3e', 'user', '9926b17411bf46ff81bb624662a7d89c9badb203', 't');
INSERT INTO "public"."users" VALUES (4, 'lovely', 'tsadmin@maherco.com.au', '$2b$10$qXC.ZLkefwk83rQ3IeKZ9u6XQKTk54c7IdjzXnDAnhyGbmncsiS3e', 'user', '9926b17411bf46ff81bb624662a7d89c9badb203', 't');
INSERT INTO "public"."users" VALUES (5, 'Gwapo', 'tsdev@maherco.com.au', '$2b$10$qXC.ZLkefwk83rQ3IeKZ9u6XQKTk54c7IdjzXnDAnhyGbmncsiS3e', 'user', '9926b17411bf46ff81bb624662a7d89c9badb203', 't');

-- ----------------------------
-- Table structure for work_schedule
-- ----------------------------
DROP TABLE IF EXISTS "public"."work_schedule";
CREATE TABLE "public"."work_schedule" (
  "id" int4 NOT NULL DEFAULT nextval('work_schedule_id_seq'::regclass),
  "schedule_day" varchar(255)[] COLLATE "pg_catalog"."default",
  "paid_hours" varchar(255)[] COLLATE "pg_catalog"."default",
  "start_date" timestamp(6),
  "end_date" timestamp(6)
)
;

-- ----------------------------
-- Records of work_schedule
-- ----------------------------
INSERT INTO "public"."work_schedule" VALUES (1, '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}', '{0,7.60,7.60,4.0,4.0,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', '2023-12-31 18:31:18', '2024-12-31 18:31:28');
INSERT INTO "public"."work_schedule" VALUES (2, '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}', '{0,7.60,7.60,4.0,4.0,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', '2023-12-31 18:31:18', '2024-12-31 18:31:28');
INSERT INTO "public"."work_schedule" VALUES (3, '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}', '{0,7.60,7.60,4.0,4.0,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', '2023-12-31 18:31:18', '2024-12-31 18:31:28');
INSERT INTO "public"."work_schedule" VALUES (4, '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}', '{0,7.60,7.60,4.0,4.0,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', '2023-12-31 18:31:18', '2024-12-31 18:31:28');


-- ----------------------------
-- View structure for leave_balances
-- ----------------------------
DROP VIEW IF EXISTS "public"."leave_balances";
CREATE VIEW "public"."leave_balances" AS  SELECT person_id,
    sum(time_flexi) AS flexi_balance,
    sum(time_til) AS til_balance,
    sum(rwe_day) AS rdo_balance,
    sum(time_leave) AS total_leave,
    sum(time_overtime) AS total_overtime
   FROM ts_timesheet_t
  GROUP BY person_id, username;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."activities_id_seq"
OWNED BY "public"."activities"."id";
SELECT setval('"public"."activities_id_seq"', 20, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."fund_id_seq"
OWNED BY "public"."fund"."id";
SELECT setval('"public"."fund_id_seq"', 19, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."issues_issue_id_seq"
OWNED BY "public"."issues"."issue_id";
SELECT setval('"public"."issues_issue_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."location_id_seq"
OWNED BY "public"."location"."id";
SELECT setval('"public"."location_id_seq"', 185, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notification_notification_id_seq"
OWNED BY "public"."notification"."notification_id";
SELECT setval('"public"."notification_notification_id_seq"', 239, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."organizations_org_id_seq"
OWNED BY "public"."organizations"."org_id";
SELECT setval('"public"."organizations_org_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."public_holidays_id_seq"
OWNED BY "public"."public_holidays"."id";
SELECT setval('"public"."public_holidays_id_seq"', 13, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."recipient_id_seq"
OWNED BY "public"."recipient"."id";
SELECT setval('"public"."recipient_id_seq"', 46, true);


-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ts_timesheet_t_id_seq"
OWNED BY "public"."ts_timesheet_t"."id";
SELECT setval('"public"."ts_timesheet_t_id_seq"', 479, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ts_user_t_id_seq"
OWNED BY "public"."ts_user_t"."id";
SELECT setval('"public"."ts_user_t_id_seq"', 16, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
SELECT setval('"public"."users_id_seq"', 39, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."work_schedule_id_seq"
OWNED BY "public"."work_schedule"."id";
SELECT setval('"public"."work_schedule_id_seq"', 1, true);

-- ----------------------------
-- Primary Key structure for table activities
-- ----------------------------
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table fund
-- ----------------------------
ALTER TABLE "public"."fund" ADD CONSTRAINT "fund_fund_source_num_key" UNIQUE ("fund_source_num");

-- ----------------------------
-- Primary Key structure for table fund
-- ----------------------------
ALTER TABLE "public"."fund" ADD CONSTRAINT "fund_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table issues
-- ----------------------------
ALTER TABLE "public"."issues" ADD CONSTRAINT "issues_pkey" PRIMARY KEY ("issue_id");

-- ----------------------------
-- Primary Key structure for table location
-- ----------------------------
ALTER TABLE "public"."location" ADD CONSTRAINT "location_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table notification
-- ----------------------------
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id");

-- ----------------------------
-- Primary Key structure for table public_holidays
-- ----------------------------
ALTER TABLE "public"."public_holidays" ADD CONSTRAINT "public_holidays_pkey" PRIMARY KEY ("id");


-- ----------------------------
-- Primary Key structure for table recipient
-- ----------------------------
ALTER TABLE "public"."recipient" ADD CONSTRAINT "recipient_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table staff_hierarchy
-- ----------------------------
ALTER TABLE "public"."staff_hierarchy" ADD CONSTRAINT "staff_hierarchy_pkey" PRIMARY KEY ("user_id", "manager_id");


-- ----------------------------
-- Primary Key structure for table ts_timesheet_t
-- ----------------------------
ALTER TABLE "public"."ts_timesheet_t" ADD CONSTRAINT "ts_timesheet_t_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ts_user_t
-- ----------------------------
ALTER TABLE "public"."ts_user_t" ADD CONSTRAINT "ts_user_t_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table user_work_schedule
-- ----------------------------
ALTER TABLE "public"."user_work_schedule" ADD CONSTRAINT "userworkschedules_pkey" PRIMARY KEY ("user_id");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table work_schedule
-- ----------------------------
ALTER TABLE "public"."work_schedule" ADD CONSTRAINT "work_schedule_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table staff_hierarchy
-- ----------------------------
ALTER TABLE "public"."staff_hierarchy" ADD CONSTRAINT "staff_hierarchy_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."staff_hierarchy" ADD CONSTRAINT "staff_hierarchy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_work_schedule
-- ----------------------------
ALTER TABLE "public"."user_work_schedule" ADD CONSTRAINT "userworkschedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;


drop table rdo_eligibility;
DROP FUNCTION IF EXISTS update_flexi_hours;
drop table timesheets;

ALTER TABLE notification ADD COLUMN archive BOOLEAN DEFAULT FALSE;

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  "id" SERIAL PRIMARY KEY,
  "ts_id" INTEGER,
  "user_id" INTEGER,
  "post_date" DATE,
  "comment" TEXT
);




INSERT INTO organizations (org_name, org_description, org_id) 
VALUES ('organization Name', 'organization description', 3);

WITH user_john AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('john', 'tsjohn@maherco.com.au', '.', 'user', true)
    RETURNING id
),
john_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,7.60,7.60,4.0,4.0,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', 
        '2023-12-31 18:31:18', 
        '2024-12-31 18:31:28'
    )
    RETURNING id
)
INSERT INTO personelle (person_id, position, org_id);
SELECT user_john.id, 'user', 3 FROM user_john;

INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo);
SELECT user_john.id, john_schedule.id, false, false, false FROM user_john, john_schedule;



INSERT INTO organizations (org_name, org_description, org_id) 
VALUES ('organization Name', 'organization description', 3);


WITH user_john AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('john', 'tsjohn@maherco.com.au', '.', 'user', true)
    RETURNING id
),
john_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,7.60,7.60,4.0,4.0,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', 
        '2023-12-31 18:31:18', 
        '2024-12-31 18:31:28'
    )
    RETURNING id
),
personelle_john AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 3 FROM user_john
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT user_john.id, john_schedule.id, false, false, false FROM user_john, john_schedule;



ALTER TABLE user_work_schedule
ADD COLUMN default_time_start TIME,
ADD COLUMN default_time_break int2;


ALTER TABLE organizations
ADD COLUMN payday_day_num int DEFAULT 14; 


