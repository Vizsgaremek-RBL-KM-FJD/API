
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
  `price` double NOT NULL,
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `place` (`PlaceID`, `UserID`, `owner_name`, `phone_number`, `address`, `place_name`, `price`, `status`) VALUES
(16, 7, 'Bencus Ritzl', '06-06-111-2223', 'Békás 12.A', 'Békás', 15000, 1),
(17, 6, 'János Fekete', '06-50-137-9865', 'Mezőkovácsháza', 'Kovácsházi terem', 8001, 1);

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
(28, 6, 17, '06-50-137-9865', 'János Fekete', '06-50-137-9865', '2025-03-30 12:00:00', '2025-03-30 15:00:00', 23400, 'not started');

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
  `active` enum('active','disabled','deleted') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`ID`, `first_name`, `last_name`, `gender`, `email`, `address`, `phone_number`, `password`, `isadmin`, `active`) VALUES
(5, 'Roxi', 'Nemes', 'nő', 'nms.roxi@gmail.com', 'Barcsay utca 6.', '06774225900', '$2b$10$tZgZ7LpcHCFIZUDTrl11yOokE3gX63QNavhB2oqi0nmXOoO05q4u.', 0, 'active'),
(6, 'János', 'Fekete', 'férfi', 'janosfekete@gmail.com', 'Barcsay utca 6.', '06-50-137-9865', '$2b$10$COE6AlHVPPSjy9cdw4kzgeqTMWKrh7VoOl07ai6qPlRvuKE2SfAuK', 1, 'active'),
(7, 'Bencuska', 'Ritzl', 'férfi', 'bence@gmail.com', 'Zuglós', '06-06-111-2223', '$2b$10$MwqKrLT/X1cKw52QaDbSn.Anvb8J1rcXJw0OFBPIPS/yPo3YyFFTy', 0, 'active');

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
  MODIFY `PlaceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `rents`
  MODIFY `RentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `place`
  ADD CONSTRAINT `place_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`);

ALTER TABLE `rents`
  ADD CONSTRAINT `rents_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  ADD CONSTRAINT `rents_ibfk_2` FOREIGN KEY (`PlaceID`) REFERENCES `place` (`PlaceID`);
COMMIT;
