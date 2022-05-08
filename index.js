const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pp4ja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const carCollection = client.db('vehicoMart').collection('car');

        app.get('/car', async (req, res) => {
            const query = {};
            const cursor = carCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        });

        app.get('/car/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const car = await carCollection.findOne(query);
            res.send(car);
        });

        //POST
        app.post('/car', async(req, res) =>{
            const newCar = req.body;
            const result = await carCollection.insertOne(newCar);
            res.send(result);
        });

        //DELETE
        app.delete('/car/:id', async (req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const result = await carCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running backend server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})