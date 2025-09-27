import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HackingHome from "./componenets/HackingHome";
import FunnyAgeCalculator from "./componenets/FunnyAgeCalculator";
import FunnyCalculator from "./componenets/FunnyCalculator";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HackingHome />} />

        <Route path="/funny-age" element={<FunnyAgeCalculator />} />
        <Route path="/funny-calculator" element={<FunnyCalculator />} />

        <Route path="*" element={<HackingHome />} />
      </Routes>
    </Router>
  );
}
