const express = require('express');
var mysql = require('mysql');
var path = require('path');
var pass = "testing123"
const port = 3005;

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


app.use(express.static(path.join(__dirname, '')));
app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
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
  var year = req.body.Card_Year;
  var month = req.body.Card_Month;
  if(month<10) month = `0${month}`
  // var int_d = new Date(cardYear, cardMonth+1,1);
  // var cardExpiration = new Date(int_d - 1);
  getCustomerID(email,res).then(function(result){
    var id = result;
    var qry = `Select ID from Payment where Customer_ID=${id} and Payment_Type=${type} and Card_Number=${cardNum}`
    query(qry,res).then(function(result){
    if(result[0])
        res.json({"success":1,"id":result[0].ID});
    else {
      qry = `INSERT INTO Payment(Customer_ID,Payment_Type,Card_Number,Card_Expiration)
      VALUES (${id},${type},${cardNum},'${year}-${month}-01')`;
      console.log(qry);
      query(qry,res).then(function(result){
        res.json({"success":1,"id":result.insertId});
      });
    }
  });
});
});

app.post("/add_address",function(req,res){
  var email = toSQLString(req.body.Email);
  var city = toSQLString(req.body.City);
  var state = toSQLString(req.body.State);
  var street_name = toSQLString(req.body.Street_Name);
  var street_num = parseInt(req.body.Street_Number,10);
  var apt_number = 0;
  if(req.body.Apt_Number) apt_number = parseInt(req.body.Apt_Number,10);
  getCustomerID(email,res).then(function(result){
    var id =result;
    var qry = `Select ID from Address where Customer_ID=${result} and City=${city} and State=${state} and
    Street_Name = ${street_name} and Street_Number = ${street_num} and Apt_Number = ${apt_number}`
    query(qry,res).then(function(result){
      if(result[0])
        res.json({"success":1,"id":result[0].ID});
      else {
        qry = `Insert Into Address(Customer_ID,City,State,Street_Name,Street_Number,Apt_Number)
        VALUES (${id},${city},${state},${street_name},${street_num},${apt_number})`;
        console.log(qry);
        query(qry,res).then(function(result){
          res.json({"success":1,"id":result.insertId});
        });
      }
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

app.post("/get_payment_methods",function(req,res){
  var email = toSQLString(req.body.Email);
  getCustomerID(email,res).then(function(result){
    var qry = `SELECT * from User_Payment_Methods where Customer_ID = ${result}`;
    query(qry,res).then(function(result){
      res.json(result);
    });
  });
});

app.post("/get_addresses",function(req,res){
  var email = toSQLString(req.body.Email);
  getCustomerID(email,res).then(function(result){
    var qry = `SELECT * from User_Address where Customer_ID = ${result}`;
    query(qry,res).then(function(result){
      res.json(result);
    });
  });
});

app.post("/get_cart",function(req,res){
  var customer_email = toSQLString(req.body.Email);
  getCustomerID(customer_email,res).then(function(c_id){
    var qry = `Select * from User_Carts where Customer_ID=${c_id}`;
    query(qry,res).then(function(results){
      res.json(results);
    });
  });
});
app.post("/remove_from_cart",function(req,res){
  var seller = toSQLString(req.body.Seller);
  var email = toSQLString(req.body.Email);
  var i_id = req.body.Item_ID;
  var quantity = req.body.Quantity;
  getSellerID(seller,res).then(function(s_id){
    getCustomerID(email,res).then(function(c_id){
      var qry = `Select * from Cart where Item_ID = ${i_id} and Customer_ID = ${c_id} and Seller_ID = ${s_id}`;
      query(qry,res).then(function(result){
        if(result[0]){
          quantity = result[0].Quantity-quantity;
          if(quantity>0){ //is not removing
            qry =   `Update Cart Set Quantity = ${quantity} where Item_ID = ${i_id} and Customer_ID = ${c_id} and Seller_ID = ${s_id}`
          }
          else {
            qry = `Delete from Cart  where Item_ID = ${i_id} and Customer_ID = ${c_id} and Seller_ID = ${s_id}`;
          }
          query(qry,res).then(function(result){
            res.json({"success":1});
          });
        }
      });
    });
  });
});

app.post("/place_order",function(req,res){
  var a_id = req.body.Address_ID;
  var p_id = req.body.Payment_ID;
  var email = toSQLString(req.body.Email);
  var carrier = toSQLString(req.body.Carrier);
  var date = new Date();
  var speed = toSQLString(req.body.Speed);
  getCustomerID(email).then(function(c_id){
    var qry = `Insert Into Shipment(Address_ID,Carrier,Ship_Date,Speed)
    VALUES(${a_id},${carrier},${con.escape(date)},${speed})`
    query(qry,res).then(function(result){
      var ship_id = result.insertId;
      qry = `Select * from User_Carts where Customer_ID=${c_id}`;
      query(qry,res).then(function(results){
        for(i=0; i<results.length; i++){
          var s_id = results[i].Seller_ID;
          var i_id = results[i].Item_ID;
          var price = results[i].Price;
          var quantity = results[i].Quantity;
          order_item(res,c_id,s_id,i_id,quantity).then(function(result){
            qry = `INSERT INTO Orders(Shipment_ID,Customer_ID,Seller_ID,Item_ID,Quantity,Item_Price,Payment_ID)
            VALUES(${ship_id},${c_id},${s_id},${i_id},${quantity},${price},${p_id})`;
            query(qry,res);
          });
        }
        res.json({"success":1});
      });
    });
  });
});

app.post("/add_review",function(req,res){
  var email = toSQLString(req.body.Email);
  var seller = toSQLString(req.body.Seller);
  var item_id = req.body.Item_ID;
  var review = toSQLString(req.body.Review);
  var rating = req.body.Rating;
  getCustomerID(email,res).then(function(c_id){
    getSellerID(seller,res).then(function(s_id){
      var qry=`INSERT INTO Reviews (Customer_ID,Seller_ID,Item_ID,Rating,Review)
      VALUES (${c_id},${s_id},${item_id},${rating},${review})`;
      query(qry,res).then(function(result){
        res.json({"success":1});
      });
    });
  });
});

app.post("/get_reviews",function(req,res){
  var i_id = req.body.Item_ID;
  var seller = toSQLString(req.body.Seller);
  getSellerID(seller,res).then(function(s_id){
    var qry = `Select * from User_Reviews where Seller_ID = ${s_id} and Item_ID = ${i_id}`
    query(qry,res).then(function(result){
      res.json(result);
    });
  });
});

app.post("/get_sellers",function(req,res){
  query("Select * from Seller",res).then(function(results){
    res.json(results);
  });
});

app.post("/get_inventory",function(req,res){
  query("Select * from Inventory",res).then(function(results){
    res.json(results);
  });
});

app.post("/popular_items",function(req,res){
  query("Select * from Popular",res).then(function(result){
    res.json(result);
  });
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
                reject(0);
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
  qry = qry.replace(/\n|\r/g, "");
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
function remove_from_cart(res,c_id,s_id,i_id,quantity){
  return new Promise((resolve,reject)=>{
    var qry = `Select * from Cart where Item_ID = ${i_id} and Customer_ID = ${c_id} and Seller_ID = ${s_id}`;
    query(qry,res).then(function(result){
      if(result[0]){
        quantity = result[0].Quantity-quantity;
        if(quantity>0){ //is not removing
          qry =   `Update Cart Set Quantity = ${quantity} where Item_ID = ${i_id} and Customer_ID = ${c_id} and Seller_ID = ${s_id}`
        }
        else {
          qry = `Delete from Cart  where Item_ID = ${i_id} and Customer_ID = ${c_id} and Seller_ID = ${s_id}`;
        }
        query(qry,res).then(function(result){
          resolve(1);
        },function(err){reject(err)});
      }
    },function(err){reject(err);});
  });
}
function order_item(res,c_id,s_id,i_id,quantity){
  return new Promise((resolve,reject)=>{
    var qry = `Select Quantity from Inventory where Item_ID = ${i_id} and Seller_ID=${s_id}`;
    query(qry,res).then(function(result){
      if(result[0] && result[0].Quantity>=quantity){
        qry = `Update Inventory Set Quantity = ${result[0].Quantity-quantity} Where Item_ID = ${i_id} and Seller_ID=${s_id}`;
        query(qry,res).then(function(result){
          remove_from_cart(res,c_id,s_id,i_id,quantity).then(function(result){
            resolve(1);
          },function(err){reject(err);});
        },function(err){reject(err);});
      }
      else {
        reject(-1);
      }
    });
  });
}
