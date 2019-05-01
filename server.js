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
      var qry = `Select ID from Seller Where Name=${seller}`;
      query(qry,res).then(function(result){
        if(result[0]){
          var id = result[0].ID;
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
function query(qry,res){
  return new Promise( ( resolve, reject ) => {
            con.query(qry,function(err,result){
              if(err) {
                res.json({'err':err});
                reject(err);
              }
              resolve(result);
            });
        });
}
