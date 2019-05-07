Use data;

CREATE VIEW User_Carts AS
SELECT Customer_ID,Cart.Seller_ID,Cart.Item_ID,Item_Name,Description,Price,Cart.Quantity,URL
FROM Cart,Item,Inventory
WHERE Cart.Item_ID = Item.ID AND Inventory.Item_ID = Item.ID AND Inventory.Seller_ID = Cart.Seller_ID;

CREATE VIEW User_Address AS
SELECT CUSTOMER_ID, Address.ID, City,State,Street_Name,Street_Number,Apt_Number
FROM Customer,Address
WHERE Customer.ID = Address.Customer_ID;

CREATE VIEW User_Payment_Methods AS
SELECT Customer_ID, Payment.ID, Card_Number,Card_Expiration
FROM Customer,Payment
WHERE Customer_ID = Customer.ID;

CREATE VIEW User_Reviews AS
SELECT Customer.F_Name, Customer.L_Name, Review, Rating,Seller_ID,Item_ID
FROM Customer,Reviews
WHERE Customer_ID = Customer.ID;

CREATE VIEW Popular AS
SELECT Item.Item_Name, Item.Description, Item.ID, SUM(Quantity) AS Quantity_Sold
FROM Item, Orders
WHERE Item.ID = Item_ID
GROUP BY Item_ID,Item.Description,Item.ID
ORDER BY Quantity_Sold;

CREATE VIEW INV AS
SELECT Item.Item_Name, Item.Description, Seller.Name, Inventory.Price, Inventory.Quantity
FROM Item,Inventory,Seller
WHERE Item.ID=Inventory.Item_ID and Seller.ID = Inventory.Seller_ID
