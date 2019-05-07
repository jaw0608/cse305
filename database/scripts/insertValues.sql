USE data;

INSERT INTO Seller(Name, Phone)
VALUES
  ('Apple', 4),
  ('Fitbit', 5),
  ('Axe', 6969),
  ('Dior',6),
  ('Aveeno',7),
  ('nike',8),
  ('ocean spray',9),
  ('Walgreens',10),
  ('nintendo',11),
  ('Amazon',12),
  ('Smart water',13),
  ('Kleenex',14),
  ('Adidas',15),
  ('Lays',16),
  ('Sour Patch Kids',17),
  ('Coca Cola',18),
  ('Better Life',19),
  ('Tide',20);


INSERT INTO Customer(F_Name, L_NAME, Email, Phone)
VALUES
  ('Joe', 'Wilson', 'joseph.wilson@stonybrook.edu', 44444444444),
  ('Judy', 'Chen', 'ju-hisu.chen@stonybrook.edu', 5555555555);

INSERT INTO Item(Item_Name, Description)
VALUES
  ('Earphones', 'Things that go in your ear for listening to stuff'),
  ('Pineapple', 'The best thing to put on pizza'),
  ('Silky Flowers', 'Total real silk flowers'),
  ('iPhone','Coolest phone eva'),
  ('fitbit','FLEX ON EM'),
  ('body spray','axe out those odors'),
  ('makeup','im not making up descriptions'),
  ('lotion','lotion make skin smooth'),
  ('flip flop','gucci flip flops'),
  ('juice','not to be confused with steriods'),
  ('aloe vera gel','it helps burns'),
  ('switch','What your kid actually wanted for xmas'),
  ('echo','alexa do everything'),
  ('vitamin water', 'probably good 4 u'),
  ('wipes','get your own damn kleenex'),
  ('sneakers','MY ADIDAS'),
  ('chips','Now 90% air!'),
  ('sour patch','sour sweet gone'),
  ('coke','works good on toilets!'),
  ('cleaner','mr clean spit'),
  ('detergent','dont eat this kids');


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
  (4,1,100,999.99),
  (5,2,100,99.99),
  (6,3,100,9.99),
  (7,4,100,12.99),
  (8,5,100,5.99),
  (9,6,100,3.99),
  (10,7,100,2.99),
  (11,8,100,7.99),
  (12,9,100,299.99),
  (13,10,100,199.99),
  (14,11,100,4.99),
  (15,12,100,149.99),
  (16,13,100,2.99),
  (17,14,100,1.99),
  (18,15,100,1.99),
  (19,16,100,14.99),
  (20,17,100,9.99);

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
  (2,3,10,3);

INSERT INTO Employee(Supervisor_ID, F_Name, L_Name, Role, Email)
VALUES
  (NULL, 'Judy', 'Chen', 'CEO', 'Judy.Chen@site.com'),
  (1,'Joe', 'Wilson', 'Programmer', 'Joe.Wilson@site.com');
