//Require express and body-parser
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date');

//Create app from express
const app = express();

//Set ejs as view engine
app.set('view engine', 'ejs')

//Use bodyParser to parse html form data
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

//Save user inputs in an array
const items = ["Your tasks are added here"]

//Get homepage to display list of tasks
app.get('/', function (req, res) {
    const day = date.getDate();
    res.render('list', { day: day, items: items })
})

app.post('/', function (req, res) {
    const item = req.body.newItem
    items.push(item)
    res.redirect('/')
})

//Listen on port 3000 for http requests
app.listen('3000', function () {
    console.log('Listening on port 3000');
})
