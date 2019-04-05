USE database;

CREATE TABLE IF NOT EXISTS Seller (
  ID int AUTO_INCREMENT,
  Name varchar(30) NOT NULL,
  Phone BIGINT NOT NULL,
  PRIMARY KEY (ID)
);
CREATE TABLE IF NOT EXISTS Customer (
  ID int AUTO_INCREMENT,
  F_Name varchar(50) NOT NULL,
  L_Name varchar(50) NOT NULL,
  Email varchar(320) NOT NULL,
  Phone BIGINT NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS Address(
  Customer_ID int NOT NULL,
  Address_ID int AUTO_INCREMENT NOT NULL,
  City varchar(30) NOT NULL,
  State char(2) NOT NULL,
  Street_Number varchar(6) NOT NULL,
  Apt_Number char(5),
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),
  PRIMARY KEY (Address_ID)
);
CREATE TABLE IF NOT EXISTS Item (
  Number int,
  Name varchar(20) NOT NULL,
  Description varchar(500),
  PRIMARY KEY (Number)
);
CREATE TABLE IF NOT EXISTS Payment(
  Customer_ID int,
  Payment_Type char(2) NOT NULL CHECK (Payment_Type in ('GC','CC','DC')),
  Card_Number BIGINT NOT NULL,
  Card_Expiration DATE NOT NULL,
  PRIMARY KEY (Customer_ID, Card_Number)
);
CREATE TABLE IF NOT EXISTS Orders(
  Number BIGINT NOT NULL,
  Shipment_ID int NOT NULL,
  Customer_ID int NOT NULL,
  Seller_ID int NOT NULL,
  Item_ID int NOT NULL,
  Quantity int NOT NULL,
  FOREIGN KEY (Shipment_ID) REFERENCES Shipment(ID),
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),
  FOREIGN KEY (Seller_ID) REFERENCES Seller(ID),
  FOREIGN KEY (Item_ID) REFERENCES Item(ID),
  PRIMARY KEY (Number,Shipment_ID,Customer_ID,Seller_ID,Item_ID)
);
CREATE TABLE IF NOT EXISTS Inventory(
  Item_ID int NOT NULL,
  Seller_ID int NOT NULL,
  Quantity int NOT NULL,
  Price double NOT NULL,
  FOREIGN KEY (Seller_ID) REFERENCES Seller(ID),
  FOREIGN KEY (Item_ID) REFERENCES Item(ID),
  PRIMARY KEY (Item_ID, Seller_ID)
);
CREATE TABLE IF NOT EXISTS Shipment(
  ID int AUTO_INCREMENT NOT NULL,
  Address_ID int NOT NULL,
  Customer_ID int NOT NULL,
  Carrier varchar(10) NOT NULL,
  Speed varchar(9) NOT NULL CHECK (Speed in ('Expedited', 'Standard')),
  FOREIGN KEY (Address_ID) REFERENCES Address(ID),
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),
  PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS Reviews(
  Customer_ID int NOT NULL,
  Seller_ID int NOT NULL,
  Item_ID int NOT NULL,
  Rating int NOT NULL,
  CHECK (Rating>=0 AND Rating<=5),
  Review varchar(500) NOT NULL,
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),
  FOREIGN KEY (Seller_ID) REFERENCES Seller(ID),
  FOREIGN KEY (Item_ID) REFERENCES Item(ID),
  PRIMARY KEY (Customer_ID, Seller_ID, Item_ID)
);
CREATE TABLE IF NOT EXISTS Cart(
  Customer_ID int NOT NULL,
  Item_ID int NOT NULL,
  Quantity int NOT NULL,
  Seller_ID int NOT NULL,
  Price double NOT NULL,
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),
  FOREIGN KEY (Seller_ID) REFERENCES Seller(ID),
  FOREIGN KEY (Item_ID) REFERENCES Item(ID),
  PRIMARY KEY (Customer_ID, Seller_ID, Item_ID)
);
                                  
