var express = require("express");
var hbs = require("hbs");
const async = require("hbs/lib/async");
const { ObjectId } = require("mongodb");

var app = express();

var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://localhost:27017";
var url =
  "mongodb+srv://huy282002:Huy282002@cluster0.onjlap0.mongodb.net/?retryWrites=true&w=majority";

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// hbs.registerHelper("checkPriceGT200", (age) => {
//   return age > 20;
// });

app.get("/", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  let product = await dbo.collection("shoppeProduct").find().toArray();
  res.render("home", { product: product });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/insertProduct", async (req, res) => {
  let name = req.body.txtName;
  let price = Number(req.body.txtPrice);
  let picURL = req.body.txtPic;

  if (name === "") {
    var check = "Name or price can not be empty";
    res.render("new", { check: check });
  } else {
    let product = {
      name: name,
      price: price,
      picture: picURL,
    };
    console.log(product);
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    await dbo.collection("shoppeProduct").insertOne(product);
    res.redirect("/");
  }
});

app.get("/edit", async (req, res) => {
  let id = req.query.id;
  let objectId = ObjectId(id);
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  let prod = await dbo.collection("shoppeProduct").findOne({ _id: objectId });
  console.log(prod);

  res.render("edit", { prod: prod });
});

app.post("/update", async (req, res) => {
  let id = req.body.id;
  let objectId = ObjectId(id);
  let name = req.body.txtName;
  let price = Number(req.body.txtPrice);
  let picURL = req.body.txtPic;
  let product = {
    name: name,
    price: price,
    picture: picURL,
  };
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  console.log(res);
  await dbo
    .collection("shoppeProduct")
    .updateOne({ _id: objectId }, { $set: product });
  res.redirect("/");
});

app.post("/search", async (req, res) => {
  let name = req.body.txtSearch;
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  let product = await dbo
    .collection("shoppeProduct")
    .find({ name: new RegExp(name, "i") })
    .toArray();
  res.render("home", { product: product });
});

app.get("/delete", async (req, res) => {
  let id = req.query.id;
  let objectId = ObjectId(id);
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  let product = await dbo
    .collection("shoppeProduct")
    .deleteOne({ _id: objectId });
  res.redirect("/");
});

app.get("/sortAsc", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  let product = await dbo
    .collection("shoppeProduct")
    .find()
    .sort({ price: 1 })
    .toArray();
  res.render("home", { product: product });
});

app.get("/sortDesc", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  let product = await dbo
    .collection("shoppeProduct")
    .find()
    .sort({ price: -1 })
    .toArray();
  res.render("home", { product: product });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("server is running");
