-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SET time_zone = "+00:00";

CREATE TABLE `Marketing_Campaign` (
  `ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `Year_Birth` year(4) NOT NULL,
  `Education` varchar(20) NOT NULL,
  `Marital_Status` varchar(20) NOT NULL,
  `Income` int(20),
  `Kidhome` int (11) NOT NULL,
  `Teenhome` int(11) NOT NULL,
  `Dt_Customer` date NOT NULL,
  `Recency` int (11) NOT NULL,
  `MntWines` int (11) NOT NULL, 
  `MntFruits` int (11) NOT NULL,
  `MntMeatProducts` int (11) NOT NULL,
  `MntFishProducts` int (11) NOT NULL,
  `MntSweetProducts` int (11) NOT NULL,
  `MntGoldProds` int (11) NOT NULL, 
  `NumDealsPurchases` int (11) NOT NULL,
  `NumWebPurchases` int (11) NOT NULL,
  `NumCatalogPurchases` int (11) NOT NULL,
  `NumStorePurchases` int (11) NOT NULL, 
  `NumWebVisitsMonth` int (11) NOT NULL,
  `AcceptedCmp3` int (2) NOT NULL, 
  `AcceptedCmp4` int (2) NOT NULL, 
  `AcceptedCmp5` int (2) NOT NULL,
  `AcceptedCmp1` int (2) NOT NULL,
  `AcceptedCmp2` int (2) NOT NULL,
  `Complain` int (2) NOT NULL,
  `Response` int (2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
