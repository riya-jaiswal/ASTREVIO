import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ScrollToUp from "./utils/ScrollToUp";
import PageNotFound from "./pages/PageNotFound";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <ScrollToUp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
        <Route path="/services" element={<Services />} />
        
        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
