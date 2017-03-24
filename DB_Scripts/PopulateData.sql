USE resource_booker;

INSERT INTO locations
    (building_name, street_name, city, province_state, postal_code, created_at, updated_at)
VALUES
    ('Broadway Green Building', '2910 Virtual Way', 'Vancouver', 'BC', 'V5M 0B2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO resource_types
    (resource_type, created_at, updated_at)
VALUES
    ('Desk', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO admins
    (admin_id, name, created_at, updated_at)
VALUES
    ('00000000', 'defaultAdmin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    
INSERT INTO admins
    (admin_id, name, created_at, updated_at)
VALUES
    ('43868488', 'John Doe', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

LOAD DATA LOCAL INFILE 'C:/Users/Evan/Documents/Main/Projects/team-12/DB_Scripts/Desks.csv' INTO TABLE resources
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r'
IGNORE 1 LINES
(@dummy1, @dummy2, @dummy3)
SET location_id = 1, resource_type = 'Desk', created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP;

LOAD DATA LOCAL INFILE 'C:/Users/Evan/Documents/Main/Projects/team-12/DB_Scripts/Desks.csv' INTO TABLE desks
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r'
IGNORE 1 LINES
(floor, section, desk_number)
SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP;;
