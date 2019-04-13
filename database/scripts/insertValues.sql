USE data;

INSERT INTO Seller(Name, Phone)
VALUES
  ('Joe Wilson LLC', 4444444444),
  ('Judy Chen INC', 5555555555),
  ('Brianna Florio CON', 6314444444);

INSERT INTO Customer(F_Name, L_NAME, Email, Phone)
VALUES
  ('Joe', 'Wilson', 'joseph.wilson@stonybrook.edu', 44444444444),
  ('Judy', 'Chen', 'ju-hisu.chen@stonybrook.edu', 5555555555);

INSERT INTO Item(Item_Name, Description)
VALUES
  ('Earphones', 'Things that go in your ear for listening to stuff'),
  ('Pineapple', 'The best thing to put on pizza'),
  ('Silky Flowers', 'Total real silk flowers');


INSERT INTO Address(Customer_ID, City, State, Street_Name, Street_Number, Apt_Number)
VALUES
  (1, 'Rocky Point', 'NY', 'Odin', 20, 1),
  (2, 'Fairbanks','AK', 'Moose', 20, 1);

INSERT INTO Payment(Customer_ID, Payment_Type, Card_Number, Card_Expiration)
VALUES
  (1, 'GC', 4155330033003300, '2024-05-01'),
  (1, 'CC', 4155100020003000, '2022-01-01'),
  (2, 'DC', 4155700040009000, '2023-06-01');

INSERT INTO Shipment(Address_ID, Carrier, Speed,Ship_Date)
VALUES
  (1,'UPS', 'Standard', CURDATE()),
  (2,'FedEx', 'Expedited',CURDATE());

INSERT INTO Inventory(Item_ID, Seller_ID, Quantity, Price)
VALUES
  (1,1,10,100.00),
  (2,2,420,1.25),
  (1,2,420,1.24),
  (3,3,99, 100.00);

INSERT INTO Orders(Shipment_ID, Customer_ID, Seller_ID, Item_ID, Payment_ID, Quantity)
VALUES
  (1,1,3,3,2,10),
  (2,2,3,3,3,5);

INSERT INTO Reviews(Customer_ID, Seller_ID,Item_ID,Rating,Review)
VALUES
  (2,3,3,0,'These are totally fake!'),
  (1,3,3,5,'Best flowers ever! They never die!');

INSERT INTO Cart(Customer_ID, Item_ID, Quantity, Seller_ID)
VALUES
  (1,3,10,3);

INSERT INTO Employee(Supervisor_ID, F_Name, L_Name, Role, Email)
VALUES
  (NULL, 'Judy', 'Chen', 'CEO', 'Judy.Chen@site.com'),
  (1,'Joe', 'Wilson', 'Programmer', 'Joe.Wilson@site.com');
