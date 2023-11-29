// AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  const setUploadSuccess = (success) => {
    setFileUploadSuccess(success);
  };

  return (
    <AppContext.Provider value={{ fileUploadSuccess, setUploadSuccess }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
