CREATE TABLE `admins` (
  `admin_id` varchar(10) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB;

CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `building_name` varchar(50) DEFAULT NULL,
  `street_name` varchar(50) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `province_state` varchar(10) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1;

CREATE TABLE `resource_types` (
  `resource_type` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`resource_type`)
) ENGINE=InnoDB;

CREATE TABLE `resources` (
  `resource_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) DEFAULT NULL,
  `resource_type` varchar(10) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`resource_id`),
  KEY `location_id` (`location_id`),
  KEY `resource_type` (`resource_type`),
  CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resources_ibfk_2` FOREIGN KEY (`resource_type`) REFERENCES `resource_types` (`resource_type`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1;

CREATE TABLE `desks` (
  `resource_id` int(11) NOT NULL AUTO_INCREMENT,
  `floor` varchar(10) DEFAULT NULL,
  `section` varchar(10) DEFAULT NULL,
  `desk_number` varchar(10) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`resource_id`),
  CONSTRAINT `desks_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1;

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL AUTO_INCREMENT,
  `resource_id` int(11) DEFAULT NULL,
  `staff_id` varchar(10) DEFAULT NULL,
  `staff_name` varchar(30) DEFAULT NULL,
  `staff_department` varchar(30) DEFAULT NULL,
  `staff_email` varchar(50) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `resource_id` (`resource_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`resource_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1;
