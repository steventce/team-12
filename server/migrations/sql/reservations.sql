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
