CREATE DATABASE Resource_Booker;

USE Resource_Booker;

CREATE TABLE Locations(
	LocationId INT PRIMARY KEY,
	BuildingName VARCHAR(20),
	StreetName VARCHAR(20),
	City VARCHAR(20),
	ProvinceState VARCHAR(20),
	PostalCode VARCHAR(20)
);

CREATE TABLE ResourceTypes(
	ResourceType VARCHAR(20) PRIMARY KEY
);

CREATE TABLE Resources(
	ResourceId INT PRIMARY KEY,
	LocationId INT,
	ResourceType VARCHAR(20),
	FOREIGN KEY (LocationId) REFERENCES Locations(LocationId),
	FOREIGN KEY (ResourceType) REFERENCES ResourceTypes(ResourceType)
);

CREATE TABLE Desks(
	ResourceId INT PRIMARY KEY,
	Floor VARCHAR(20),
	Section VARCHAR(20),
	DeskNumber VARCHAR(20),
	FOREIGN KEY (ResourceId) REFERENCES Resources(ResourceId)
);

CREATE TABLE Reservations (
	ReservationId INT PRIMARY KEY, 
	ResourceId INT, 
	StaffId VARCHAR(20), 
	StaffName VARCHAR(20), 
	StaffDepartment VARCHAR(20),
	StaffEmail VARCHAR(20),
	StartDate DATETIME,
	EndDate DATETIME,
	FOREIGN KEY (ResourceId) REFERENCES Resources(ResourceId)
);

CREATE TABLE Admins(
	AdminId INT PRIMARY KEY,
	Name VARCHAR(20)
);

