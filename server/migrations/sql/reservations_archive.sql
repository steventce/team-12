CREATE TABLE `reservations_archive` (
  `reservations_archive_id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `resource_id` int(11) DEFAULT NULL,
  `staff_id` varchar(10) DEFAULT NULL,
  `staff_name` varchar(30) DEFAULT NULL,
  `staff_department` varchar(30) DEFAULT NULL,
  `staff_email` varchar(50) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reservations_archive_id`),
  KEY `resource_id` (`resource_id`),
  CONSTRAINT `reservations_archive_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1;
