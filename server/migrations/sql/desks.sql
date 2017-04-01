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
