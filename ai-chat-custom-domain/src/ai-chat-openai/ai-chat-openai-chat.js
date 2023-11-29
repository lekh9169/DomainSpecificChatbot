import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { useAppContext } from '../AppContext';

const Openaichatcomponent = ({ fileUploadSuccess }) => {

  // const { fileUploadSuccess } = useAppContext();
  const [userConversation, setUserConversation] = useState([]);
  const [assistantConversation, setAssistantConversation] = useState([
    { role: 'assistant', content: fileUploadSuccess ? 'Hi I am domain specific text-davinci-003 chatbot, please feel free to ask anything related to uploaded pdfs.': "Hello, I'm a text-davinci-003 chatbot designed for general purposes. Feel free to ask me anything.", time: new Date() }
  ]);
  useEffect(() => {
    setAssistantConversation([{ role: 'assistant', content: fileUploadSuccess ? 'Hi I am domain specific text-davinci-003 chatbot, please feel free to ask anything related to uploaded pdfs.': "Hello, I'm a text-davinci-003 chatbot designed for general purposes. Feel free to ask me anything.", time: new Date() }]);
    setUserConversation([]);
  }, [fileUploadSuccess]);
  

  const [prompt, setPrompt] = useState("");

  const addMessageToAssistantConversation = (content) => {
    setAssistantConversation([...assistantConversation, { role: 'assistant', content, time: new Date() }]);
  };

  const addMessageToUserConversation = (content) => {
    setUserConversation([...userConversation, { role: 'user', content, time: new Date() }]);
  };

  const handleUserInput = async () => {
    // Add user's message to the user conversation
    addMessageToUserConversation(prompt);
    let jsonResponse;
    if(fileUploadSuccess){
      let domainResponse;
      domainResponse = await fetch(`http://localhost:3001/getPrompt?prompt=${prompt}`);
      const { status, headers } = domainResponse;
      
      // Check if the response is okay (status code 2xx)
      if (status >= 200 && status < 300) {
        // Parse the JSON response
        jsonResponse = await domainResponse.json();
        setPrompt(jsonResponse.response);
      } else {
        // Handle non-okay response
        console.error('Error fetching prompt:', status, headers);
      }
    }

    // Call OpenAI API
    const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: fileUploadSuccess ? jsonResponse.response : prompt,
      temperature: 0.3,
      max_tokens: 3000
    });
    setPrompt("");
    // Add assistant's response to the assistant conversation
    addMessageToAssistantConversation(completion.choices[0].text);
  };

  // Merge and sort conversations based on insertion order
  const mergedConversation = [...userConversation, ...assistantConversation].sort((a, b) => a.time - b.time);

  return (
    <div className="container">
      <div className="card shadow-lg">
        <div className="card-body">
          <div className="chat-container">
            <div className="messages">
              {mergedConversation.map((message, index) => (
                <div key={index} className={message.role === 'assistant' ? 'message-left' : 'message-right'}>
                  <p className={message.role === 'assistant' ? 'left' : 'right'}>{message.content}</p>
                  <small className='time'>{message.time.toLocaleString()}</small>
                </div>
              ))}
            </div>
            <div className="user-input">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button onClick={handleUserInput} className="btn btn-primary">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Openaichatcomponent;
