CREATE TABLE `admins` (
  `admin_id` varchar(10) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB;
