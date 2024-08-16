import React, { useState } from 'react';
import './QuizAIPopup.css';
import QuizAI from './QuizAI';
import AiQuizBgVideo from '../../Files/AiQuizBgVideo.mp4'

const QuizAIPopup = ({ onClose, onSubmit }) => {
  const [topicInput, setTopicInput] = useState('');
  const [isQuizAIVisible, setIsQuizAIVisible] = useState(false);

  const handleSubmit = () => {
    if (topicInput.trim()) {
      setIsQuizAIVisible(true); // Show QuizAI component
    } else {
      alert("Input field is empty.");
    }
  };

  if (isQuizAIVisible) {
    // Render QuizAI component when the input field is not empty
    return <QuizAI topic={topicInput} />;
  }

  return (
    <div className="quizai-popup-container">
      <video autoPlay muted loop className="quizai-popup-background-video">
        <source src={AiQuizBgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="quizai-popup-overlay">
        <div className="quizai-popup">
          <h2>Enter the topic that you want to try</h2>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="quizai-popup-input"
            placeholder="Enter topic"
          />
          <div className="quizai-popup-buttons">
            <button onClick={handleSubmit} className="quizai-popup-submit-button">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAIPopup;
