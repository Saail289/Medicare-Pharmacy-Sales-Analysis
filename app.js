const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const mongoUrl = 'mongodb://localhost:27017/DBMS_CAT';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up a route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submitData', async (req, res) => {
  try {
    const inputData = req.body;

    // Validate the required fields
    if (!inputData.name || !inputData.email) {
      return res.status(400).send('Both name and email are required fields.');
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();

    // Insert data into MongoDB
    await db.collection('project').insertOne(inputData);

    // Close the MongoDB connection
    client.close();

    res.status(200).send('Data successfully added to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
