require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

//parser
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cliw5jo.mongodb.net/?retryWrites=true&w=majority`;

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
    const taskCollection = client.db("TaskSyncDB").collection("tasks");

    app.get("/tasks", async (req, res) => {
      try {
        const queryEmail = req.query.email;
        const query = { email: queryEmail };
        console.log("🚀 ~ file: index.js:32 ~ app.get ~ queryEmail:", queryEmail);
        console.log("🚀 ~ file: index.js:33 ~ app.get ~ query:", query);
        const result = await taskCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.log(error.message);
      }
    });
    app.get("/tasks/id/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await taskCollection.findOne(filter);
        res.send(result);
      } catch (error) {
        console.log(error.message);
      }
    });

    app.post("/tasks", async (req, res) => {
      try {
        const newTask = req.body;
        const result = await taskCollection.insertOne(newTask);
        res.send(result);
      } catch (error) {
        console.log(error.message);
      }
    });

    app.put("/tasks/id/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedTask = req.body;
      const task = {
        $set: {
          ...updatedTask,
        },
      };
      const result = await taskCollection.updateOne(filter, task);
      res.send(result);
    });

    app.delete("/tasks/id/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(filter);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Inventory Management server running");
});
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
