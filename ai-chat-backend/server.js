const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { extractTextFromPDF, findMatchingEmbeddings } = require('./pdfutils'); // Make sure to adjust the path

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle file uploads
app.post('/upload', upload.single('pdfFile'), async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    // Extract text from PDF
    const extractedText = await extractTextFromPDF(file);

    // Do something with the extracted text (e.g., save to a database)
    console.log('Extracted Text:', extractedText);

    return res.status(200).json({ success: true, extractedText });
  } catch (error) {
    console.error('File upload error:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET endpoint to handle prompts from the front-end
app.get('/getPrompt', async (req, res) => {
  // Retrieve the prompt from the query parameters
  const prompt = req.query.prompt;

  const response = await findMatchingEmbeddings(prompt);

  // Send the response back to the front-end
  res.json({ response });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
