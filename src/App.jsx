import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Writeups from "./pages/Writeups";
import WriteupDetail from "./pages/WriteupDetail";
// import MarkdownRenderer from "./components/Test";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/writeups" element={<Writeups />} />
        <Route path="/writeups/:ctfSlug" element={<WriteupDetail />} />
        <Route
          path="/writeups/:ctfSlug/:challengeSlug"
          element={<WriteupDetail />}
        />
        {/* <Route
          path="/testMD"
          element={<MarkdownRenderer url="public\test2.md" />}
        /> */}
      </Routes>
    </Router>
  );
};

export default App;
