import React, { createContext, useState } from 'react';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [quizName, setQuizName] = useState('');
  const [quizId, setQuizId] = useState(null);
  const [mark, setMark] = useState(0);
  const [wrongtopic, setWrongTopic] = useState([]);
  const [popUpIndependence, setPopUpIndependence] = useState(1); 
  return (
    <QuizContext.Provider value={{ username, setUsername, quizTopic, setQuizTopic, quizName, setQuizName, mark, setMark, wrongtopic, setWrongTopic, quizId, setQuizId, popUpIndependence, setPopUpIndependence }}>
      {children}
    </QuizContext.Provider>
  );
};
