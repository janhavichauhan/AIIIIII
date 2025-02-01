import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";


const Home = () => (
  <div className="container">
    <h1>AI-Powered Education Platform</h1>
    <nav>
      <Link to="/quiz">Quiz</Link> | 
      <Link to="/content"> Course Content</Link> | 
      <Link to="/summary"> Summary</Link>
    </nav>
  </div>
);

const Quiz = () => {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState(null);

  const generateQuiz = async () => {
    const response = await axios.post("http://localhost:5000/generate-quiz", { topic, difficulty: "medium" });
    setQuiz(response.data.quiz);
  };

  return (
    <div className="container">
      <h2>Generate Quiz</h2>
      <input type="text" placeholder="Enter topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <button onClick={generateQuiz}>Generate</button>
      {quiz && <p><strong>Quiz:</strong> {quiz}</p>}
    </div>
  );
};

const CourseContent = () => {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState(null);

  const generateContent = async () => {
    const response = await axios.post("http://localhost:5000/generate-content", { topic });
    setContent(response.data.content);
  };

  return (
    <div className="container">
      <h2>Generate Course Content</h2>
      <input type="text" placeholder="Enter topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <button onClick={generateContent}>Generate</button>
      {content && <p><strong>Content:</strong> {content}</p>}
    </div>
  );
};

const AIPlatform = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/content" element={<CourseContent />} />
    </Routes>
  </Router>
);

export default AIPlatform;
