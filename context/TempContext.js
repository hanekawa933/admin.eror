import { useState, createContext } from "react";

export const TempContext = createContext();

export const TempProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    bigMode: false,
    active: false,
    userLogin: [],
  });
  return (
    <TempContext.Provider value={[settings, setSettings]}>
      {children}
    </TempContext.Provider>
  );
};
