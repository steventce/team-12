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
