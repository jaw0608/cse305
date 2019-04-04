USE database;

CREATE TABLE IF NOT EXISTS Seller (
  ID int AUTO_INCREMENT,
  Name varchar(30),
  Phone BIGINT
  PRIMARY KEY (ID)
);
CREATE TABLE IF NOT EXISTS Customer (
  ID int AUTO_INCREMENT,
  F_Name varchar(50),
  L_Name varchar(50),
  Email varchar(320),
  Phone BIGINT,
  PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS Address(
  Customer_ID int,
  Address_ID int AUTO_INCREMENT,
  City varchar(30),
  State char(2),
  Street_Number varchar(6),
  Apt_Number var(7),
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),
  PRIMARY KEY (Address_ID)
);

CREATE TABLE IF NOT EXISTS Payment(
  Customer_ID int,
  Payment_Type int,
  Card_Number BIGINT,
  Card_Expiration DATE,
  PRIMARY KEY (Customer_ID, Card_Number)
);
CREATE TABLE IF NOT EXISTS Payment_Types(
  ID int,
  Value char(2)
);
INSERT INTO Payment_Types VALUES(
  (1, 'CC'),
  (2, 'DC'),
  (3, 'GC')
);
CREATE TABLE IF NOT EXISTS Order(
  ID int,
  Type ch
);

CREATE TABLE IF NOT EXISTS Shipment(
  

);

