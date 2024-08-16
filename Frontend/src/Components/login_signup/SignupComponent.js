import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/Quizcontext';
import './SignupComponent.css';
import ICON from '../../Files/ICON.png';

export default function SignupComponent() {
  const [signupDetails, setSignupDetails] = useState({});
  const navigate = useNavigate();
  const { setUsername } = useContext(QuizContext); 

  const checkUserExists = async (username) => {
    try {
      const response = await axios.get('http://localhost:8080/user/getUser');
      return response.data.some(user => user.username === username);
    } catch (error) {
      console.error('Error fetching users:', error);
      return false;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const userExists = await checkUserExists(signupDetails.username);
    if (userExists) {
      alert('User already exists. Redirecting to login...');
      navigate('/login');
      return;
    }

    axios.post('http://localhost:8080/user/insertUser', signupDetails)
      .then(response => {
        alert('Signup successful:');
        setUsername(signupDetails.username); 
        navigate('/'); 
      })
      .catch(error => {
        console.error('Signup error:', error);
      });
  };

  const handleInputChange = (e) => {
    setSignupDetails({ ...signupDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className='S-outerdiv'>
      <dotlottie-player
       src="https://lottie.host/c518b4f8-6e96-4160-b5c6-1bf7486b103b/V24eKkOrYV.json"
       background="transparent"
       speed="1"
       style={{ width: '210vh', height: '100vh' }}
       loop
       autoplay
       ></dotlottie-player>
      <div className='S-innerdiv'>
        <div className='S-innerdiv01'>
          <img src={ICON} alt='icon' className='S-imgsrc' />
        </div>
        <div className='S-innerdiv02'>
          <form onSubmit={handleSignup} className='S-outerform'>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={signupDetails.username}
              onChange={handleInputChange}
              className='S-input'
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={signupDetails.password}
              onChange={handleInputChange}
              className='S-input'
            />
            <button type="submit" className='S-button-63'>Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}