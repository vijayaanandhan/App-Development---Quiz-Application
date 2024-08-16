
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { QuizProvider, QuizContext } from './Components/context/Quizcontext';
import HomeComponent from './Components/Home/HomeComponent';
import CreateQuiz from './Components/Create/CreateQuiz';
import CreateQuizVoiceAssistance from './Components/Create/CreateQuizVoiceAssistance';
import Quizdisplay from './Components/Quizzes/Quizdisplay';
import QuestionList from './Components/QuestionList/QuestionList';
import LoginComponent from './Components/login_signup/LoginComponent';
import SignupComponent from './Components/login_signup/SignupComponent';
import { useContext } from 'react';
import ResultPage from './Components/Result/ResultPage';
import LeaderBoard from './Components/leaderboard/LeaderBoard';
import ProfilePage from './Components/profilePage/ProfilePage';
import QuizAI from './Components/quizai/QuizAI';
import QuizCreator from './Components/NewQuiz/QuizCreator.js';
import QuizAIPopup from './Components/quizai/QuizAIPopup.js';

function ProtectedRoute({ children }) 
{
  const { username } = useContext(QuizContext);
  return username ? children : <Navigate to="/" />;
}

function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupComponent />} />
          <Route path="/" element={<HomeComponent />} />
          <Route path="/CreateQuiz" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
          <Route path="/QuizPage" element={<ProtectedRoute><Quizdisplay /></ProtectedRoute>} />
          <Route path="/QuizManual" element={<ProtectedRoute><QuestionList /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderBoard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
          <Route path="/AI" element={<ProtectedRoute><QuizAI/></ProtectedRoute>}/>
          <Route path="/NewQuiz" element={<ProtectedRoute><QuizCreator/></ProtectedRoute>}/>
          <Route path="/QuizVoiceAssistance" element={<ProtectedRoute><CreateQuizVoiceAssistance/></ProtectedRoute>}/>
          <Route path="/QuizAIPopup" element={<ProtectedRoute><QuizAIPopup/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  );
}

export default App;
