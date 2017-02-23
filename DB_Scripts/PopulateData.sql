USE Resource_Booker;

INSERT INTO locations
    (building_name, street_name, city, province_state, postal_code)
VALUES
    ('Broadway Green Building', '2910 Virtual Way', 'Vancouver', 'BC', 'V5M 0B2');

INSERT INTO resource_types
    (resource_type)
VALUES
    ('Desk');

INSERT INTO admins
    (admin_id, name)
VALUES
    ('00000000', 'defaultAdmin');

LOAD DATA LOCAL INFILE 'import-path/Desks.csv' INTO TABLE resources
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r'
IGNORE 1 LINES
(@dummy1, @dummy2, @dummy3)
SET location_id = 1, resource_type = 'Desk';

LOAD DATA LOCAL INFILE 'import-path/Desks.csv' INTO TABLE desks
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r'
IGNORE 1 LINES
(floor, section, desk_number);
