const express = require('express');
var mysql = require('mysql');
var pass = "testing123"
const port =3005;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: pass
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database");
});
con.query("USE data",function(err,result){
  if(err) throw err;
  console.log("Using database 'data'");
});


const app = express(); //init
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
//customer. returns new id to client
app.get("/",function(req,res){
  res.send("HELLO");
});

app.post("/create_customer",function(req,res){
  var fname = toSQLString(req.body.F_Name);
  var lname = toSQLString(req.body.L_Name);
  var email = toSQLString(req.body.Email);
  var phone = req.body.Phone;
  var pass = toSQLString(req.body.Password);
  var id = 0;
  var qry = `INSERT INTO Customer(F_Name,L_Name,Email,Phone) VALUES (${fname}, ${lname}, ${email}, ${phone})`
  query(qry,res).then(function(result){
    id = result.insertId;
    qry = `INSERT INTO CLogin(Email,Password) VALUES (${email},${pass})`
    query(qry,res).then(function(result){
      res.json({'id':id});
    });
  });
});


app.post("/create_seller",function(req,res){
  var name = toSQLString(req.body.Name);
  var phone = req.body.Phone;
  var pass = toSQLString(req.body.Password);
  var id;
  var qry = `INSERT INTO Seller(Name,Phone) VALUES (${name}, ${phone})`;
  query(qry,res).then(function(result){
    id = result.insertId;
    qry = `INSERT INTO SLogin(Name,Password) VALUES (${name}, ${pass})`
    query(qry,res).then(function(result){
      res.json({'id':id});
    });
  });
});

app.post("/login_seller",function(req,res){
  var name = toSQLString(req.body.Name);
  var pass = req.body.Password;
  var qry = `SELECT Password FROM SLogin WHERE Name=${name}`;
  query(qry,res).then(function(result){
    if(!result[0]) res.json({'err':"INVALID_USER"});
    else if(result[0].Password==pass){//success!
      res.json({'sucess':1});
    }
    else {
      res.json({'err':"PASS_WRONG"});
    }
  });
});

app.post("/login_customer",function(req,res){
  var email = toSQLString(req.body.Email);
  var pass = req.body.Password;
  var qry = `SELECT Password FROM CLogin WHERE Email=${email}`;
  query(qry,res).then(function(result){
    if(!result[0]) {
      res.json({'err':"INVALID_USER"});
    }
    else if(result[0].Password==pass){//success!
      res.json({'sucess':1});
    }
    else {
      res.json({'err':"PASS_WRONG"});
    }
  });
});


//Need to reimplement these below.
app.post("/create_item",function(req,res){
  var item_name = toSQLString(req.body.Name);
  var description = toSQLString(req.body.Description);
  var seller = toSQLString(req.body.Seller);
  var price = req.body.Price;
  var quantity = req.body.Quantity;
  var id;
  getSellerID(seller,res).then(function(result){
    var sellerID = result;
    var qry = `Select ID from Item Where Item_Name = ${item_name} and Description=${description}`;
    var qry2;
    query(qry,res).then(function(result){
      if(result[0]){
        id = result[0].ID;
        qry2 = `INSERT INTO Inventory(Item_ID,Seller_ID,Quantity,Price) VALUES (${id},${sellerID},${quantity},${price})`
        query(qry2,res).then(function(result){
          res.json({"success":1});
        });
      }
      else {
        qry = `INSERT INTO Item(Item_Name,Description) VALUES (${item_name},${description})`;
        query(qry,res).then(function(result){
          id = result.insertId;
          qry2 = `INSERT INTO Inventory(Item_ID,Seller_ID,Quantity,Price) VALUES (${id},${sellerID},${quantity},${price})`;
          query(qry2,res).then(function(result){
            res.json({"success":1});
          });
        });
      }
    });
  });
});


app.post("/get_items_by_seller",function(req,res){
    var seller = toSQLString(req.body.Seller);
    getSellerID(seller,res).then(function(result){
        if(result){
          var id = result;
          qry = `Select * from Inventory INNER JOIN Item ON Item_ID = Item.ID Where Seller_ID = ${id}`;
          query(qry,res).then(function(result){

            res.json({"items":result});
          });
        }
        else {
          res.json({"err":"INVALID_USER"});
        }
      });
});

app.post("/add_payment_method",function(req,res){
  var email = toSQLString(req.body.Email);
  var type = toSQLString(req.body.Payment_Type);
  var cardNum = req.body.Card_Number;
  var cardYear = req.body.Card_Year;
  var cardMonth = req.body.Card_Month;
  var int_d = new Date(cardYear, cardMonth+1,1);
  var cardExpiration = new Date(int_d - 1);
  getCustomerID(email,res).then(function(result){
    var id = result;
    var qry = `INSERT INTO Payment(Customer_ID,Payment_Type,Card_Number,Card_Expiration) VALUES (${id},${type},${cardNum},${con.escape(cardExpiration)})`;
    query(qry,res).then(function(result){
      res.json({"success":1});
    });
  });
});

app.post("/add_address",function(req,res){
  var email = toSQLString(req.body.Email);
  var city = toSQLString(req.body.City);
  var state = toSQLString(req.body.State);
  var street_name = toSQLString(req.body.Street_Name);
  var street_num = req.body.Street_Number;
  var apt_number = 0;
  if(req.body.Apt_Number) apt_number = req.body.Apt_Number;
  getCustomerID(email,res).then(function(result){
    var qry = `Insert Into Address(Customer_ID,City,State,Street_Name,Street_Number,Apt_Number)
    VALUES (${result},${city},${state},${street_name},${street_num},${apt_number})`;
    query(qry,res).then(function(result){
      res.json({"success":1});
    });
  });
});

app.post("/add_to_cart",function(req,res){
  var seller = toSQLString(req.body.Seller);
  var customer = toSQLString(req.body.Email);
  var i_id = req.body.Item_ID;
  var quantity = req.body.Quantity;
  getSellerID(seller,res).then(function(s_id){
    getCustomerID(customer,res).then(function(c_id){
      var qry = `Select * from Cart where Item_ID = ${i_id} and Customer_ID = ${c_id} and Seller_ID = ${s_id}`
      query(qry,res).then(function(result){
        if(result[0]){
          quantity +=result[0].Quantity;
          qry = `Update Cart Set Quantity = ${quantity} where Item_ID = ${i_id} and Customer_ID = ${c_id} and Seller_ID = ${s_id}`
        }
        else {
          qry = `Insert Into Cart(Customer_ID,Item_ID,Seller_ID,Quantity)
          VALUES (${c_id},${i_id},${s_id},${quantity})`;
        }
        query(qry,res).then(function(result){
          res.json({"success":1});
        });
      });
    });
  })
});





function toSQLString(variable){
  return `'${variable}'`;
}

function getSellerID(name,res){
  var qry = `SELECT ID from Seller Where Name = ${name}`;
  return new Promise( ( resolve, reject ) => {
            con.query(qry,function(err,result){
              if(err) {
                res.json({'err':err});
                reject(err);
              }
              if(result[0])
                resolve(result[0].ID);
              else {
                res.json({'err':"INVALID_USER"});
                reject(-1);
              }
            });
        });
}
function getCustomerID(email,res){
  var qry = `SELECT ID from Customer Where Email = ${email}`;
  return new Promise( ( resolve, reject ) => {
            con.query(qry,function(err,result){
              if(err) {
                res.json({'err':err});
                reject(err);
              }
              if(result[0])
                resolve(result[0].ID);
              else {
                res.json({'err':"INVALID_USER"});
                reject(-1);
              }
            });
        });
}
function query(qry,res){
  return new Promise( ( resolve, reject ) => {
            con.query(qry,function(err,result){
              if(err) {
                console.log(res);
                res.json({'err':err});
                reject(err);
              }
              resolve(result);
            });
        });
}