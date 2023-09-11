const express = require('express');
const fs = require('fs/promises'); // Use the 'promises' version of the 'fs' module
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File path for storing links
const dataFilePath = './links.txt'; // Use a text file

// Load links from the text file (if it exists)
let links = loadLinks();

async function loadLinks() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

// Handle form submissions
app.post('/', async (req, res) => {
  let longUrl = req.body.url;
  const customShortCode = req.body.shortcode;

  // Prepend "https://" if the URL doesn't start with "http://" or "https://"
  if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
    longUrl = 'https://' + longUrl;
  }

  if (customShortCode && links[customShortCode]) {
    res.status(400).send('Custom short code already exists');
    return;
  }

  const shortCode = customShortCode || generateShortCode();
  links[shortCode] = longUrl;

  // Save links to the text file
  await saveLinks();

  res.send(`Shortened URL: <a href="/${shortCode}" target="_blank">${req.hostname}/${shortCode}</a>`);
});

async function saveLinks() {
  const data = JSON.stringify(links);
  await fs.writeFile(dataFilePath, data, 'utf-8');
}

// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
