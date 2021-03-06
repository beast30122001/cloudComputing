var express = require('express')
var app = express()

var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';
var url =  "mongodb+srv://alla:lam30122001@cluster0.lkbar.mongodb.net/test";

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var hbs = require('hbs')
app.set('view engine','hbs')


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/edit', async(req,res)=>{
    let id = req.query.pid;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id":ObjectID(id)}; 
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("alla");
    let prod = await dbo.collection("pd").findOne(condition);
    res.render('edit',{model:prod});

})
app.post('/update',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("alla");

    console.log(req.body)
    
    let nameInput = req.body.productName;
    let priceInput = req.body.price;
    let idInput = req.body.pid;
    let colorInput = req.body.color;

    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id":ObjectID(idInput)};  

    let updateProduct ={$set : {productName : nameInput, price:priceInput, color:colorInput}} ;
    await dbo.collection("pd").updateOne(condition,updateProduct);
    res.redirect('/');
})

app.get('/delete',async (req,res)=>{
    let id = req.query.pid;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id":ObjectID(id)};    

    let client= await MongoClient.connect(url);
    let dbo = client.db("alla");
    
    await dbo.collection("pd").deleteOne(condition);
    res.redirect('/');
})

//npm install mongodb
app.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("alla");
    let results = await dbo.collection("pd").find({}).toArray();
    res.render('home',{model:results});
})
app.get('/new',(req,res)=>{
    res.render('newProduct');
})
app.post('/search',async (req,res)=>{
    let searchText = req.body.txtSearch;
    let client= await MongoClient.connect(url);
    let dbo = client.db("alla");
    let results = await dbo.collection("pd").
        find({productName: new RegExp(searchText,'i')}).toArray();
        
    res.render('home',{model:results});
})
app.post('/insert',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("alla");
    let nameInput = req.body.productName;
    let priceInput = req.body.price;
    let newProduct = {productName : nameInput, 
                      price:priceInput};
//     If (nameInput.trim().length == 0){
//         let modelError1={nameInputError:"error"};
//         res.render('newProduct',{model:modelError1})
//     else
//     {let client= await MongoClient.connect(url);
//         let dbo = client.db("alla");
//         await dbo.collection("pd").insertOne(newProduct);
//     let results = await dbo.collection("pd").find({}).toArray();
//     res.render('home',{model:results})

//     }
// })
    await dbo.collection("pd").insertOne(newProduct);
    let results = await dbo.collection("pd").find({}).toArray();
    res.render('home',{model:results});
})

var PORT = process.env.PORT || 5000
app.listen(PORT);
console.log("Server is running at " + PORT)