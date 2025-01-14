CREATE TABLE pv_upload (
    id SERIAL PRIMARY KEY,
    person_id INTEGER,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    disable_til BOOLEAN,
    disable_flexi BOOLEAN,
    disable_rdo BOOLEAN,
    paid_hours FLOAT[],
    start_date DATE,
    end_date DATE,
    user_id INTEGER
);


INSERT INTO pv_upload (id, person_id, first_name, last_name, email, disable_til, disable_flexi, disable_rdo, paid_hours, start_date, end_date, user_id) 
VALUES 
(5001, 429167, 'John', 'Maher', 'tsnumbat@maherco.com.au', FALSE, FALSE, FALSE, '{0,7.60,7.60,4.0,4.0,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', '2023-12-31', '2024-12-31', 1),
(5002, 464964, 'Tyronne', 'Casboult', 'tstrac@maherco.com.au', FALSE, FALSE, FALSE, '{0,7.60,7.60,4.0,4.0,7.6,0,0,7.60,7.60,7.60,7.60,7.60,0}', '2023-12-31', '2024-12-31', 2);


ALTER TABLE personelle
ADD COLUMN external_id VARCHAR(31);


