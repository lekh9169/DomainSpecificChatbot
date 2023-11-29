create a .env file and your unique API key value goes here
REACT_APP_OPENAI_API_KEY=your key


in both the root folders of the backend and front end



when running both the applications do npm install to load packages
and for front end to run use the command npm start
for backend: node server.js


don't upload pdf more than 3 pages as I am doing page-based embeddings and the limit per minute is 3 for the embedding model.