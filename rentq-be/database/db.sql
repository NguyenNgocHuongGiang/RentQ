CREATE DATABASE IF NOT EXISTS `RentQ`;

USE `RentQ`;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    avatar_url VARCHAR(255),
    role ENUM('admin', 'landlord', 'tenant') NOT NULL DEFAULT 'tenant',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
    listing_id INT PRIMARY KEY AUTO_INCREMENT,
    landlord_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    area FLOAT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    utilities TEXT,
    max_people INT NOT NULL,
    furniture ENUM('full', 'basic', 'none') NOT NULL,
    available_from DATE NOT NULL,
    property_type ENUM('apartment', 'house', 'office', 'storefront') NOT NULL DEFAULT 'apartment',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (landlord_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng mới để lưu hình ảnh của tin đăng
CREATE TABLE listing_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN NOT NULL DEFAULT FALSE, -- Đánh dấu ảnh chính
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
);

CREATE TABLE contracts (
    contract_id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    tenant_id INT NOT NULL,
    landlord_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    actual_move_in_date DATE DEFAULT NULL,
    deposit DECIMAL(10,2) NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'terminated', 'pending') NOT NULL DEFAULT 'pending',
    contract_file_url VARCHAR(255),
    terms_and_conditions TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (landlord_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE bills (
    bill_id INT PRIMARY KEY AUTO_INCREMENT,
    contract_id INT NOT NULL,
    bill_type ENUM('rent', 'electricity', 'water', 'other') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('paid', 'unpaid') NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(contract_id) ON DELETE CASCADE
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT NOT NULL,
    tenant_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('bank_transfer', 'cash', 'credit_card', 'e_wallet') NOT NULL,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE roommate_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    listing_id INT NOT NULL,
    description TEXT,
    status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
);

CREATE TABLE roommate_finder (
    finder_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    preferred_location TEXT,
    budget DECIMAL(10,2),
    move_in_date DATE,
    preferences TEXT,
    status ENUM('active', 'matched', 'closed') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    tenant_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    reporter_id INT NOT NULL,
    reported_listing_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'resolved') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read') NOT NULL DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



