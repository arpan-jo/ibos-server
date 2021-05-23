const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 3500;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u5ldw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});
client.connect(err => {
   console.log(err);
   const userCollection = client.db('ibos').collection('users');

   app.post('/addUsers', (req, res) => {
      console.log(req.body);
      const user = req.body;
      userCollection.insertOne(user).then(result => {
         res.send(result.insertedCount > 0);
      });
   });

   app.get('/getUsers', (req, res) => {
      userCollection.find({}).toArray((err, documents) => res.send(documents));
   });

   app.delete('/deleteUser', (req, res) => {
      const id = req.body.id;
      userCollection.findOneAndDelete({ _id: ObjectID(id) }).then(result => {
         console.log(result);
      });
   });
});

app.get('/', (req, res) => {
   res.send('Hello World!');
});

app.listen(port);
