

INSERT INTO organizations (org_name, org_description, org_id) 
VALUES ('ntime', 'Host Company and all staff for active org use', 3);






WITH user_john AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('john', 'john@ntime.au', '.', 'user', true)
    RETURNING id
),
john_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,0,0,0,0,0,0,0,0,0,0,0,0,0}', 
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





WITH user_paul AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('paul', 'paul@ntime.au', '.', 'user', true)
    RETURNING id
),
paul_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,7.60,7.60,4.0,4.0,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', 
        '2023-12-31 18:31:18', 
        '2024-12-31 18:31:28'
    )
    RETURNING id
),
personelle_paul AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 3 FROM user_paul
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT user_paul.id, paul_schedule.id, false, true, false FROM user_paul, paul_schedule;






WITH user_jay AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('jay', 'jay@ntime.au', '.', 'user', true)
    RETURNING id
),
jay_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,4.0,4.0,7.60,7.60,7.60,0,0,7.60,7.60,7.60,7.60,7.60,0}', 
        '2023-12-31 18:31:18', 
        '2024-12-31 18:31:28'
    )
    RETURNING id
),
personelle_jay AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 3 FROM user_jay
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT user_jay.id, jay_schedule.id, true, false, true FROM user_jay, jay_schedule;






WITH user_lovely AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('lovely', 'lovely@ntime.au', '.', 'user', true)
    RETURNING id
),
lovely_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,7.60,7.60,7.60,7.60,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', 
        '2023-12-31 18:31:18', 
        '2024-12-31 18:31:28'
    )
    RETURNING id
),
personelle_lovely AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 3 FROM user_lovely
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT user_lovely.id, lovely_schedule.id, false, false, false FROM user_lovely, lovely_schedule;




WITH user_ty AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('ty', 'trac@ntime.au', '.', 'user', true)
    RETURNING id
),
ty_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,7.60,7.60,7.6,7.6,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', 
        '2023-12-31 18:31:18', 
        '2024-12-31 18:31:28'
    )
    RETURNING id
),
personelle_ty AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 3 FROM user_ty
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT user_ty.id, ty_schedule.id, false, true, false FROM user_paul, ty_schedule;




WITH user_jehoiada AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('Jehoiada', 'jehoiada@ntime.au', '.', 'user', true)
    RETURNING id
),
jehoiada_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,7.60,7.60,7.6,7.6,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', 
        '2023-12-31 18:31:18', 
        '2024-12-31 18:31:28'
    )
    RETURNING id
),
personelle_jehoiada AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 3 FROM user_jehoiada
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT user_jehoiada.id, jehoiada_schedule.id, false, true, false FROM user_paul, jehoiada_schedule;








INSERT INTO organizations (org_name, org_description, org_id) 
VALUES ('Building By Bryan', 'Owner: Bryan Smith +61429815177, Accounts: Fiona Smith +614???', 4);



WITH user_john AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('john', 'john@buildingbb.com.au', '.', 'user', true)
    RETURNING id
),
john_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,0,0,0,0,0,0,0,0,0,0,0,0,0}', 
        '2023-12-31 18:31:18', 
        '2024-12-31 18:31:28'
    )
    RETURNING id
),
personelle_john AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 4 FROM user_john
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT user_john.id, john_schedule.id, true, true, true FROM user_john, john_schedule;




WITH user_alex AS (
    INSERT INTO users (username, email, password, role, verified_email)
    VALUES ('alex', 'alex@eurekagarages.com.au', '.', 'user', true)
    RETURNING id
),
alex_schedule AS (
    INSERT INTO work_schedule (schedule_day, paid_hours, start_date, end_date) 
    VALUES (
        '{Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
        '{0,8,8,8,8,8,0,0,8,8,8,8,8,0}', 
        '2023-12-31 18:31:18', 
        '2024-12-31 18:31:28'
    )
    RETURNING id
),
personelle_alex AS (
    INSERT INTO personelle (person_id, position, org_id)
    SELECT id, 'user', 4 FROM user_alex
)
INSERT INTO user_work_schedule (user_id, schedule_id, disable_til, disable_flexi, disable_rdo)
SELECT user_alex.id, alex_schedule.id, true, true, true FROM user_alex, alex_schedule;


