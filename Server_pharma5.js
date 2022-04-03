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
    let CatID = Number(req.params.cat_id)
    let query = {};
    if(ItemID&CatID){
        query = {"SID":CatID, ITEM_ID:ItemID}
    }
    else if(CatID){
        query = {"SID":CatID}
    }
    else if(ItemID){
        query = {"ITEM_ID":ItemID}
    }
    console.log("ITEM_ID ", ItemID)
    db.collection('items').find(query).toArray( (err, result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/item/:id',(req,res) => {
    let restId  = Number(req.params.id)
    db.collection('items').find({ITEM_ID:restId}).toArray((err,result) =>{
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