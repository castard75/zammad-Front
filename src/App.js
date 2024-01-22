import logo from "./logo.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext(null);

function App() {
  const [allTechnicienContext, setAllTechnienContext] = useState("allan");

  return (
    <AppContext.Provider
      value={{ allTechnicienContext, setAllTechnienContext }}
    >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
