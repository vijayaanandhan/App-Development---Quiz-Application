import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './profilepage.css';
import { QuizContext } from '../context/Quizcontext';

const ProfilePage = () => {
  const [testResults, setTestResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedQuizName, setSelectedQuizName] = useState('All');
  const { username, setUsername } = useContext(QuizContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/result/getResult')
      .then(response => {
        setTestResults(response.data);
        setFilteredResults(response.data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    const filtered = testResults.filter(entry => entry.participant === username &&
      (selectedTopic === 'All' || entry.qtopic === selectedTopic) &&
      (selectedQuizName === 'All' || entry.qname === selectedQuizName)
    );
    setFilteredResults(filtered);
  }, [selectedTopic, selectedQuizName, testResults, username]);

  const topics = [...new Set(testResults.map(entry => entry.qtopic)), 'All'];
  const quizNames = [...new Set(testResults.map(entry => entry.qname)), 'All'];

  const handleLogout = () => {
    setUsername(null);
    navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="custom-profile-container">
      <div className="custom-header">
        <span className="custom-profile-header">Profile</span>
        <div className="custom-user-buttons-container">
          <p className="custom-username"><strong>Username:</strong> {username}</p>
          <div className="custom-buttons">
            <button className="custom-home-button" onClick={handleHome}>Home</button>
            <button className="custom-logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="custom-results-section">
        <h3 className="custom-results-header">Previous Test Results</h3>

        <div className="custom-filter-section">
          <label>Filter by Quiz Topic:</label>
          <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <label>Filter by Quiz Name:</label>
          <select value={selectedQuizName} onChange={e => setSelectedQuizName(e.target.value)}>
            {quizNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="custom-table-wrapper">
          <table className="custom-results-table">
            <thead>
              <tr>
                <th>Quiz Topic</th>
                <th>Quiz Name</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.qtopic}</td>
                  <td>{entry.qname}</td>
                  <td>{entry.mark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
