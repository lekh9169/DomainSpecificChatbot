const pdfjs = require('pdfjs-dist');
require("dotenv").config();
const { OpenAI } = require("openai");
const ExcelJS = require('exceljs');
const fs = require('fs').promises;


// Function to check if a file exists
const fileExcelExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
};

const extractTextFromPDF = async (file) => {

    return new Promise(async (resolve, reject) => {
        try {
            const typedArray = new Uint8Array(file.buffer);
            const pdfDocument = await pdfjs.getDocument(typedArray).promise;
            const maxPages = pdfDocument.numPages;
            console.log(maxPages);
            let text = '';
            const paragraphs = [];

            for (let pageNumber = 1; pageNumber <= maxPages; pageNumber++) {
                const page = await pdfDocument.getPage(pageNumber);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(' ') + " __ ";
            }
            const pageParagraphs = text.split(' __ ').filter(paragraph => paragraph.trim() !== '');
            paragraphs.push(...pageParagraphs);
            console.log(paragraphs);
            const embeddings = [];
            const openai = new OpenAI({
                apiKey: process.env.REACT_APP_OPENAI_API_KEY,
            });

            for (const paragraph of paragraphs) {
                const embedding = await openai.embeddings.create({
                    model: 'text-embedding-ada-002',
                    input: paragraph,
                    encoding_format: 'float'
                });
                embeddings.push(embedding.data[0].embedding);
            }

            console.log(paragraphs, embeddings);
            //resolve(embedding);
            const excelFilePath = './embeddingData/embeddingData.xlsx';
            // Check if the Excel file exists

            const fileExists = await fileExcelExists(excelFilePath);

            // Create or load existing workbook
            const workbook = new ExcelJS.Workbook();
            if (fileExists) {
                await workbook.xlsx.readFile(excelFilePath);
            }

            // Get or create worksheet
            let worksheet = workbook.getWorksheet('Paragraphs and Embeddings');
            if (!worksheet) {
                worksheet = workbook.addWorksheet('Paragraphs and Embeddings');
            }

            // Add data
            for (let i = 0; i < paragraphs.length; i++) {
                worksheet.addRow([paragraphs[i], embeddings[i]]);
            }

            // Save the Excel file
            await workbook.xlsx.writeFile(excelFilePath);

            console.log(`Excel file saved at: ${excelFilePath}`);
            resolve(excelFilePath);

        } catch (error) {
            console.error('Error in extractTextAndEmbeddings:', error);

            reject(error);

        }
    });
};

const findMatchingEmbeddings = async (prompt) => {
    const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: prompt,
        encoding_format: 'float'
    });
    const embeddingsData = [];
    const excelFilePath = './embeddingData/embeddingData.xlsx';
    try {
        // Check if the Excel file exists

        const fileExists = await fileExcelExists(excelFilePath);

        // Create or load existing workbook
        const workbook = new ExcelJS.Workbook();
        if (fileExists) {
            await workbook.xlsx.readFile(excelFilePath);
        }

        // Get or create worksheet
        let worksheet = workbook.getWorksheet('Paragraphs and Embeddings');
        if (!worksheet) {
            worksheet = workbook.addWorksheet('Paragraphs and Embeddings');
            // Add headers if creating a new worksheet
        }
        // Read all rows from the worksheet

        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            // Assuming your data is stored in columns A and B, adjust accordingly
            const paragraph = row.getCell(1).value;
            const embedding = row.getCell(2).value;
            if (paragraph !== null && embedding !== null) {
                // Push the data to the array
                embeddingsData.push({ paragraph, embedding });
            }
        });
    } catch (error) {
        console.error('Error reading embeddings from Excel:', error.message);
        return null;
    }
    let maxSimilarity = 0;
    let maxSimilarPrompt = "";
    for (let index = 1; index < embeddingsData.length; index++) {
        let similarity = calculateCosineSimilarity(embedding.data[0].embedding, JSON.parse(embeddingsData[index].embedding));
        if(maxSimilarity < similarity){
            maxSimilarity = similarity;
            maxSimilarPrompt = embeddingsData[index].paragraph;
        }
    }
    return prompt + " given information: " + maxSimilarPrompt;
}

const calculateCosineSimilarity = (vectorA, vectorB) => {
    // Calculate dot product
    let dotProduct = 0;
    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];
    }

    // Calculate magnitudes
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value ** 2, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value ** 2, 0));

    // Calculate cosine similarity
    const similarity = dotProduct / (magnitudeA * magnitudeB);

    return similarity;
};

module.exports = { extractTextFromPDF, findMatchingEmbeddings };
