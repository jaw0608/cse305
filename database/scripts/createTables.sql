USE data;

CREATE TABLE IF NOT EXISTS Seller (
  ID int AUTO_INCREMENT,
  Name varchar(30) UNIQUE NOT NULL,
  Phone BIGINT NOT NULL,
  PRIMARY KEY (ID)
);
CREATE TABLE IF NOT EXISTS Customer (
  ID int AUTO_INCREMENT,
  F_Name varchar(50) NOT NULL,
  L_Name varchar(50) NOT NULL,
  Email varchar(320) UNIQUE NOT NULL,
  Phone BIGINT NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS Address(
  ID int AUTO_INCREMENT NOT NULL,
  Customer_ID int NOT NULL,
  City varchar(30) NOT NULL,
  State char(2) NOT NULL,
  Street_Name varchar(20) NOT NULL,
  Street_Number int NOT NULL,
  Apt_Number int,
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),
  PRIMARY KEY (ID),
  UNIQUE(Customer_ID,City,State,Street_Name,Street_Number,Apt_Number)
);
CREATE TABLE IF NOT EXISTS Item (
  ID int AUTO_INCREMENT NOT NULL,
  Item_Name varchar(20) NOT NULL,
  Description varchar(500),
  PRIMARY KEY (ID),
  Unique(Item_Name, Description)
);
CREATE TABLE IF NOT EXISTS Payment(
  Customer_ID int NOT NULL,
  ID int AUTO_INCREMENT NOT NULL,
  Payment_Type char(2) NOT NULL CHECK (Payment_Type in ('GC','CC','DC')),
  Card_Number BIGINT NOT NULL,
  Card_Expiration DATE NOT NULL,
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),                                                      
  PRIMARY KEY (ID),
  Unique(Customer_ID, Card_Number)                                                    
);

CREATE TABLE IF NOT EXISTS Shipment(
  ID int AUTO_INCREMENT NOT NULL,
  Address_ID int NOT NULL,
  Carrier varchar(10) NOT NULL,
  Ship_Date DATE NOT NULL,
  Speed varchar(9) NOT NULL CHECK (Speed in ('Expedited', 'Standard')),
  FOREIGN KEY (Address_ID) REFERENCES Address(ID),
  PRIMARY KEY (ID)                                           
);

CREATE TABLE IF NOT EXISTS Orders(
  Shipment_ID int NOT NULL,
  Customer_ID int NOT NULL,
  Seller_ID int NOT NULL,
  Item_ID int NOT NULL,
  Payment_ID int NOT NULL,
  Quantity int NOT NULL,
  Item_Price double NOT NULL,
  FOREIGN KEY (Shipment_ID) REFERENCES Shipment(ID),
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),
  FOREIGN KEY (Seller_ID) REFERENCES Seller(ID),
  FOREIGN KEY (Item_ID) REFERENCES Item(ID),
  FOREIGN KEY (Payment_ID) REFERENCES Payment(ID),
  PRIMARY KEY (Shipment_ID,Item_ID,Seller_ID)
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
  FOREIGN KEY (Customer_ID) REFERENCES Customer(ID),
  FOREIGN KEY (Seller_ID) REFERENCES Seller(ID),
  FOREIGN KEY (Item_ID) REFERENCES Item(ID),
  PRIMARY KEY (Customer_ID, Seller_ID, Item_ID)
);
CREATE TABLE IF NOT EXISTS Employee(
  ID int AUTO_INCREMENT NOT NULL,
  Supervisor_ID int,
  F_Name varchar(20) NOT NULL,
  L_NAME varchar(20) NOT NULL,
  Email varchar(320) UNIQUE NOT NULL,
  Role varchar(40) NOT NULL,
  FOREIGN KEY (Supervisor_ID) REFERENCES Employee(ID),
  PRIMARY KEY (ID)
);
CREATE TABLE IF NOT EXISTS CLogin(
  Email varchar(320) PRIMARY KEY,
  Password varchar(20) NOT NULL,
  FOREIGN KEY(Email) REFERENCES Customer(Email)                                              
);
CREATE TABLE IF NOT EXISTS SLogin(
  Name varchar(30) PRIMARY KEY ,
  Password varchar(20) NOT NULL,
  FOREIGN KEY(Name) REFERENCES Seller(Name)                                             
);
