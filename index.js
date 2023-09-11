const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB URI (replace with your MongoDB Atlas URI)
const uri = 'mongodb+srv://louay:123@cluster0.hiqcxwe.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let linksCollection; // MongoDB collection for links

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('Cluster0'); // Replace 'yourdb' with your database name
    linksCollection = db.collection('links');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Call this function to connect to MongoDB
connectToMongoDB();

// Handle form submissions
app.post('/', async (req, res) => {
  let longUrl = req.body.url;
  const customShortCode = req.body.shortcode;

  // Prepend "https://" if the URL doesn't start with "http://" or "https://"
  if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
    longUrl = 'https://' + longUrl;
  }

  // Check if the custom short code already exists
  if (customShortCode) {
    const existingLink = await linksCollection.findOne({ shortCode: customShortCode });
    if (existingLink) {
      res.status(400).send('Custom short code already exists');
      return;
    }
  }

  const shortCode = customShortCode || generateShortCode();

  const link = {
    shortCode,
    longUrl,
  };

  // Insert the link into MongoDB
  linksCollection.insertOne(link)
    .then(result => {
      console.log('Link inserted:', result.insertedId);
      res.send(`Shortened URL: <a href="/${shortCode}" target="_blank">${req.hostname}/${shortCode}</a>`);
    })
    .catch(err => {
      console.error('Error inserting link:', err);
      res.status(500).send('Server error');
    });
});

// Redirect to the original URL
app.get('/:shortCode', async (req, res) => {
  const shortCode = req.params.shortCode;

  // Find the link in MongoDB
  const link = await linksCollection.findOne({ shortCode });

  if (link) {
    res.redirect(link.longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

// Function to generate a random short code
function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
