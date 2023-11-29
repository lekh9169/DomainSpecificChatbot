// FileUpload.jsx
import React, { useState, useEffect } from "react";
import { uploadFile } from "../services/fileUploadService";
import "./ai-pdf-openai-component.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { useAppContext } from '../AppContext';

const AiPdfOpenaiComponent = ({ fileUploadSuccess, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [embeddingResp, setEmbeddingResp] = useState(null);
  // const { setUploadSuccess } = useAppContext();
  // const { fileUploadSuccess } = useAppContext();
  useEffect(() => {
    // This effect will run whenever fileUploadSuccess changes
    if (fileUploadSuccess) {
      // Take any actions you need when fileUploadSuccess is true
      console.log('File upload success detected!');
    }
  }, [fileUploadSuccess]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);

    setEmbeddingResp(await uploadFile(selectedFile));
    if(embeddingResp != false){
      setUploading(false);
      onUploadSuccess();
    }
    console.log(embeddingResp);
    console.log(fileUploadSuccess);
  };


  return (
    <div className="container">
      <div className="file-upload-container">
        <label className="custom-file-upload">
          <span className="file-choose-label">Choose PDF File</span>
          <div className="row">
            <div className="col-md-8">
              <input type="file" onChange={handleFileChange} />
            </div>
            <div className="col-md-4">
              <button
                className={`btn btn-primary upload-btn ${uploading ? "uploading" : ""
                  }`}
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

          </div>
        </label>

        {selectedFile && (
          <div className="selected-file-info">
            <div className="row">
              <div className="col-md-6">
                <p>{selectedFile.name}</p>
              </div>
              <div className="col-md-6">
                <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
        )}

        {embeddingResp !== null && (
          <div
            className={`upload-feedback ${fileUploadSuccess ? "success" : "failure"}`}
          >
            {fileUploadSuccess ? "File uploaded successfully!" : "File upload failed. Please try again."}
          </div>
        )}
      </div>
    </div>

  );
};

export default AiPdfOpenaiComponent;
