

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `placeID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `text` varchar(250) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `place` (
  `PlaceID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `owner_name` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `place_name` varchar(100) NOT NULL,
  `price` double NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `place` (`PlaceID`, `UserID`, `owner_name`, `phone_number`, `address`, `place_name`, `price`, `status`, `image_path`) VALUES
(25, 31, 'Bence Ritzl', '06304567788', 'Békás, Sarkadi Imre utca 12', 'Békás sportközpont', 14500, 1, '/uploads/1743153827815-bekas.jpg'),
(26, 31, 'Bence Ritzl', '06304567788', 'Budapest, zugló Bálint utca 13.', 'Zuglói Józsa Attila Sportcentrum', 23450, 1, '/uploads/1743153990531-belcentrum.jpg'),
(27, 32, 'Márk Krizsicskó', '06304567788', 'Érd', 'Érdi Sportpálya', 34000, 1, '/uploads/1743155108251-erd.jpg');


CREATE TABLE `rents` (
  `RentID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `PlaceID` int(11) NOT NULL,
  `OwnerPhoneNumber` varchar(15) DEFAULT NULL,
  `UserName` varchar(100) DEFAULT NULL,
  `UserPhoneNumber` varchar(15) DEFAULT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `TotalAmount` double NOT NULL,
  `status` enum('not started','ongoing','canceled','done') NOT NULL DEFAULT 'not started'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `rents` (`RentID`, `UserID`, `PlaceID`, `OwnerPhoneNumber`, `UserName`, `UserPhoneNumber`, `StartDate`, `EndDate`, `TotalAmount`, `status`) VALUES
(62, 32, 25, '06304567788', 'Márk Krizsicskó', '06304567788', '2025-03-30 19:00:00', '2025-03-30 21:00:00', 29000, 'not started'),
(63, 32, 26, '06304567788', 'Márk Krizsicskó', '06304567788', '2025-04-01 18:00:00', '2025-04-01 20:00:00', 46900, 'not started'),
(64, 30, 26, '06304567788', 'János Dávid Fekete', '06501379865', '2025-03-29 18:00:00', '2025-03-29 21:00:00', 70350, 'not started'),
(65, 30, 27, '06304567788', 'János Dávid Fekete', '06501379865', '2025-04-27 16:00:00', '2025-04-27 21:00:00', 170000, 'not started'),
(66, 31, 26, '06304567788', 'Bence Ritzl', '06304567788', '2025-04-17 16:00:00', '2025-04-17 18:00:00', 46900, 'not started');


CREATE TABLE `reported` (
  `id` int(11) NOT NULL,
  `report_type` enum('user','place','comment') NOT NULL,
  `reported_id` int(11) NOT NULL,
  `reporter_id` int(11) NOT NULL,
  `report_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `checked` tinyint(1) DEFAULT 0,
  `reason` varchar(250) NOT NULL,
  `commentID` int(11) DEFAULT NULL,
  `placeID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `reported` (`id`, `report_type`, `reported_id`, `reporter_id`, `report_date`, `checked`, `reason`, `commentID`, `placeID`) VALUES
(7, 'place', 31, 32, '2025-03-28 08:42:30', 0, 'Nem tetszik', NULL, 26),
(8, 'place', 32, 31, '2025-03-28 08:52:06', 0, 'Kamu', NULL, 27);


CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` enum('nő','férfi','nem nyilatkozom') NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `isadmin` tinyint(1) DEFAULT 0,
  `active` enum('active','disabled','deleted') NOT NULL DEFAULT 'active',
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `users` (`ID`, `first_name`, `last_name`, `gender`, `email`, `address`, `phone_number`, `password`, `isadmin`, `active`, `resetPasswordToken`, `resetPasswordExpires`) VALUES
(30, 'János Dávid', 'Fekete', 'férfi', 'janosdavidfekete@gmail.com', 'Budapest, Barcsay utca 6.', '06501379865', '$2b$10$eQMVo75rYE6CwGMMSxJ0g.LCY8sb.JJ35KqOKIM2cMucabshNuSRi', 1, 'active', NULL, NULL),
(31, 'Bence', 'Ritzl', 'férfi', 'ritzlbencelevente@ktch.hu', 'Budapest, Zugló', '06304567788', '$2b$10$ynLCNW0JE.S/lDBFNj2uXOmaqXCnGU/8Xu.j23k/OC3vPe2ZBf1iK', 0, 'active', NULL, NULL),
(32, 'Márk', 'Krizsicskó', 'férfi', 'krizsicskomark@ktch.hu', 'Érd, valamilyen utca 6.', '06304567788', '$2b$10$rRG0aiWBlxJHXnNiIy0wZ.5/Vrv2sRGRygVlyJlmZb258nYou1KJG', 0, 'active', NULL, NULL);

ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`),
  ADD KEY `placeID` (`placeID`);

ALTER TABLE `place`
  ADD PRIMARY KEY (`PlaceID`),
  ADD KEY `UserID` (`UserID`);


ALTER TABLE `rents`
  ADD PRIMARY KEY (`RentID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `PlaceID` (`PlaceID`);

ALTER TABLE `reported`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reported_id` (`reported_id`,`reporter_id`),
  ADD KEY `reporter_id` (`reporter_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

ALTER TABLE `place`
  MODIFY `PlaceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

ALTER TABLE `rents`
  MODIFY `RentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

ALTER TABLE `reported`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`placeID`) REFERENCES `place` (`PlaceID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `place`
  ADD CONSTRAINT `place_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`);

ALTER TABLE `rents`
  ADD CONSTRAINT `rents_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  ADD CONSTRAINT `rents_ibfk_2` FOREIGN KEY (`PlaceID`) REFERENCES `place` (`PlaceID`);

ALTER TABLE `reported`
  ADD CONSTRAINT `reported_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `reported_ibfk_2` FOREIGN KEY (`reported_id`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;
