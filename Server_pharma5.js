let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
//const mongoUrl = "mongodb://localhost:27017"
const mongoUrl = "mongodb+srv://Takasi:Test1234@cluster0.pbpmw.mongodb.net/Pharmacy?retryWrites=true&w=majority";
//const dotenv = require('dotenv')
//dotenv.config()
const bodyParser = require('body-parser')
const cors = require('cors');
const { json } = require('body-parser');
let port = process.env.PORT || 3003;
var db;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res) => {
    res.send("Welcome to express")
})

//location
app.get('/category',(req,res) => {
    db.collection('Category').find().toArray((err,result) =>{
        if(err) throw err;
        
        res.send(result)
        console.log(result)
    })
})


app.get('/items', (req,res) => {
    let ItemID = Number(req.params.item_id)
    let locID = Number(req.params.loc_id)
    let catID = Number(req.params.catid)
    let query = {};
    if(locID&ItemID){
        query = {"location_id":CatID, ITEM_ID:ItemID}
    }
    else if(locID){
        query = {"location_id":locID}
    }
    else if(ItemID){
        query = {"ITEM_ID":ItemID}
    }
    else if(catID){
        query = {"SID":catID}
    }
    console.log("ITEM_ID ", ItemID)
    db.collection('transactions').find(query).toArray( (err, result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/item/:id',(req,res) => {
    let itemId  = Number(req.params.id)
    db.collection('items').find({ITEM_ID:itemId}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/filter/:itemId', (req,res) => {
    let sort = {price:1}
    let itemId = Number(req.params.itemId)
    let skip = 0;
    let limit = 1000000000000;
    let catID = Number(req.params.catid)
    let lcost = Number(req.params.lcost);
    let hcost = Number(req.params.hcost);
    let query = {}

    if(req.query.sort){
        sort = {price:req.query.sort}
    }
    if(req.query.skip && req.query.limit){
        skip = Number(req.query.skip);
        limit = Number(req.query.limit);
    }
    if(catID&lcost&hcost){
        query = {
            "SID":catID,
            "ITEM_ID":itemId,
            $and:[{price:{$gt:lcost,$lt:hcost}}]
        }
    }
    else if(catID){
        query = {"SID":catID,"ITEM_ID":itemId}
    }
    else if(lcost&hcost){
        query = {$and:[{price:{$gt:lcost,$lt:hcost}}],"ITEM_ID":itemId}
    }

    db.collection('transactions').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/quicksearch',(req,res) => {
    db.collection('items').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})


app.get('/items/:id',(req,res) => {
    let itemId  = Number(req.params.id)
    db.collection('items').find({"ITEM_ID":itemId}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/details/:itemid',(req,res) => {
    let itemId  = Number(req.params.itemid)
    db.collection('transactions').find({"ITEM_ID":itemId}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})


app.get('/orders',(req,res) => {
    let email  = req.query.email
    let query = {};
    if(email){
        query = {"email":email}
    }
    db.collection('orders').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.post('/placeorder', (req, res) => {
    console.log(req.body)
    db.collection('orders').insertOne(req.body, (err,result) => {
        if(err) throw err;
        res.send('order placed')
    })

})

app.post('/drugItem', (req, res) => {
    console.log(req.body)
    db.collection('drugs').insertOne(req.body, (err,result) => {
        if(err) throw err;
        res.send('order added')
    })

})

app.post('/drugItems', (req, res) => {
    console.log(req.body)
    db.collection('drugs').insertMany(req.body, (err,result) => {
        if(err) throw err;
        res.send('order added')
    })

})

//location
app.get('/location',(req,res) => {
    db.collection('location').find().toArray((err,result) =>{
        if(err) throw err;
        
        res.send(result)
        console.log(result)
    })
})








MongoClient.connect(mongoUrl, (err,client) => {
    if(err) console.log("Error While Connecting");
    db = client.db('Pharmacy');
    app.listen(port,()=>{
        console.log(`listening on port no ${port}`)
    });
})