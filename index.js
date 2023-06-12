const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config()
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
        await client.connect();

        const instructorsCollection = client.db("musicCamp").collection("instructors");
        const classesCollection = client.db("musicCamp").collection("classes");

        app.get('/instructor', async (req, res) => {
            const result = await instructorsCollection.find().toArray();
            res.send(result);
            console.log(result);
        })

        app.get('/class', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
            console.log(result);
        })

        app.get('/class/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            console.log(query);

            const options = {
                projection: {
                    email: 1,
                    name: 1,
                    musicClasses: 1,
                    image: 1,
                    price: 1,
                }
            }
            const result = await classesCollection.find(query, options).toArray();
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