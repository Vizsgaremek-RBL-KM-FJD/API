

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

INSERT INTO `comments` (`id`, `placeID`, `userID`, `username`, `text`, `created_at`) VALUES
(1, 16, 6, 'János', 'szar volt', '2025-03-10 07:47:30'),
(2, 16, 7, 'Bencuska', 'Nem az!', '2025-03-10 07:50:36');

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
(16, 7, 'Bencus Ritzl', '06-06-111-2223', 'Békás hegyi utca', 'Békás', 15000, 1, '/uploads/1742373472705-terem2.jpg'),
(17, 6, 'János Fekete', '06-50-137-9865', 'Mezőkovácsháza', 'Kovácsházi terem', 8000, 1, '/uploads/1742373341912-terem.jpeg');

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
(29, 6, 16, '06-06-111-2223', 'János Fekete', '06-50-137-9865', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 30000, 'not started');

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
(6, 'János', 'Fekete Dávid', 'férfi', 'janosfekete@gmail.com', 'Barcsay utca 6.', '06-50-137-9865', '$2b$10$COE6AlHVPPSjy9cdw4kzgeqTMWKrh7VoOl07ai6qPlRvuKE2SfAuK', 1, 'active'),
(7, 'Bencuska', 'Ritzl', 'férfi', 'bence@gmail.com', 'Zuglós', '06-06-111-2223', '$2b$10$MwqKrLT/X1cKw52QaDbSn.Anvb8J1rcXJw0OFBPIPS/yPo3YyFFTy', 0, 'active'),
(9, 'István', 'Erős', 'nem nyilatkozom', 'erosistvan78@gmail.com', 'Szeged ', '06303445679', '$2b$10$RsVwgNGgcKDkaLuAk0iYD.mVkfWmX1UtZ6YwJd1YAGd84amWNFscW', 0, 'active'),
(10, 'János', 'Nagy', 'férfi', 'nagyjanos@gmail.com', 'Szolnok', '06205679986', '$2b$10$R.2OH61QnUAgBA4fwzSv7evxiQYIgXD3uNUsCzcd6PiAXNqTEwrqK', 0, 'active'),
(15, 'Márk', 'Krizsicskó', 'férfi', 'krizsicskomark@gmail.com', 'Érd', '06305674456', '$2b$10$xpEJZEjoYzcyBZh7trZA4uyRuliOLTAW0YuE.5quJypA3jZsQ9O0C', 0, 'active'),
(16, 'Elek', 'Teszt', 'nem nyilatkozom', 'tesztelek@gmail.com', 'Tesz-vesz város', '34', '$2b$10$WmoM4GkHqhk4xNNvJpUky.F8xcw5uIUKB1vXTArO4GEF8FrGnvxji', 0, 'active');

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

ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `place`
  MODIFY `PlaceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

ALTER TABLE `rents`
  MODIFY `RentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`placeID`) REFERENCES `place` (`PlaceID`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `place`
  ADD CONSTRAINT `place_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`);

ALTER TABLE `rents`
  ADD CONSTRAINT `rents_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  ADD CONSTRAINT `rents_ibfk_2` FOREIGN KEY (`PlaceID`) REFERENCES `place` (`PlaceID`);
COMMIT;

