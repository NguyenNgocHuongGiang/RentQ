/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `bills` (
  `bill_id` int NOT NULL AUTO_INCREMENT,
  `contract_id` int NOT NULL,
  `bill_type` enum('rent','electricity','water','other') NOT NULL,
  `usage_amount` float DEFAULT NULL,
  `price_per_unit` decimal(10,2) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `due_date` date NOT NULL,
  `status` enum('paid','unpaid') NOT NULL DEFAULT 'unpaid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bill_id`),
  KEY `contract_id` (`contract_id`),
  CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`contract_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `contract_tenants` (
  `contract_id` int NOT NULL,
  `tenant_id` int NOT NULL,
  PRIMARY KEY (`contract_id`,`tenant_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `contract_tenants_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`contract_id`) ON DELETE CASCADE,
  CONSTRAINT `contract_tenants_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `contracts` (
  `contract_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `landlord_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `actual_move_in_date` date DEFAULT NULL,
  `deposit` decimal(10,2) NOT NULL,
  `rent` decimal(10,2) NOT NULL,
  `status` enum('active','terminated','pending') NOT NULL DEFAULT 'pending',
  `contract_file_url` varchar(255) DEFAULT NULL,
  `terms_and_conditions` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contract_id`),
  KEY `property_id` (`property_id`),
  KEY `landlord_id` (`landlord_id`),
  CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE,
  CONSTRAINT `contracts_ibfk_2` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read') NOT NULL DEFAULT 'unread',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `bill_id` int NOT NULL,
  `tenant_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_method` enum('bank_transfer','cash','credit_card','e_wallet') NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `bill_id` (`bill_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `alias` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `properties` (
  `property_id` int NOT NULL AUTO_INCREMENT,
  `landlord_id` int NOT NULL,
  `address` text NOT NULL,
  `area` float NOT NULL,
  `utilities` text,
  `max_people` int NOT NULL,
  `furniture` enum('full','basic','none') NOT NULL,
  `available_from` date NOT NULL,
  `property_type` enum('apartment','house','office','storefront') NOT NULL DEFAULT 'apartment',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`property_id`),
  KEY `landlord_id` (`landlord_id`),
  CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `property_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `reporter_id` int NOT NULL,
  `reported_property_id` int NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','resolved') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  KEY `reporter_id` (`reporter_id`),
  KEY `reported_property_id` (`reported_property_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reported_property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `tenant_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `property_id` (`property_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `role_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `role_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `room_transfer_requests` (
  `transfer_id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int NOT NULL,
  `property_id` int NOT NULL,
  `description` text NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transfer_id`),
  KEY `tenant_id` (`tenant_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `room_transfer_requests_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `room_transfer_requests_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roommate_finder` (
  `finder_id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int NOT NULL,
  `preferred_location` text,
  `budget` decimal(10,2) DEFAULT NULL,
  `move_in_date` date DEFAULT NULL,
  `preferences` text,
  `status` enum('active','matched','closed') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`finder_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `roommate_finder_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roommate_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int NOT NULL,
  `property_id` int NOT NULL,
  `description` text,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `tenant_id` (`tenant_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `roommate_requests_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `roommate_requests_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text,
  `avatar_url` varchar(255) DEFAULT NULL,
  `role` enum('admin','landlord','tenant') NOT NULL DEFAULT 'tenant',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `save_posts` (
  `save_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `saved_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`save_id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `save_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `save_posts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;











INSERT INTO `posts` (`post_id`, `property_id`, `title`, `alias`, `price`, `description`, `status`, `is_approved`, `created_at`) VALUES
(2, 3, 'Luxury Apartment', 'luxury-apartment', '15000000.00', 'Beautiful apartment, close to downtown', 'active', 1, '2025-04-09 03:55:19');
INSERT INTO `posts` (`post_id`, `property_id`, `title`, `alias`, `price`, `description`, `status`, `is_approved`, `created_at`) VALUES
(3, 3, 'Nhà xịn quá nè', 'nha-xin-qua-ne', '5000000.00', 'nha cung dep a', 'active', 1, '2025-04-16 07:50:18');
INSERT INTO `posts` (`post_id`, `property_id`, `title`, `alias`, `price`, `description`, `status`, `is_approved`, `created_at`) VALUES
(4, 4, 'bài post test', 'bai-post-test', '500000.00', 'cũng cũng á', 'active', 1, '2025-04-16 08:27:53');
INSERT INTO `posts` (`post_id`, `property_id`, `title`, `alias`, `price`, `description`, `status`, `is_approved`, `created_at`) VALUES
(5, 3, 'cũng là cái nhà nãy nè', 'cung-la-cai-nha-nay-ne', '100000.00', 'đẹp á thuê đi', 'active', 1, '2025-04-16 08:33:48'),
(6, 7, 'Nhà này đẹp lắm nè', 'nha-nay-ep-lam-ne', '3000000.00', 'ib để thương lượng giá nhe', 'active', 1, '2025-04-16 09:48:29'),
(7, 10, 'Cozy 2-Bedroom Apartment for Rent in City Center – Fully Furnished', 'cozy-2-bedroom-apartment-for-rent-in-city-center-fully-furnished', '50000.00', 'Welcome to your future home – a spacious and modern 2-bedroom apartment located in the heart of [City Name], offering the perfect balance of comfort, style, and convenience. This beautifully furnished apartment is situated in a peaceful and safe neighborhood, ideal for professionals, students, or small families who value both tranquility and urban living. Upon entering the apartment, you’ll be greeted by a bright and airy living space that has been thoughtfully', 'active', 1, '2025-04-20 22:44:48');

INSERT INTO `properties` (`property_id`, `landlord_id`, `address`, `area`, `utilities`, `max_people`, `furniture`, `available_from`, `property_type`, `description`, `created_at`) VALUES
(3, 3, '123 ABC Street, District 1', 500, 'Free electricity, water, internet', 3, 'full', '2024-08-01', 'apartment', 'Beautiful apartment, close to downtown', '2025-04-09 03:11:51');
INSERT INTO `properties` (`property_id`, `landlord_id`, `address`, `area`, `utilities`, `max_people`, `furniture`, `available_from`, `property_type`, `description`, `created_at`) VALUES
(4, 3, 'ZXZXZ, fdsfdsf, fdsfd', 2, 'fdsfsdf', 1, 'basic', '2025-04-12', 'apartment', 'sdfsdfsdf', '2025-04-13 09:16:55');
INSERT INTO `properties` (`property_id`, `landlord_id`, `address`, `area`, `utilities`, `max_people`, `furniture`, `available_from`, `property_type`, `description`, `created_at`) VALUES
(7, 3, 'xXZ, zxccz, czczxczx', 4, 'cxzcxzc', 1, 'none', '2025-04-14', 'apartment', 'czxczxc', '2025-04-14 07:22:00');
INSERT INTO `properties` (`property_id`, `landlord_id`, `address`, `area`, `utilities`, `max_people`, `furniture`, `available_from`, `property_type`, `description`, `created_at`) VALUES
(8, 3, 'czxcxzc, cxzczxc, cxzczxc', 2, 'czxcxz', 1, 'basic', '2025-04-14', 'apartment', 'czxcz', '2025-04-14 07:25:37'),
(9, 3, 'sddsd, sdsadsad, đâsd', 3, 'dsdasda', 5, 'basic', '2025-04-14', 'apartment', 'đâsdasda', '2025-04-14 07:48:05'),
(10, 3, 'dfsfsdfsd, vcbcbc, qeqwew', 4, 'Wi-Fi;Parking;Air Conditioning;Heating\r\n;\r\nElevator; Swimming Pool;Oven;Hot Water', 1, 'full', '2025-04-14', 'apartment', 'weqe', '2025-04-14 08:32:05');

INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(1, 3, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1743238105/RentQ/gbfp1plib57vdla2uexq.jpg', 1, '2025-04-09 03:55:19');
INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(3, 4, 'https://static.spacet.vn/image-resized/1024x10240_max/img/blog/2023-05-25/top-29-mau-thiet-ke-phong-khach-nha-ong-4m-dep-theo-xu-huong-moi-nhat-646f0fba5216e707cc910c35.webp', 1, '2025-04-14 04:41:27');
INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(6, 7, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1744615320/RentQ/cvow4p0te1t2603muwji.jpg', 1, '2025-04-14 07:22:04');
INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(7, 7, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1744615323/RentQ/ee1o7eenxcclhdx1dwof.jpg', 0, '2025-04-14 07:22:04'),
(8, 8, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1744615538/RentQ/zwryqxdxj8aoh9hgfi8z.jpg', 1, '2025-04-14 07:25:44'),
(9, 8, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1744615542/RentQ/tviewb4xhz4rdd5ec3af.jpg', 0, '2025-04-14 07:25:44'),
(10, 9, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1744616889/RentQ/dqvayrdmhkfaon0ujggp.jpg', 1, '2025-04-14 07:48:11'),
(11, 9, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1744616889/RentQ/v5mbtatoaj1rsydhlsbw.jpg', 0, '2025-04-14 07:48:11'),
(12, 10, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1744619530/RentQ/w6ittfzfjckrr3hkpejs.jpg', 1, '2025-04-14 08:32:11'),
(13, 10, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1744619526/RentQ/mb9toalp3jncmxevevts.jpg', 0, '2025-04-14 08:32:12');



INSERT INTO `reviews` (`review_id`, `property_id`, `tenant_id`, `rating`, `comment`, `created_at`) VALUES
(1, 3, 2, 5, 'ok a', '2025-04-09 03:44:52');
INSERT INTO `reviews` (`review_id`, `property_id`, `tenant_id`, `rating`, `comment`, `created_at`) VALUES
(2, 3, 2, 5, 'ok', '2025-04-16 19:01:32');
INSERT INTO `reviews` (`review_id`, `property_id`, `tenant_id`, `rating`, `comment`, `created_at`) VALUES
(3, 3, 4, 3, 'cung cung a', '2025-04-20 23:09:41');
INSERT INTO `reviews` (`review_id`, `property_id`, `tenant_id`, `rating`, `comment`, `created_at`) VALUES
(4, 3, 4, 4, 'cung ok a', '2025-04-20 23:13:43'),
(5, 3, 4, 5, 'ahihi', '2025-04-20 23:17:10'),
(6, 3, 4, 5, 'nha dep qua ne ma co ma', '2025-04-20 23:17:54'),
(7, 3, 4, 5, 'dep a', '2025-04-20 23:19:30');

INSERT INTO `role_requests` (`request_id`, `user_id`, `status`, `created_at`) VALUES
(1, 2, 'approved', '2025-04-09 04:16:16');








INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(1, 'John Doe', '1234567890', 'john@example.com', '$2b$10$3l9Bil1J/F2wMWVJf1qhl..2Jp/5aUoI8IMcGeoBRre9/l2ikB5i2', '123 Main St', 'https://example.com/avatar.jpg', 'landlord', 1, '2025-04-08 18:38:33');
INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(2, 'John Doe', '0123654789', 'john1@example.com', '$2b$10$3l9Bil1J/F2wMWVJf1qhl..2Jp/5aUoI8IMcGeoBRre9/l2ikB5i2', '123 Main St ne', 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg', 'tenant', 1, '2025-04-08 18:38:33');
INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(3, 'Giang Nguyen', '0147852369', 'huonggiang7657@gmail.com', '$2b$10$CRo4J4GjFMXFlOFwulXHf.i8H/zFODizMnaqNTokpJw7r6PN4k4LK', '19 ABC ne', 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg', 'landlord', 1, '2025-04-10 03:42:47');
INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(4, 'Ngoc Diepp', '0369852147', 'ngocdiep@gmail.com', '$2b$10$CRo4J4GjFMXFlOFwulXHf.i8H/zFODizMnaqNTokpJw7r6PN4k4LK', '19 ABC hi', 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg', 'tenant', 1, '2025-04-10 03:42:47');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;