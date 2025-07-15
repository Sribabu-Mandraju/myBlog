import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Writeups from "./pages/Writeups";
// import Statemindctf25 from "./pages/writeupsList/statemindctf25";
import MarkdownRenderer from "./components/Test";
const BlogPost = () => <div className="text-center">Blog Post</div>;
const About = () => <div className="text-center">About Page</div>;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/writeups" element={<Writeups />} />
        <Route path="/blogs/:id" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/writeups/statemindctf25" element={<Statemindctf25 />} /> */}
        <Route path="/testMD" element={<MarkdownRenderer url="public\test2.md" />} />
      </Routes>
    </Router>
  );
};

export default App;
