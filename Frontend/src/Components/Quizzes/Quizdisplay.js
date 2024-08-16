import React, { useContext, useEffect, useState } from 'react';
import './Quizdisplay.css';
import { QuizContext } from '../context/Quizcontext';
import { useNavigate } from 'react-router-dom';
import '../Home/Button.css';
import axios from 'axios';
import ICON from '../../Files/ICON.png';

const Quizdisplay = () => {
    const { setQuizTopic, username } = useContext(QuizContext);
    const [quizzes, setQuizzes] = useState([]);
    const { quizTopic, setQuizName, setQuizId } = useContext(QuizContext);
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState({});

    const updateQuizTopic = (topic) => {
        if (topic === 'profile') {
            navigate('/profile');
        } else if (topic === 'Quiz') {
            navigate('/NewQuiz');
        } else if (topic === 'leader') {
            navigate('/leaderboard');
        } else if (topic === 'AI') {
            navigate('/QuizAIPopup');
        } else if (topic === 'Home') {
            navigate('/');
        } else {
            setQuizTopic(topic);
            navigate('/QuizPage');
        }
    };

    const handleStartQuizClick = (quiz) => {
        setSelectedQuiz(quiz);
        setIsPopupOpen(true);
    };

    const handleQuizModeSelection = (mode) => {
        setQuizName(selectedQuiz.quizName);
        setQuizId(selectedQuiz.quizId);
        setIsPopupOpen(false);
        if(mode==="Manual")
        {
            navigate('/QuizManual');
        }
        else{
            navigate('/QuizVoiceAssistance')
        }
    };

    useEffect(() => {
        axios.get('http://localhost:8080/quiz/getQuiz')
            .then(response => setQuizzes(response.data.filter(quiz => quiz.quizTopic === quizTopic)))
            .catch(error => console.error('Error:', error));
    }, [quizTopic]);

    return (
        <div className="quiz-display-container">
            <nav className="navbar-display">
                <ul className="navbar-display-list">
                    <li className="navbar-display-item">
                        <button className="navbar-display-button" onClick={() => updateQuizTopic('leader')}>
                            LEADERBOARD
                        </button>
                    </li>
                    <li className="navbar-display-item">
                        <button className="navbar-display-button" onClick={() => updateQuizTopic('AI')}>
                            QUIZ AI
                        </button>
                    </li>
                    <li className="navbar-display-item">
                        <button className="navbar-display-button" onClick={() => updateQuizTopic('Quiz')}>
                            CREATE QUIZ
                        </button>
                    </li>
                    <li className="navbar-display-item">
                        <button className="navbar-display-button" onClick={() => updateQuizTopic('Biology')}>
                            BIOLOGY
                        </button>
                    </li>
                    <li className="navbar-display-item">
                        <button className="navbar-display-button" onClick={() => updateQuizTopic('Chemistry')}>
                            CHEMISTRY
                        </button>
                    </li>
                    <li className="navbar-display-item">
                        <button className="navbar-display-button" onClick={() => updateQuizTopic('Geography')}>
                            GEOGRAPHY
                        </button>
                    </li>
                    <li className="navbar-display-item">
                        <button className="navbar-display-button" onClick={() => updateQuizTopic('History')}>
                            HISTORY
                        </button>
                    </li>
                    <li className="navbar-display-item">
                        <button className="navbar-display-button" onClick={() => updateQuizTopic('Home')}>
                            HOME
                        </button>
                    </li>
                </ul>
            </nav>
            <h1 className="quiz-page-title">{quizTopic}</h1>
            <div className="quiz-grid">
                <div className="quiz-grid-container">
                    {quizzes.length > 0 ? (
                        quizzes.map((quiz, index) => (
                            <div className="quiz-card" key={index}>
                                <img src={ICON} alt="Quiz Icon" className="quiz-card-image" />
                                <div className="quiz-card-content">
                                    <h3 className="quiz-card-title">{quiz.quizTopic}</h3>
                                    <h3 className="quiz-card-description">{quiz.quizName}</h3>
                                    <div className="quiz-card-footer">
                                        <button onClick={() => handleStartQuizClick(quiz)} className="quiz-card-button">Start Quiz</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-quiz-content">No quiz content</div>
                    )}
                </div>
            </div>

            {isPopupOpen && (
                <div className="quiz-popup-overlay">
                    <div className="quiz-popup">
                        <h2>How do you wish to attend the quiz?</h2>
                        <button onClick={() => handleQuizModeSelection('Manual')} className="quiz-popup-button">Manual</button>
                        <button onClick={() => handleQuizModeSelection('Voice Assistance')} className="quiz-popup-button">Voice Assistance</button>
                        <button onClick={() => setIsPopupOpen(false)} className="quiz-popup-close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quizdisplay;
