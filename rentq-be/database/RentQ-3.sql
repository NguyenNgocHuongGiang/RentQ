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

CREATE TABLE bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('UNPAID', 'PAID', 'CANCELLED') DEFAULT 'UNPAID',
    payment_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(contract_id) ON DELETE CASCADE
);

CREATE TABLE bill_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    item_type ENUM('RENT','SERVICE','ELECTRIC','WATER','INTERNET','OTHER') NOT NULL,
    description VARCHAR(255),
    amount DECIMAL(12,2) NOT NULL,      -- đơn giá (vd: 3,500 VND/kWh)
    start_number DECIMAL(12,2),         -- số đầu (nếu có)
    end_number DECIMAL(12,2),           -- số cuối (nếu có)
    total_price DECIMAL(12,2),          -- thành tiền cho item (end_number - start_number) * amount
    note VARCHAR(255),                  -- ghi chú khi item_type = 'OTHER'
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    INDEX idx_bill_items_bill_id (bill_id)
);

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `property_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('d4f09dbb-e152-4205-b461-bd296ebf61c6', '9581bb259cadee2b8851cb541e7d59f7668c803e76e9883642282e4461983314', '2025-04-21 00:03:33.590', '20250421000328_create_save_posts_with_unique', NULL, NULL, '2025-04-21 00:03:28.281', 1);




INSERT INTO `contract_tenants` (`contract_id`, `tenant_id`) VALUES
(4, 2);
INSERT INTO `contract_tenants` (`contract_id`, `tenant_id`) VALUES
(7, 2);
INSERT INTO `contract_tenants` (`contract_id`, `tenant_id`) VALUES
(9, 2);
INSERT INTO `contract_tenants` (`contract_id`, `tenant_id`) VALUES
(11, 2),
(12, 2),
(14, 2),
(8, 3),
(7, 4),
(9, 4);

INSERT INTO `contracts` (`contract_id`, `property_id`, `landlord_id`, `start_date`, `end_date`, `actual_move_in_date`, `deposit`, `rent`, `status`, `contract_file_url`, `terms_and_conditions`, `created_at`) VALUES
(1, 1, 1, '2025-02-21', '2025-08-21', '2025-02-21', '3000.00', '50000.00', 'active', 'https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf', 'none', '2025-02-20 00:09:31');
INSERT INTO `contracts` (`contract_id`, `property_id`, `landlord_id`, `start_date`, `end_date`, `actual_move_in_date`, `deposit`, `rent`, `status`, `contract_file_url`, `terms_and_conditions`, `created_at`) VALUES
(2, 1, 2, '2025-02-21', '2025-02-22', '2025-02-21', '5000000.00', '15000000.00', 'pending', 'https://example.com/contracts/contract_123.pdf', 'Terms and conditions content here...', '2025-06-09 18:30:57');
INSERT INTO `contracts` (`contract_id`, `property_id`, `landlord_id`, `start_date`, `end_date`, `actual_move_in_date`, `deposit`, `rent`, `status`, `contract_file_url`, `terms_and_conditions`, `created_at`) VALUES
(4, 1, 1, '2025-06-09', '2025-06-13', '2025-06-10', '500000.00', '500000.00', 'active', 'https://drive.google.com/file/d/1dh0YGGYfIMKwwliTRh7UAhNk2W7I0U-3/view?usp=sharing', 'aaaaaaaaaa', '2025-06-09 18:44:21');
INSERT INTO `contracts` (`contract_id`, `property_id`, `landlord_id`, `start_date`, `end_date`, `actual_move_in_date`, `deposit`, `rent`, `status`, `contract_file_url`, `terms_and_conditions`, `created_at`) VALUES
(5, 3, 1, '2025-06-09', '2025-06-12', '2025-06-10', '777.00', '77777777.00', 'pending', 'https://www.instagram.com/', 'ssssssss', '2025-06-09 18:45:47'),
(7, 4, 1, '2025-05-31', '2025-06-30', '2025-06-01', '500000.00', '5000000.00', 'pending', 'https://www.instagram.com/', '', '2025-06-20 07:58:35'),
(8, 3, 1, '2025-08-03', '2025-08-27', '2025-08-19', '2.00', '21.00', 'pending', 'https://www.instagram.com/', '', '2025-08-06 10:05:03'),
(9, 3, 1, '2025-08-06', '2025-08-19', '2025-08-07', '3.00', '30.00', 'pending', 'https://www.instagram.com/', 'dấdsadsadas', '2025-08-16 16:57:00'),
(11, 1, 1, '2025-08-05', '2025-09-05', '2025-08-06', '500.00', '5000.00', 'pending', 'https://www.instagram.com/', 'sdsafaf', '2025-08-17 11:09:32'),
(12, 1, 1, '2025-08-10', '2025-09-21', '2025-08-11', '500.00', '5000.00', 'pending', 'https://www.instagram.com/', 'gcggvhjjvh', '2025-08-17 11:14:17'),
(14, 3, 1, '2025-08-21', '2025-09-21', '2025-08-20', '50.00', '500.00', 'pending', 'https://www.instagram.com/', 'sadascfa', '2025-08-19 09:34:03');

INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(287, 2, 1, 'Hello! I am interested in your property.', '2025-05-04 19:52:28');
INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(288, 1, 2, 'hi', '2025-05-04 19:52:42');
INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(289, 1, 1, 'Hello! I am interested in your property.', '2025-05-09 08:45:59');
INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(290, 1, 1, 'hi', '2025-05-09 08:46:12'),
(291, 1, 1, 'alo', '2025-05-09 08:51:03'),
(292, 1, 1, 'alo', '2025-05-09 08:51:05'),
(293, 1, 1, 'hi', '2025-05-09 08:51:10'),
(294, 1, 1, 'ua alo', '2025-05-09 08:51:20'),
(295, 1, 1, 'hi', '2025-05-09 08:53:37'),
(296, 1, 2, 'alo ranh hem', '2025-05-09 08:53:55'),
(297, 2, 1, 'hong ban lam', '2025-05-09 08:54:00'),
(298, 1, 2, 'alo', '2025-06-09 16:51:08'),
(299, 2, 1, 'sao di', '2025-06-09 16:51:23'),
(300, 1, 1, 'Hello! I am interested in your property.', '2025-06-22 19:06:54'),
(301, 2, 1, 'https://drive.google.com/file/d/1dh0YGGYfIMKwwliTRh7UAhNk2W7I0U-3/view?usp=sharing', '2025-06-27 08:52:54'),
(302, 2, 1, 'cai hop dong nay no khong hop ly\ndieu 1: dsadhsfhbsdah\ndieu 2: sdfghjkl', '2025-06-27 08:52:54');



INSERT INTO `posts` (`post_id`, `property_id`, `title`, `alias`, `price`, `description`, `status`, `is_approved`, `created_at`) VALUES
(1, 1, 'Cozy 2-Bedroom Apartment for Rent in City Center – Fully Furnished', 'cozy-2-bedroom-apartment-for-rent-in-city-center-fully-furnished', '50000.00', 'Welcome to your future home – a spacious and modern 2-bedroom apartment located in the heart of [City Name], offering the perfect balance of comfort, style, and convenience. This beautifully furnished apartment is situated in a peaceful and safe neighborhood, ideal for professionals, students, or small families who value both tranquility and urban living. Upon entering the apartment, you’ll be greeted by a bright and airy living space that has been thoughtfully\n. The open-concept layout seamlessly connects the living room to a fully equipped kitchen featuring modern appliances, sleek countertops, and ample storage – perfect for preparing meals or entertaining guests. Each of the two bedrooms offers generous closet space, large windows for natural light, and cozy furnishings to ensure restful nights. The apartment also includes a stylish bathroom with contemporary fixtures, a private balcony to enjoy your morning coffee, and access to amenities such as a fitness center, secure parking, and high-speed internet.', 'active', 1, '2025-04-21 01:00:05');
INSERT INTO `posts` (`post_id`, `property_id`, `title`, `alias`, `price`, `description`, `status`, `is_approved`, `created_at`) VALUES
(15, 3, 'Modern Serviced Apartment in the Heart of Ho Chi Minh City', 'modern-serviced-apartment-in-the-heart-of-ho-chi-minh-city', '5000000.00', 'Enjoy comfortable urban living in this fully furnished serviced apartment located in central Ho Chi Minh City. Featuring a cozy bedroom, stylish living space, and a fully equipped kitchen, this apartment is ideal for both short and long stays. Services include weekly housekeeping, high-speed Wi-Fi, 24/7 security, and laundry facilities. Conveniently situated near cafes, restaurants, and shopping centers, it offers the perfect blend of comfort and convenience.\nWhether you\'re a business traveler, digital nomad, or simply exploring the vibrant city life, this apartment provides a peaceful retreat amidst the hustle and bustle of Saigon. With easy access to public transportation and major landmarks, you\'ll find everything you need just minutes away.', 'active', 1, '2025-05-09 08:43:04');


INSERT INTO `properties` (`property_id`, `landlord_id`, `address`, `area`, `utilities`, `max_people`, `furniture`, `available_from`, `property_type`, `description`, `created_at`) VALUES
(1, 1, '19 Nguyen Huu Tho, Tan Phong District 7, HCM City', 30, 'TV;Air Conditioning;Swimming Pool;Parking;Pet Friendly;Security 24/7;Elevator;Concierge Service;Hot Water', 3, 'basic', '2025-04-29', 'apartment', '', '2025-04-21 00:59:05');
INSERT INTO `properties` (`property_id`, `landlord_id`, `address`, `area`, `utilities`, `max_people`, `furniture`, `available_from`, `property_type`, `description`, `created_at`) VALUES
(3, 1, '63D Ung Van Khiem, Binh Thanh District, Ho Chi Minh City', 40, 'Elevator;Security 24/7;Air Conditioning;Wi-Fi;Dishwasher;Parking;Pet Friendly;TV', 3, 'basic', '2025-05-08', 'apartment', '', '2025-05-09 08:41:43');
INSERT INTO `properties` (`property_id`, `landlord_id`, `address`, `area`, `utilities`, `max_people`, `furniture`, `available_from`, `property_type`, `description`, `created_at`) VALUES
(4, 1, 'Xo Viet Nghe Tinh, Binh Thanh District, Ho Chi Minh City', 36, 'Wi-Fi;Refrigerator;Air Conditioning;Parking;Elevator;Security 24/7;Laundry Service;Balcony;Pet Friendly', 4, 'basic', '2025-05-09', 'apartment', '', '2025-05-09 09:18:00');

INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(1, 1, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745197145/RentQ/m9q0z9bwe7to9cfbaivu.jpg', 1, '2025-04-21 00:59:09');
INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(2, 1, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745197146/RentQ/amugjyzgusr32hdbdobi.jpg', 0, '2025-04-21 00:59:09');
INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(3, 1, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1745197146/RentQ/kwuxkdevohz5ktu7uely.jpg', 0, '2025-04-21 00:59:09');
INSERT INTO `property_images` (`image_id`, `property_id`, `image_url`, `is_main`, `uploaded_at`) VALUES
(29, 3, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1746780105/RentQ/wfhwjqvojyh7ldz1twzt.jpg', 0, '2025-05-09 08:41:47'),
(30, 3, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1746780105/RentQ/suw6qbumdnis1cgwvplh.jpg', 0, '2025-05-09 08:41:47'),
(31, 3, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1746780105/RentQ/eagrj1jzsyztcf0gj9hr.jpg', 1, '2025-05-09 08:41:47'),
(32, 4, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1746782281/RentQ/fpb6cyo4fgujmii5tdqa.jpg', 1, '2025-05-09 09:18:04'),
(33, 4, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1746782282/RentQ/ydw7heeslsmj9vyalwgb.jpg', 0, '2025-05-09 09:18:04'),
(34, 4, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1746782282/RentQ/w8c6dynb8sfapdsttdkd.jpg', 0, '2025-05-09 09:18:04'),
(35, 4, 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1746782282/RentQ/undx29flxe58a0pogrmt.jpg', 0, '2025-05-09 09:18:04');



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
(1, 'Giang Nguyen ne hi', '0147852369', 'huonggiang7657@gmail.com', '$2b$10$bQey6N7HsVOVg1auuK86wuD9eJO98rZq8U1N3/XKnQyNmY5PmOWjW', '19 ABCE', 'https://picsum.photos/id/1/200/300', 'landlord', 1, '2025-04-21 00:09:31');
INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(2, 'Ngoc Diep', '0369852147', 'ngocdiep@gmail.com', '$2b$10$3qquydSlO/5Z4jHzFX60Ju7zKoupn9c4f6e5zEjK/JMtiSqJGbsYa', 'Ben Tre', 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg', 'tenant', 1, '2025-04-21 01:01:15');
INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(3, 'Ehegg', '0879645213', 'abc14852@gmail.com', '$2b$10$vYsgM2.2959zAxH1MqNLp.cmcgQDTtcs3fsVxFZb.bngHqG5s2sWi', '19 ABC', 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg', 'landlord', 1, '2025-04-21 06:28:23');
INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `password`, `address`, `avatar_url`, `role`, `is_verified`, `created_at`) VALUES
(4, 'TestTenant', '0258963147', 'testtenant@gmail.com', '$2b$10$bQey6N7HsVOVg1auuK86wuD9eJO98rZq8U1N3/XKnQyNmY5PmOWjW', '25 DEF', 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg', 'tenant', 1, '2025-04-21 06:28:23');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;