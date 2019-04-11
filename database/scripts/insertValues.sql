USE database;

INSERT INTO Seller(Name, Phone)
VALUES
  ('Joe Wilson LLC', 4444444444),
  ('Judy Chen INC', 5555555555),
  ('Brianna Florio CON', 6314444444);

INSERT INTO Customer(F_Name, L_NAME, Email, Phone)
VALUES
  ('Joe', 'Wilson', 'joseph.wilson@stonybrook.edu', 44444444444),
  ('Judy', 'Chen', 'ju-hisu.chen@stonybrook.edu', 5555555555);

INSERT INTO Address(Customer_ID, City, State, Street_Address, Street_Number, Apt_Number)
VALUES
  (1, 'Rocky Point', 'NY', 'Odin', 20, 1),
  (2, 'Fairbanks, 'AK', 'Moose', 20, 1);

INSERT INTO ITEM(Name, Description)
VALUES
  ('Earphones', 'Things that go in your ear for listening to stuff'),
  ('Pineapple', 'The best thing to put on pizza'),
  ('Silky Flowers', 'Total real silk flowers');

INSERT INTO Payment(Customer_ID, Payment_Type, Card_Number, Card_Expiration)
VALUES
--For date, format is EOMONTH(MM/DD/YYYY) but day should always be 01 to start. We will calculate the end of month with EOMONTH
  (1, 'GC', 4155330033003300, EOMONTH('09/01/2021')),
  (1, 'CC', 4155100020003000, EOMONTH('11/01/2022')),
  (2, 'DC', 4155700040009000, EOMONTH('06/01/2023'));

INSERT INTO Shipment(Address_ID, Customer_ID, Carrier, Speed)
VALUES
  (1,1,'UPS', 'Standard'),
  (2,2, 'FedEx', 'Expedited');

INSERT INTO Inventory(Item_ID, Seller_ID, Quantity, Price)
VALUES 
  (1,1,10,100.00),
  (2,2,420,1.25),
  (1,2,420,1.24),
  (3,3,99, 100.00);

INSERT INTO Orders(Shipment_ID, Customer_ID, Seller_ID, Item_ID, Payment_ID, Quantity)
VALUES
  (1,1,3,3,2,10),
  (1,1,2,2,1,1),
  (2,2,3,3,3,5);

INSERT INTO Reviews(Customer_ID, Seller_ID,Item_ID,Rating,Review)
VALUES
  (2,3,3,0,'These are totally fake!'),
  (1,3,3,5,'Best flowers ever! They never die!');

INSERT INTO Cart(Customer_ID, Item_ID, Quantity, Seller_ID)
VALUES
  (1,3,10,3);

INSERT INTO Employee(Supervisor_ID, F_Name, L_Name, Role)
VALUES
  (NULL, 'Judy', 'Chen', 'CEO'),
  (1,'Joe', 'Wilson', 'Programmer');


  
 
 
 


  

  
