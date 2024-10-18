DROP DATABASE IF EXISTS `job-board`;   
CREATE DATABASE IF NOT EXISTS `job-board`;

USE `job-board`;

CREATE TABLE `people`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(60) NOT NULL,
    `lastname` VARCHAR(60) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `experiences` VARCHAR(255) NOT NULL,
    `studies` VARCHAR(255) NOT NULL,
    `skills` VARCHAR(255) NOT NULL,
    `business_sector` VARCHAR(255) NOT NULL,
    `target_job` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `users`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `permission` ENUM('applicants', 'admin') DEFAULT 'applicants',
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `people_id` INT,
    PRIMARY KEY (`id`),
    CONSTRAINT `user_people_id_foreign` FOREIGN KEY(`people_id`) REFERENCES `people`(`id`)
);

CREATE TABLE `companies`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `business_sector` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `employees` INT NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `advertisements`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
    `wages` INT NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `working_times` VARCHAR(255) NOT NULL,
    `company_id` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    CONSTRAINT `advertisement_company_id_foreign` FOREIGN KEY(`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE
);

CREATE TABLE `applications`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `message` TEXT NOT NULL,
    `people_id` INT NOT NULL,
    `advertisement_id` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    CONSTRAINT `application_people_id_foreign` FOREIGN KEY(`people_id`) REFERENCES `people`(`id`) ON DELETE CASCADE,
    CONSTRAINT `application_advertisement_id_foreign` FOREIGN KEY(`advertisement_id`) REFERENCES `advertisements`(`id`) ON DELETE CASCADE
);