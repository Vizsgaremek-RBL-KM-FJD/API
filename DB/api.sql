SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `place` (
  `PlaceID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `owner_name` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `place_name` varchar(100) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `place` (`PlaceID`, `UserID`, `owner_name`, `phone_number`, `address`, `place_name`, `price`) VALUES
(4, 5, 'Roxána Nemes', '06774225900', 'Budapest, Barcsay utca', 'Cigány verő terem', 10);

CREATE TABLE `rents` (
  `RentID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `PlaceID` int(11) NOT NULL,
  `OwnerPhoneNumber` varchar(15) DEFAULT NULL,
  `UserName` varchar(100) DEFAULT NULL,
  `UserPhoneNumber` varchar(15) DEFAULT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `TotalAmount` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` enum('nő','férfi','nem nyilatkozom') NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` boolean DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`ID`, `first_name`, `last_name`, `gender`, `email`, `address`, `phone_number`, `password`) VALUES
(5, 'Roxána', 'Nemes', 'nő', 'nms.roxi@gmail.com', 'Barcsay utca 6.', '06774225900', '$2b$10$tZgZ7LpcHCFIZUDTrl11yOokE3gX63QNavhB2oqi0nmXOoO05q4u.'),
(6, 'János', 'Fekete', 'férfi', 'janosfekete@gmail.com', 'Barcsay utca 6.', '06-50-137-9865', '$2b$10$COE6AlHVPPSjy9cdw4kzgeqTMWKrh7VoOl07ai6qPlRvuKE2SfAuK');

ALTER TABLE `place`
  ADD PRIMARY KEY (`PlaceID`),
  ADD KEY `UserID` (`UserID`);

ALTER TABLE `rents`
  ADD PRIMARY KEY (`RentID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `PlaceID` (`PlaceID`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `place`
  MODIFY `PlaceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `rents`
  MODIFY `RentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `place`
  ADD CONSTRAINT `place_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`);

ALTER TABLE `rents`
  ADD CONSTRAINT `rents_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  ADD CONSTRAINT `rents_ibfk_2` FOREIGN KEY (`PlaceID`) REFERENCES `place` (`PlaceID`);

