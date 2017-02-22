/*
VARCHAR(10) : short data
VARCHAR(30) : med length data
VARCHAR(50) : long data
*/

CREATE DATABASE Resource_Booker;

USE Resource_Booker;

CREATE TABLE Locations(
	LocationId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	BuildingName VARCHAR(50),
	StreetName VARCHAR(50),
	City VARCHAR(30),
	ProvinceState VARCHAR(10),
	PostalCode VARCHAR(10)
);

CREATE TABLE ResourceTypes(
	ResourceType VARCHAR(10) NOT NULL PRIMARY KEY
);

CREATE TABLE Resources(
	ResourceId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	LocationId INT,
	ResourceType VARCHAR(10),
	FOREIGN KEY (LocationId) REFERENCES Locations(LocationId),
	FOREIGN KEY (ResourceType) REFERENCES ResourceTypes(ResourceType)
);

CREATE TABLE Desks(
	ResourceId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	Floor VARCHAR(10),
	Section VARCHAR(10),
	DeskNumber VARCHAR(10),
	FOREIGN KEY (ResourceId) REFERENCES Resources(ResourceId)
);

CREATE TABLE Reservations (
	ReservationId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	ResourceId INT, 
	StaffId VARCHAR(10), 
	StaffName VARCHAR(30), 
	StaffDepartment VARCHAR(30),
	StaffEmail VARCHAR(50),
	StartDate DATETIME,
	EndDate DATETIME,
	FOREIGN KEY (ResourceId) REFERENCES Resources(ResourceId)
);

CREATE TABLE Admins(
	AdminId VARCHAR(10) NOT NULL PRIMARY KEY,
	Name VARCHAR(30)
);

