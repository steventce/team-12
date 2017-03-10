/*
VARCHAR(10) : short data
VARCHAR(30) : med length data
VARCHAR(50) : long data
*/

CREATE DATABASE resource_booker;

USE resource_booker;

CREATE TABLE Locations(
	location_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	building_name VARCHAR(50),
	street_name VARCHAR(50),
	city VARCHAR(30),
	province_state VARCHAR(10),
	postal_code VARCHAR(10),
	created_at DATETIME,
	updated_at DATETIME
);

CREATE TABLE Resource_Types(
	resource_type VARCHAR(10) NOT NULL PRIMARY KEY,
	created_at DATETIME,
	updated_at DATETIME
);

CREATE TABLE Resources(
	resource_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	location_id INT,
	resource_type VARCHAR(10),
	created_at DATETIME,
	updated_at DATETIME,
	FOREIGN KEY (location_id) REFERENCES Locations(location_id),
	FOREIGN KEY (resource_type) REFERENCES Resource_Types(resource_type)
);

CREATE TABLE Desks(
	resource_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	floor VARCHAR(10),
	section VARCHAR(10),
	desk_number VARCHAR(10),
	created_at DATETIME,
	updated_at DATETIME,
	FOREIGN KEY (resource_id) REFERENCES Resources(resource_id)
);

CREATE TABLE Reservations (
	reservation_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	resource_id INT, 
	staff_id VARCHAR(10), 
	staff_name VARCHAR(30), 
	staff_department VARCHAR(30),
	staff_email VARCHAR(50),
	start_date DATETIME,
	end_date DATETIME,
	created_at DATETIME,
	updated_at DATETIME,
	FOREIGN KEY (resource_id) REFERENCES Resources(resource_id)
);

CREATE TABLE Admins(
	admin_id VARCHAR(10) NOT NULL PRIMARY KEY,
	name VARCHAR(30),
	created_at DATETIME,
	updated_at DATETIME
);

