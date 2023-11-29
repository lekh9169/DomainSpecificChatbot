// fileUploadService.js

// import pdfjsLib from '../../node_modules/pdfjs-dist/build/pdf.mjs';

const pdfjs = require("pdfjs-dist/legacy/build/pdf");
const MAX_FILE_SIZE_MB = 5;
export const uploadFile = async (file) => {
  try {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error('File size exceeds the maximum allowed limit.');
    }

    // Save the file to the local data folder
    const filePath = `/src/data/${file.name}`;
    const result = await extractTextFromPDF(file);

    return result;
  } catch (error) {
    console.error('File upload error:', error.message);
    return false; // File upload failure
  }
};

// const saveFileLocally = async (file, filePath) => {
//   try {
//     const data = await file.arrayBuffer();
//     const blob = new Blob([data]);

//     // Create a download link and trigger a click to simulate a download
//     const link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = file.name;
//     link.click();

//     return true; // File saved successfully
//   } catch (error) {
//     console.error('File saving error:', error.message);
//     return false; // File saving failure
//   }
// };

export const extractTextFromPDF = async (file) => {
  return new Promise((_resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (_event) => {
      try {
        const formData = new FormData();
        formData.append('pdfFile', file);

        const response = await fetch('http://localhost:3001/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          _resolve(result);
        } else {
          reject("no idea");
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};
