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

INSERT INTO Item(Item_Name, Description,Url)
VALUES
  ('iPhone','Coolest phone eva','images/iphone.jpg'),
  ('fitbit','FLEX ON EM','images/fitbit.jpg'),
  ('body spray','axe out those odors','images/axe.jpg'),
  ('makeup','im not making up descriptions','images/beauty.jpg'),
  ('lotion','lotion make skin smooth','images/bliss.jpg'),
  ('flip flop','gucci flip flops','images/flipflop.jpg'),
  ('juice','not to be confused with steriods','images/juice.jpg'),
  ('aloe vera gel','it helps burns','images/skinCare.jpg'),
  ('switch','What your kid actually wanted for xmas','images/switch.jpg'),
  ('echo','alexa do everything','images/tech.jpg'),
  ('vitamin water', 'probably good 4 u','images/vitamin_water.jpg'),
  ('wipes','get your own damn kleenex','images/wipes.jpg'),
  ('sneakers','MY ADIDAS','images/shoes.jpg'),
  ('chips','Now 90% air!','images/chips.jpg'),
  ('sour patch','sour sweet gone','images/sourPatch.jpg'),
  ('coke','works good on toilets!','images/coke.jpg'),
  ('cleaner','mr clean spit','images/cleaner.jpg'),
  ('detergent','dont eat this kids','images/tide.jpg');


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
  (1,1,100,999.99),
  (2,2,100,99.99),
  (3,3,100,9.99),
  (4,4,100,12.99),
  (5,5,100,5.99),
  (6,6,100,3.99),
  (7,7,100,2.99),
  (8,8,100,7.99),
  (9,9,100,299.99),
  (10,10,100,199.99),
  (11,11,100,4.99),
  (12,12,100,149.99),
  (13,13,100,2.99),
  (14,14,100,1.99),
  (15,15,100,1.99),
  (16,16,100,14.99),
  (17,17,100,9.99);

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
INSERT INTO CLogin(Email,Password)
VALUES
	('joseph.wilson@stonybrook.edu','testing123');
