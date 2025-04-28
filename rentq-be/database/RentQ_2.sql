/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bills` (
  `bill_id` int NOT NULL AUTO_INCREMENT,
  `contract_id` int NOT NULL,
  `bill_type` enum('rent','electricity','water','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `usage_amount` float DEFAULT NULL,
  `price_per_unit` decimal(10,2) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `due_date` date NOT NULL,
  `status` enum('paid','unpaid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bill_id`),
  KEY `contract_id` (`contract_id`),
  CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`contract_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `contract_tenants` (
  `contract_id` int NOT NULL,
  `tenant_id` int NOT NULL,
  PRIMARY KEY (`contract_id`,`tenant_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `contract_tenants_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`contract_id`) ON DELETE CASCADE,
  CONSTRAINT `contract_tenants_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `contracts` (
  `contract_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `landlord_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `actual_move_in_date` date DEFAULT NULL,
  `deposit` decimal(10,2) NOT NULL,
  `rent` decimal(10,2) NOT NULL,
  `status` enum('active','terminated','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `contract_file_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `terms_and_conditions` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contract_id`),
  KEY `landlord_id` (`landlord_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE,
  CONSTRAINT `contracts_ibfk_3` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `receiver_id` (`receiver_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=260 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('unread','read') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unread',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `bill_id` int NOT NULL,
  `tenant_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_method` enum('bank_transfer','cash','credit_card','e_wallet') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `bill_id` (`bill_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alias` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `properties` (
  `property_id` int NOT NULL AUTO_INCREMENT,
  `landlord_id` int NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `area` float NOT NULL,
  `utilities` text COLLATE utf8mb4_unicode_ci,
  `max_people` int NOT NULL,
  `furniture` enum('full','basic','none') COLLATE utf8mb4_unicode_ci NOT NULL,
  `available_from` date NOT NULL,
  `property_type` enum('apartment','house','office','storefront') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'apartment',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`property_id`),
  KEY `landlord_id` (`landlord_id`),
  CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `property_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `reporter_id` int NOT NULL,
  `reported_property_id` int NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','resolved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  KEY `reporter_id` (`reporter_id`),
  KEY `reported_property_id` (`reported_property_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reported_property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `tenant_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `tenant_id` (`tenant_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `role_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `room_transfer_requests` (
  `transfer_id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int NOT NULL,
  `property_id` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transfer_id`),
  KEY `tenant_id` (`tenant_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `room_transfer_requests_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `room_transfer_requests_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roommate_finder` (
  `finder_id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int NOT NULL,
  `preferred_location` text COLLATE utf8mb4_unicode_ci,
  `budget` decimal(10,2) DEFAULT NULL,
  `move_in_date` date DEFAULT NULL,
  `preferences` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','matched','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`finder_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `roommate_finder_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roommate_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int NOT NULL,
  `property_id` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('open','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `tenant_id` (`tenant_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `roommate_requests_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `roommate_requests_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `save_posts` (
  `save_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `saved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`save_id`),
  UNIQUE KEY `save_posts_user_id_post_id_key` (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `save_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `save_posts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','landlord','tenant') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tenant',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('d4f09dbb-e152-4205-b461-bd296ebf61c6', '9581bb259cadee2b8851cb541e7d59f7668c803e76e9883642282e4461983314', '2025-04-21 00:03:33.590', '20250421000328_create_save_posts_with_unique', NULL, NULL, '2025-04-21 00:03:28.281', 1);








INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(255, 2, 1, 'Hello! I am interested in your property.', '2025-04-25 03:45:06');
INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(256, 1, 2, 'alo', '2025-04-25 03:51:40');
INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(257, 2, 1, 'ua alo', '2025-04-25 03:52:01');
INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(258, 2, 1, 'hi', '2025-04-25 03:53:12'),
(259, 2, 1, 'tui ne', '2025-04-25 03:53:19');





INSERT INTO `posts` (`post_id`, `property_id`, `title`, `alias`, `price`, `description`, `status`, `is_approved`, `created_at`) VALUES
(1, 1, 'Cozy 2-Bedroom Apartment for Rent in City Center – Fully Furnished', 'cozy-2-bedroom-apartment-for-rent-in-city-center-fully-furnished', '50000.00', 'Welcome to your future home – a spacious and modern 2-bedroom apartment located in the heart of [City Name], offering the perfect balance of comfort, style, and convenience. This beautifully furnished apartment is situated in a peaceful and safe neighborhood, ideal for professionals, students, or small families who value both tranquility and urban living. Upon entering the apartment, you’ll be greeted by a bright and airy living space that has been thoughtfully\n. The open-concept layout seamlessly connects the living room to a fully equipped kitchen featuring modern appliances, sleek countertops, and ample storage – perfect for preparing meals or entertaining guests. Each of the two bedrooms offers generous closet space, large windows for natural light, and cozy furnishings to ensure restful nights. The apartment also includes a stylish bathroom with contemporary fixtures, a private balcony to enjoy your morning coffee, and access to amenities such as a fitness center, secure parking, and high-speed internet.', 'active', 1, '2025-04-21 01:00:05');
INSERT INTO `posts` (`post_id`, `property_id`, `title`, `alias`, `price`, `description`, `status`, `is_approved`, `created_at`) VALUES
(2, 2, 'Spacious 3-Bedroom House for Rent in Ho Chi Minh City – Prime Location!', 'spacious-3-bedroom-house-for-rent-in-ho-chi-minh-city-prime-location', '1000000.00', 'Welcome to your new home in the heart of Ho Chi Minh City!\nThis beautifully maintained 3-bedroom, 2-bathroom house offers generous living space, a modern kitchen, and a private balcony. Located in a safe and friendly neighborhood, it\'s just minutes away from schools, supermarkets, cafes, and public transportation.', 'active', 0, '2025-04-21 13:24:55');


INSERT INTO `properties` (`property_id`, `landlord_id`, `address`, `area`, `utilities`, `max_people`, `furniture`, `available_from`, `property_type`, `description`, `created_at`) VALUES
(1, 1, '19 Nguyen Huu Tho, Tan Phong District 7, HCM City', 30, 'TV;Air Conditioning;Swimming Pool;Parking;Pet Friendly;Security 24/7;Elevator;Concierge Service;Hot Water', 3, 'basic', '2025-04-29', 'apartment', '', '2025-04-21 00:59:05');
INSERT INTO `properties` (`property_id`, `landlord_id`, `address`, `area`, `utilities`, `max_people`, `furniture`, `available_from`, `property_type`, `description`, `created_at`) VALUES
(2, 1, 'Saigon Notre-Dame Cathedral Basilica, Ho Chi Minh City', 25, 'TV;Parking;Swimming Pool;Security 24/7;BBQ Area;Heating;Hot Water;Air Conditioning;Balcony;Laundry Service', 2, 'full', '2025-04-21', 'apartment', '', '2025-04-21 07:17:48');


INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(1, 1, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745197145/RentQ/m9q0z9bwe7to9cfbaivu.jpg', 1, '2025-04-21 00:59:09');
INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(2, 1, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745197146/RentQ/amugjyzgusr32hdbdobi.jpg', 0, '2025-04-21 00:59:09');
INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(3, 1, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745197146/RentQ/kwuxkdevohz5ktu7uely.jpg', 0, '2025-04-21 00:59:09');
INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(4, 2, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745219872/RentQ/wohfhcxdvd4lmtmakjs7.jpg', 1, '2025-04-21 07:17:55'),
(5, 2, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745219869/RentQ/oi4lcgsc7oajiytjnvln.jpg', 0, '2025-04-21 07:17:55'),
(6, 2, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745219869/RentQ/sf08tbsuhgdd7zfgmchs.jpg', 0, '2025-04-21 07:17:55'),
(7, 2, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745219869/RentQ/iokt0r4mw6cozlomezi4.jpg', 0, '2025-04-21 07:17:55');



INSERT INTO `reviews` (`review_id`, `property_id`, `tenant_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 3, 4, 'cũng ok á', '2025-04-21 08:29:43');
INSERT INTO `reviews` (`review_id`, `property_id`, `tenant_id`, `rating`, `comment`, `created_at`) VALUES
(2, 1, 3, 5, 'okok', '2025-04-21 08:34:07');
INSERT INTO `reviews` (`review_id`, `property_id`, `tenant_id`, `rating`, `comment`, `created_at`) VALUES
(3, 1, 2, 4, 'hu', '2025-04-21 09:04:52');
INSERT INTO `reviews` (`review_id`, `property_id`, `tenant_id`, `rating`, `comment`, `created_at`) VALUES
(5, 1, 2, 5, 'rất ê nha', '2025-04-21 10:06:29'),
(6, 1, 2, 3, 'rất ê nha eheeeeeeeeeee', '2025-04-21 10:08:15'),
(7, 1, 2, 1, 'thay ghe', '2025-04-21 10:17:12'),
(8, 1, 2, 2, 'eheh ehe ehe', '2025-04-21 12:27:56');

INSERT INTO `role_requests` (`request_id`, `user_id`, `status`, `created_at`) VALUES
(1, 1, 'approved', '2025-04-21 00:10:05');
INSERT INTO `role_requests` (`request_id`, `user_id`, `status`, `created_at`) VALUES
(2, 3, 'approved', '2025-04-21 07:38:29');








INSERT INTO `save_posts` (`save_id`, `user_id`, `post_id`, `saved_at`) VALUES
(10, 3, 1, '2025-04-21 08:13:02');


INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(1, 'Giang Nguyen', '0147852369', 'huonggiang7657@gmail.com', '$2b$10$bQey6N7HsVOVg1auuK86wuD9eJO98rZq8U1N3/XKnQyNmY5PmOWjW', '19 ABC', 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg', 'landlord', 1, '2025-04-21 00:09:31');
INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(2, 'Ngoc Diepp', '0369852147', 'ngocdiep@gmail.com', '$2b$10$3qquydSlO/5Z4jHzFX60Ju7zKoupn9c4f6e5zEjK/JMtiSqJGbsYa', 'Ben Tre', 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg', 'tenant', 1, '2025-04-21 01:01:15');
INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(3, 'Ehegg', '0879645213', 'abc14852@gmail.com', '$2b$10$vYsgM2.2959zAxH1MqNLp.cmcgQDTtcs3fsVxFZb.bngHqG5s2sWi', '19 ABC', 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg', 'landlord', 1, '2025-04-21 06:28:23');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;