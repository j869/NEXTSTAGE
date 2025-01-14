

INSERT INTO organizations (org_name, org_description, org_id) 
VALUES ('Parks Victoria', 'Contact: Mon Das, Dirk, Talesh', 5);




WITH new_user AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('Mon', 'monomita.das@parks.vic.gov.au', '.', 'user', true)
    RETURNING id
),
schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,8,8,8,8,8,0,0,8,8,8,8,8,0}', 
        '2023-12-31 18:31:18', 
        '2032-12-04 18:31:28'
    )
    RETURNING id
),
personelle AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 5 FROM new_user
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT new_user.id, schedule.id, false, false, false FROM new_user, schedule;






WITH new_user AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('Kulraj', 'kulraj.singh@parks.vic.gov.au', '.', 'user', true)
    RETURNING id
),
schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,8,8,8,8,8,0,0,8,8,8,8,8,0}', 
        '2023-12-31 18:31:18', 
        '2032-12-04 18:31:28'
    )
    RETURNING id
),
personelle AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 5 FROM new_user
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT new_user.id, schedule.id, false, false, false FROM new_user, schedule;





WITH new_user AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('Mark', 'mark.perez@parks.vic.gov.au', '.', 'user', true)
    RETURNING id
),
schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,8,8,8,8,8,0,0,8,8,8,8,8,0}', 
        '2023-12-31 18:31:18', 
        '2032-12-04 18:31:28'
    )
    RETURNING id
),
personelle AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 5 FROM new_user
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT new_user.id, schedule.id, false, false, false FROM new_user, schedule;




WITH new_user AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('Pengcheng', 'pengcheng.Zhu@parks.vic.gov.au', '.', 'user', true)
    RETURNING id
),
schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,8,8,8,8,8,0,0,8,8,8,8,8,0}', 
        '2023-12-31 18:31:18', 
        '2032-12-04 18:31:28'
    )
    RETURNING id
),
personelle AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 5 FROM new_user
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT new_user.id, schedule.id, false, false, false FROM new_user, schedule;



WITH new_user AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('Dirk', 'dirk.morel@parks.vic.gov.au ', '.', 'user', true)
    RETURNING id
),
schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,8,8,8,8,8,0,0,8,8,8,8,8,0}', 
        '2023-12-31 18:31:18', 
        '2032-12-04 18:31:28'
    )
    RETURNING id
),
personelle AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 5 FROM new_user
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT new_user.id, schedule.id, false, false, false FROM new_user, schedule;




insert into public_holidays (holiday_date, holiday_name) values ('2024-01-01', 'New Year''s Day');
insert into public_holidays (holiday_date, holiday_name) values ('2024-01-26', 'Australia Day');
insert into public_holidays (holiday_date, holiday_name) values ('2024-03-11', 'Labour Day');
insert into public_holidays (holiday_date, holiday_name) values ('2024-03-29', 'Good Friday');
insert into public_holidays (holiday_date, holiday_name) values ('2024-03-30', 'Easter Saturday');
insert into public_holidays (holiday_date, holiday_name) values ('2024-03-31', 'Easter Sunday');
insert into public_holidays (holiday_date, holiday_name) values ('2024-04-01', 'Easter Monday');
insert into public_holidays (holiday_date, holiday_name) values ('2024-06-10', 'King''s Birthday');
insert into public_holidays (holiday_date, holiday_name) values ('2024-09-27', 'AFL Grand Final Day');
insert into public_holidays (holiday_date, holiday_name) values ('2024-11-05', 'Melbourne Cup Day');
insert into public_holidays (holiday_date, holiday_name) values ('2024-12-25', 'Christmas Day');
insert into public_holidays (holiday_date, holiday_name) values ('2024-12-26', 'Boxing Day');
insert into public_holidays (holiday_date, holiday_name) values ('2025-01-01', 'New Year''s Day');
insert into public_holidays (holiday_date, holiday_name) values ('2025-01-27', 'Australia Day');
insert into public_holidays (holiday_date, holiday_name) values ('2025-03-10', 'Labour Day');
insert into public_holidays (holiday_date, holiday_name) values ('2025-04-18', 'Good Friday');
insert into public_holidays (holiday_date, holiday_name) values ('2025-04-19', 'Easter Saturday');
insert into public_holidays (holiday_date, holiday_name) values ('2025-04-20', 'Easter Sunday');
insert into public_holidays (holiday_date, holiday_name) values ('2025-04-21', 'Easter Monday');
insert into public_holidays (holiday_date, holiday_name) values ('2025-04-25', 'Anzac Day');
insert into public_holidays (holiday_date, holiday_name) values ('2025-06-09', 'King''s Birthday');
insert into public_holidays (holiday_date, holiday_name) values ('2025-09-27', 'AFL Grand Final Day');
insert into public_holidays (holiday_date, holiday_name) values ('2025-11-04', 'Melbourne Cup Day');
insert into public_holidays (holiday_date, holiday_name) values ('2025-12-25', 'Christmas Day');
insert into public_holidays (holiday_date, holiday_name) values ('2025-12-26', 'Boxing Day');


update users set password = (select password from users where id = 2) where id = 54
