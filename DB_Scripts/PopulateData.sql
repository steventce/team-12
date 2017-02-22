USE Resource_Booker;

INSERT INTO Locations
    (BuildingName, StreetName, City, ProvinceState, PostalCode)
VALUES
    ('Broadway Green Building', '2910 Virtual Way', 'Vancouver', 'BC', 'V5M 0B2');

INSERT INTO ResourceTypes 
VALUES ('Desk');

INSERT INTO Admins
VALUES ('00000000', 'defaultAdmin');

LOAD DATA LOCAL INFILE import-path INTO TABLE Resources
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r' 
IGNORE 1 LINES
(@dummy1, @dummy2, @dummy3)
SET LocationId = 1, ResourceType = 'Desk';

LOAD DATA LOCAL INFILE import-path INTO TABLE Desks
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r' 
IGNORE 1 LINES
(Floor, Section, DeskNumber);