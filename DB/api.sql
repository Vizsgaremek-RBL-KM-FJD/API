-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 10. 08:47
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `api`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `placeID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `text` varchar(250) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `comments`
--

INSERT INTO `comments` (`id`, `placeID`, `userID`, `username`, `text`, `created_at`) VALUES
(1, 16, 6, 'János', 'szar volt', '2025-03-10 07:47:30');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `place`
--

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

--
-- A tábla adatainak kiíratása `place`
--

INSERT INTO `place` (`PlaceID`, `UserID`, `owner_name`, `phone_number`, `address`, `place_name`, `price`, `status`, `image_path`) VALUES
(16, 7, 'Bencus Ritzl', '06-06-111-2223', 'Békás 12.A', 'Békás', 15000, 1, NULL),
(17, 6, 'János Fekete', '06-50-137-9865', 'Mezőkovácsháza', 'Kovácsházi terem', 8001, 1, '/uploads/1741592640187-terem.jpeg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rents`
--

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

--
-- A tábla adatainak kiíratása `rents`
--

INSERT INTO `rents` (`RentID`, `UserID`, `PlaceID`, `OwnerPhoneNumber`, `UserName`, `UserPhoneNumber`, `StartDate`, `EndDate`, `TotalAmount`, `status`) VALUES
(28, 6, 17, '06-50-137-9865', 'János Fekete', '06-50-137-9865', '2025-03-30 12:00:00', '2025-03-30 15:00:00', 23400, 'not started');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

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

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `first_name`, `last_name`, `gender`, `email`, `address`, `phone_number`, `password`, `isadmin`, `active`) VALUES
(5, 'Roxi', 'Nemes', 'nő', 'nms.roxi@gmail.com', 'Barcsay utca 6.', '06774225900', '$2b$10$tZgZ7LpcHCFIZUDTrl11yOokE3gX63QNavhB2oqi0nmXOoO05q4u.', 0, 'active'),
(6, 'János', 'Fekete', 'férfi', 'janosfekete@gmail.com', 'Barcsay utca 6.', '06-50-137-9865', '$2b$10$COE6AlHVPPSjy9cdw4kzgeqTMWKrh7VoOl07ai6qPlRvuKE2SfAuK', 1, 'active'),
(7, 'Bencuska', 'Ritzl', 'férfi', 'bence@gmail.com', 'Zuglós', '06-06-111-2223', '$2b$10$MwqKrLT/X1cKw52QaDbSn.Anvb8J1rcXJw0OFBPIPS/yPo3YyFFTy', 0, 'active');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`),
  ADD KEY `placeID` (`placeID`);

--
-- A tábla indexei `place`
--
ALTER TABLE `place`
  ADD PRIMARY KEY (`PlaceID`),
  ADD KEY `UserID` (`UserID`);

--
-- A tábla indexei `rents`
--
ALTER TABLE `rents`
  ADD PRIMARY KEY (`RentID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `PlaceID` (`PlaceID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `place`
--
ALTER TABLE `place`
  MODIFY `PlaceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT a táblához `rents`
--
ALTER TABLE `rents`
  MODIFY `RentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`placeID`) REFERENCES `place` (`PlaceID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `place`
--
ALTER TABLE `place`
  ADD CONSTRAINT `place_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`);

--
-- Megkötések a táblához `rents`
--
ALTER TABLE `rents`
  ADD CONSTRAINT `rents_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  ADD CONSTRAINT `rents_ibfk_2` FOREIGN KEY (`PlaceID`) REFERENCES `place` (`PlaceID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
