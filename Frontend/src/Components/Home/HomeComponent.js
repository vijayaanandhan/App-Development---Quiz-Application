import React, { useState, useEffect, useContext } from 'react';
import QICON from '../../Files/ICON.png';
import './HomeComponent.css';
import { QuizContext } from '../context/Quizcontext';
import { useNavigate } from 'react-router-dom';
import Modal from '../login_signup/Modal';
import LoginComponent from '../login_signup/LoginComponent';
import BIOLOGY from '../../Files/BIOLOGY.jpeg';
import CHEMISRTY from '../../Files/CHEMISTRY.jpeg';
import GEOGRAPHY from '../../Files/GEOGRAPHY.jpeg';
import HISTORY from '../../Files/HISTORY.jpeg';
import FB from '../../Files/FB.png';
import IG from '../../Files/instagram.png';
import X from '../../Files/twitter.png';

const HomeComponent = () => {
  const { setQuizTopic, username, popUpIndependence, setPopUpIndependence } = useContext(QuizContext);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCelebrationPopup, setShowCelebrationPopup] = useState(true);


  const updateQuizTopic = (topic) => {
    if (!username) {
      setShowLoginModal(true);
    } else {
      switch(topic) {
        case 'profile':
          navigate('/profile');
          break;
        case 'Quiz':
          navigate('/NewQuiz');
          break;
        case 'Leader':
          navigate('/leaderboard');
          break;
        case 'AI':
          navigate('/QuizAIPopup');
          break;
        default:
          setQuizTopic(topic);
          navigate('/QuizPage');
          break;
      }
    }
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    if (popUpIndependence === 1) {
        const timer = setTimeout(() => {
            setShowCelebrationPopup(false);
            
            // Set popUpIndependence to 0 after the popup is hidden
            setPopUpIndependence(0);
        }, 2500); // Popup disappears after 2.5 seconds

        // Cleanup the timer
        return () => clearTimeout(timer);
    }
}, [popUpIndependence, setPopUpIndependence])


  return (
    <div className={`background-wrapper ${showLoginModal ? 'blur-background' : ''}`}>
    {showCelebrationPopup && popUpIndependence === 1 && (
      <div className="celebration-popup-overlay">
          <div className="celebration-popup">
              <dotlottie-player
                  src="https://lottie.host/ab9e0386-3c11-46d6-8c69-67a6d2b8f815/3d6W2q27iE.json"
                  background="transparent"
                  speed="1"
                  style={{ width: '500px', height: '400px', opacity: 0.3 }}
                  loop
                  autoplay
              ></dotlottie-player>
              <div className="independence">
                  <h2>Let's celebrate our 78th Independence Day together</h2>
                  <p>Happy Independence Day!</p>
              </div>
          </div>
      </div>
  )}
      <div className="home-container">
        <nav className="navbar">
          <ul>
            <li>
              <img src={QICON} alt="QICON" className="navbar-image" />
              <span className='InsightQuest'>InsightQuest</span>
            </li>
            <li>
              <button className="navbar-button" onClick={() => updateQuizTopic('Leader')}>
                LEADERBOARD
              </button>
            </li>
            <li>
              <button className="navbar-button" onClick={() => updateQuizTopic('AI')}>
                QUIZ AI
              </button>
            </li>
            <li>
              <button className="navbar-button" onClick={() => updateQuizTopic('Quiz')}>
                CREATE QUIZ
              </button>
            </li>
            <li>
              <button className="navbar-button" onClick={() => updateQuizTopic('profile')}>
                {username ? `${username}` : 'LOGIN'}
              </button>
            </li>
          </ul>
        </nav>
        <br/>
        <br/>
        <div className='secondBig'>
          <div className='secondBig01'>
            <dotlottie-player 
              src="https://lottie.host/51f898d0-968e-48ae-b648-a0c10dfc046b/XQNjCsLKwk.json"
              background="transparent"
              speed="1"
              style={{ width: '600px', height: '800px', opacity: 0.2 }}
              loop
              autoplay
            ></dotlottie-player>
            <div className='homeContent'>
              <h1>Welcome to InsightQuest!</h1>
              <br/>
              <p>Welcome to InsightQuest, where your journey towards mastering new knowledge begins.</p>
              <p>Immerse yourself in a diverse range of quizzes designed to challenge and expand your understanding.</p>
              <p>Each quiz offers a unique opportunity to enhance your skills and gauge your expertise.</p>
              <p>Whether you're a seasoned learner or just starting, there's something here for everyone.</p>
              <p>Embrace the excitement of discovering new concepts and enjoy the path of continuous learning and self-improvement.</p>
            </div>
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <div className='thirdBig'>
          <div className='thirdBigcc' onClick={() => updateQuizTopic('Biology')}>
            <div className='thirdBig0101'>
              <h1>"Biology Quiz Challenge: How Well Do You Know Biology?"</h1>
              <h3>Take on our quiz and find out if you're a true Biology expert.</h3>
            </div>
            <div className='thirdBig0102'>
              <img src={BIOLOGY} alt='Biology Quiz Challenge' />
            </div>
          </div>
          <div className='thirdBigcc' onClick={() => updateQuizTopic('Chemistry')}>
            <div className='thirdBig0201'>
              <img src={CHEMISRTY} alt='Chemistry Quiz Challenge' />
            </div>
            <div className='thirdBig0202'>
              <h1>"Chemistry Quiz Challenge: How Well Do You Know Chemistry?"</h1>
              <h3>Take on our quiz and find out if you're a true Chemistry expert.</h3>
            </div>
          </div>
          <div className='thirdBigcc' onClick={() => updateQuizTopic('Geography')}>
            <div className='thirdBig0301'>
              <h1>"Geography Quiz Challenge: How Well Do You Know Geography?"</h1>
              <h3>Take on our quiz and find out if you're a true Geography expert.</h3>
            </div>
            <div className='thirdBig0302'>
              <img src={GEOGRAPHY} alt='Geography Quiz Challenge' />
            </div>
          </div>
          <div className='thirdBigcc' onClick={() => updateQuizTopic('History')}>
            <div className='thirdBig0401'>
              <img src={HISTORY} alt='History Quiz Challenge' />
            </div>
            <div className='thirdBig0402'>
              <h1>"History Quiz Challenge: How Well Do You Know History?"</h1>
              <h3>Take on our quiz and find out if you're a true History expert.</h3>
            </div>
          </div>
        </div>
        <div className='footer'>
          <div className='footer-content'>
            <div className='footer-section'>
              <h2>Contact Us</h2>
              <p>If you have any questions or feedback, feel free to reach out to us:</p>
              <p>Email: <a href="mailto:support@insightquest.com">support@insightquest.com</a></p>
              <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
            </div>
            <div className='footer-section'>
              <h2>Follow Us</h2>
              <p>Stay updated with our latest news and updates:</p>
              <div className='social-links'>
                <a href="https://facebook.com/insightquest" target="_blank" rel="noopener noreferrer" className='social-icon'>
                  <img src={FB} alt="Facebook" />
                </a>
                <a href="https://twitter.com/insightquest" target="_blank" rel="noopener noreferrer" className='social-icon'>
                  <img src={X} alt="Twitter" />
                </a>
                <a href="https://instagram.com/insightquest" target="_blank" rel="noopener noreferrer" className='social-icon'>
                  <img src={IG} alt="Instagram" />
                </a>
              </div>
            </div>
            <div className='footer-section'>
              <h2>About Us</h2>
              <p>InsightQuest is dedicated to bringing you the best quizzes to test and improve your knowledge across various topics. Join our community and challenge yourself today!</p>
            </div>
          </div>
          <div className='footer-bottom'>
            <p>&copy; {new Date().getFullYear()} InsightQuest. All rights reserved.</p>
          </div>
        </div>
        <Modal show={showLoginModal} onClose={handleLoginClose}>
          <LoginComponent onClose={handleLoginClose} />
        </Modal>
      </div>
    </div>
  );
};

export default HomeComponent;
