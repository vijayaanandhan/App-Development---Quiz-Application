import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/Quizcontext';
import './LoginComponent.css';
import ICON from '../../Files/ICON.png';

const LoginComponent = ({ onClose }) =>
{
  const [users, setUsers] = useState([]);
  const [loginDetails, setLoginDetails] = useState({ username: '', password: '' });
  const { setUsername } = useContext(QuizContext);
  const navigate = useNavigate();

  useEffect(() => 
  {
    axios.get('http://localhost:8080/user/getUser') 
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleLogin = (e) => 
  {
    e.preventDefault();  
    const foundUsers = users.filter(user => user.username === loginDetails.username);
    //console.log(foundUsers);
    if (foundUsers.length > 0 && foundUsers[0].password === loginDetails.password) 
    {
      setUsername(foundUsers[0].username);
      //alert('Login Successful');
      onClose();
      navigate('/');
    } 
    else if (foundUsers.length > 0) 
    {
      alert('Incorrect Login Details');
    } 
    else 
    {
      alert('User not found. Please Sign Up');
      navigate('/signup');
    }
  };

  const handleInputChange = (e) => 
  {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className='outerdiv'>
      <div className='innerdiv'>
        <div className='innerdiv01'>
        <dotlottie-player 
        src="https://lottie.host/b33e023f-ab2b-45f8-8ac3-9c305dd698a3/wiwRkklPsw.json" 
        background="transparent" 
        speed="1" 
        style={{ width: '300px', height: '300px' }} 
        loop 
        autoplay
      ></dotlottie-player>
      
        </div>
        <div className='innerdiv02'>
        <form onSubmit={handleLogin} className='outerform'>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={loginDetails.username}
            onChange={handleInputChange}
            className='input'
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={loginDetails.password}
            onChange={handleInputChange}
            className='input'
          />
          <button type="submit" className="button-63">Login</button>
        </form>
        <div className='signup-login'>
            <p>Don't have an account?</p> 
            <p className='para'><button className='signup-button' onClick={() => navigate('/signup')}>Sign Up</button></p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;