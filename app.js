/* ⚪️ REQUIRE STARTS >> */
//require express and body-parser
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date");
// require mongoose
const mongoose = require("mongoose");
/* << REQUIRE ENDS ⚪️ */

//Create app from express
const app = express();

//Set ejs as view engine
app.set("view engine", "ejs");

//Use bodyParser to parse html form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Save user inputs in an array
const items = ["Your tasks are added here"];

/* 💾 MONGOOSE STARTS  >> */
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB");

// Create Mongoose Schema
const itemsSchema = {
  name: String,
};


// create mongoose model
const Item = mongoose.model("Item", itemsSchema);

// create new documents
const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

// create array of documents
const defaultItems = [item1, item2, item3];
/* << MONGOOSE END 💾 */

/* 🔴 HOMEPAGE >> */

app.get("/", async function (req, res) {
    try {
      // Get Current Day
      const day = date.getDate();
  
      // Find all items in the collection
      const foundItems = await Item.find({});
  
      // Check if no items found
      if (foundItems.length === 0) {
        // Insert defaultItems into the collection
        await Item.insertMany(defaultItems);
        console.log("Default items inserted successfully.");
        // Redirect to the home page to display the default items
        res.redirect("/");
      } else {
        // Render list.ejs and pass in day and foundItems
        res.render("list", { day: day, items: foundItems });
      }
    } catch (err) {
      console.log(err);
    }
  });

/* << HOMEPAGE 🔴 */


/* 🔵 POST >> */

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });

  item.save();

  res.redirect("/");
});

/* << POST 🔵 */

app.post("/delete", function (req, res) {
  
  const checkedItemId = req.body.checkbox;

  // Remove checked item from the collection
  // Item.findOneAndDelete({ _id: checkedItemId });
  (async () => {
    try {
      const deletedItem = await Item.findOneAndDelete({ _id: checkedItemId });
      if (deletedItem) {
        console.log('Item successfully deleted:', deletedItem);
        // Item was found and deleted
      } else {
        console.log('Item not found');
        // Item with the given ID was not found
      }
    } catch (err) {
      console.error(err);
      // Handle the error
    }
  })();

  res.redirect("/");
});

//Listen on port 3000 for http requests
app.listen("3000", function () {
  console.log("Listening on port 3000");
});
