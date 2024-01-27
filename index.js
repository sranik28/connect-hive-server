const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 8888;
const app = express();

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://connect-hive:wC07wpE0KUzZ13bX@cluster1.ngcynwn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const all_Contacts = client.db("ConnectHive").collection("allContact");
   
    app.get("/allContact", async (req, res) => {
      const toys = all_Contacts.find();
      const result = await toys.toArray();
      res.send(result);
    });

    app.get("/allContact/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await all_Contacts.findOne(query);
      res.send(result);
    });

    app.patch("/allContact/:id", async (req, res) => {
      const id = req.params.id;

      const data = req.body;
      const result = await all_Contacts.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            photoURL: data.photoURL,
          },
        },
        {
          upsert: true,
        }
      );
      res.send(result);
    });

    app.delete("/deleteContact/:id", async (req, res) => {
      const id = req.params.id;
      const result = await all_Contacts.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.post("/contacts", async (req, res) => {
      const data = req.body;
      const result = await all_Contacts.insertOne(data);
      res.send(result);
      console.log(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("contact is coltase");
});


app.listen(port);
