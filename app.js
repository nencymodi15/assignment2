//Adding the dependincy
var express = require("express");
var path = require("path");
var app = express();
const fs = require("fs");
const exphbs = require("express-handlebars");
app.use(express.urlencoded({ extended: true }));
const datapath = "SuperSales.json";
//setting the port
const port = process.env.port || 3000;
//setting the static path for styling and images
app.use(express.static(path.join(__dirname, "public")));
//seting th etamplate engine
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

const Handlebars = require("handlebars");

Handlebars.registerHelper("notEqual", function (a, b, options) {
  if (a !== b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("highlightRow", function (rating) {
  return rating === 0 ? "highlight" : "";
});

//seting index file in the http://localhost:3000
app.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});
//seting users file in the http://localhost:3000/users
app.get("/users", function (req, res) {
  res.send("respond with a resource");
});
//step6
// displaying car sale data all data

app.get("/ViewData", (req, res) => {
  fs.readFile(datapath, "utf8", (err, data) => {
    const jasondata = JSON.parse(data);
    res.render("viewdata", { salesData: jasondata });
  });
});
app.get("/filterViewData", (req, res) => {
  fs.readFile(datapath, "utf8", (err, data) => {
    const jasondata = JSON.parse(data);
    const filteredSalesData = jasondata.filter(
      (invoice) => invoice.Rating !== 0
    );
    res.render("viewdata", { salesData: filteredSalesData });
  });
});
// displaying car sale data by the given index data
app.get("/search/indexNo/:index", (req, res) => {
  fs.readFile(datapath, "utf8", (err, data) => {
    const jasondata = JSON.parse(data);
    const index = req.params.index;
    jasondata.forEach((element) => {
      if (element.InvoiceID === index) {
        founddata = element;
      }
    });
    res.render("onlySalesData", { data: founddata });
  });
});

//getting the invoice no from form and displaying the whole data of the invoice no

app.get("/search/invoiceNo", (req, res) => {
  res.render("invoiceForm");
});
app.post("/search/invoiceNo", (req, res) => {
  const { InvoiceID } = req.body;
  var founddata = null;
  fs.readFile(datapath, "utf8", (err, data) => {
    const jasondata = JSON.parse(data);
    jasondata.forEach((element) => {
      if (element.InvoiceID === InvoiceID) {
        founddata = element;
      }
    });
    res.render("onlySalesData", { data: founddata });
  });
});
//getting the invoice no from form and displaying the whole data of the invoice no

app.get("/search/ProductLine", (req, res) => {
  res.render("productLineForm");
});
app.post("/search/ProductLine", (req, res) => {
  const { ProductLine } = req.body;
  var founddata = [];
  fs.readFile(datapath, "utf8", (err, data) => {
    const jasondata = JSON.parse(data);
    jasondata.forEach((element) => {
      if (element.ProductLine === ProductLine) {
        founddata.push(element);
      }
    });
    res.render("viewdata", { salesData: founddata });
  });
});
//seting error file in the http://localhost:3000/notExist
app.get("*", function (req, res) {
  res.render("error", { title: "Error", message: "Wrong Route" });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
