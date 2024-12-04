-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 04. 10:13
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
-- Tábla szerkezet ehhez a táblához `place`
--

CREATE TABLE `place` (
  `PlaceID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `owner_name` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `place_name` varchar(100) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `place`
--

INSERT INTO `place` (`PlaceID`, `UserID`, `owner_name`, `phone_number`, `address`, `place_name`, `price`) VALUES
(1, 2, 'János Fekete', '06501379865', 'Révay utca 17', 'Külker suli tornaterem', 10000);

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
  `TotalAmount` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `rents`
--

INSERT INTO `rents` (`RentID`, `UserID`, `PlaceID`, `OwnerPhoneNumber`, `UserName`, `UserPhoneNumber`, `StartDate`, `EndDate`, `TotalAmount`) VALUES
(1, 3, 1, '06501379865', 'Márk Krizsicskó', '0630302244', '2024-12-05 08:00:00', '2024-12-05 10:00:00', 20000);

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
  `phone_number` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `first_name`, `last_name`, `gender`, `email`, `address`, `phone_number`) VALUES
(2, 'János', 'Fekete', 'férfi', 'feketejanosdavid@ktch.hu', 'Barcsay utca 6.', '06501379865'),
(3, 'Márk', 'Krizsicskó', 'férfi', 'krizsicskomark@ktch.hu', 'Érd, sárd utca 21', '0630302244');

--
-- Indexek a kiírt táblákhoz
--

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
-- AUTO_INCREMENT a táblához `place`
--
ALTER TABLE `place`
  MODIFY `PlaceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `rents`
--
ALTER TABLE `rents`
  MODIFY `RentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Megkötések a kiírt táblákhoz
--

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
