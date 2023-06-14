const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gdcij36.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const instructorsCollection = client.db("musicCamp").collection("instructors");
        const classesCollection = client.db("musicCamp").collection("classes");
        const selectedCollection = client.db("musicCamp").collection("selected");

        app.get('/instructor', async (req, res) => {
            const result = await instructorsCollection.find().toArray();
            res.send(result);
        })

        app.get('/class', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        })

        app.get("/select", async (req, res) => {
            const result = await selectedCollection.find().toArray();
            res.send(result);
        })

        app.get('/select/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await selectedCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/select', async (req, res) => {
            const requestData = req.body;
            console.log(requestData);
            const result = await selectedCollection.insertOne(requestData);
            res.send(result)
        })

        app.delete('/select/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            console.log("query", query);
            const result = await selectedCollection.deleteOne(query);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Unleash your music potential in this summer camp!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})