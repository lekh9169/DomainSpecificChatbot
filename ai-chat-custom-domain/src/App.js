import React, { useState } from 'react';
import logo from "./logo.svg";
import "./App.css";
import Openaichatcomponent from "./ai-chat-openai/ai-chat-openai-chat";
import AiPdfOpenaiComponent from "./ai-pdf-openai/ai-pdf-openai-component";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  // const handleUploadSuccess = () => {
  //   //console.log(flag);
  //   setFileUploadSuccess(true);
  //   console.log(fileUploadSuccess);
  // };

  return (
    <div className="App">
      <header className="App-header">
        <div className="row">
          <div className="logo-container col">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div className="col">
            <AiPdfOpenaiComponent fileUploadSuccess = {fileUploadSuccess}
              onUploadSuccess={() => setFileUploadSuccess(true)} />
          </div>
        </div>
        <div className="content-container">
          <Openaichatcomponent fileUploadSuccess={fileUploadSuccess} />
        </div>
      </header>
    </div>
  );
}

export default App;
