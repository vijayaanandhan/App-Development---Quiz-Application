import React, { useEffect, useState , useContext} from 'react';
import { FunctionDeclarationSchemaType } from '@google/generative-ai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './QuizAI.css';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/Quizcontext';

const QuizAI = ( props ) => {
    const [questionData, setQuestionData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [error, setError] = useState('');
    const [btnName, setBtnName] = useState("Submit");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [difficulty, setDifficulty] = useState("medium"); // Default difficulty
    const [notification, setNotification] = useState('');
    const [questionsFetched, setQuestionsFetched] = useState(0); // Track total questions fetched
    const [questionsAnswered, setQuestionsAnswered] = useState(0); // Track answered questions
    const [score, setScore] = useState(0); // Score variable
    const [quizEnded, setQuizEnded] = useState(false); // Track if the quiz has ended
    const [noOfQuestions, setNoOfQuestions] = useState(0); // Track the total number of questions
    const [quizSummary, setQuizSummary] = useState([]); // State to store the quiz summary
    const navigate = useNavigate();
    const {username} = useContext(QuizContext);


    const fetchQuestions = async (difficultyLevel, count) => {
        try {
            const genAI = new GoogleGenerativeAI("AIzaSyBi5O3u-lrse3oC_6lT7YZnjgLuxhGuuNU");
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: FunctionDeclarationSchemaType.ARRAY,
                        items: {
                            type: FunctionDeclarationSchemaType.OBJECT,
                            properties: {
                                question: { type: FunctionDeclarationSchemaType.STRING },
                                option1: { type: FunctionDeclarationSchemaType.STRING },
                                option2: { type: FunctionDeclarationSchemaType.STRING },
                                option3: { type: FunctionDeclarationSchemaType.STRING },
                                option4: { type: FunctionDeclarationSchemaType.STRING },
                                correctOption: { type: FunctionDeclarationSchemaType.INTEGER },
                                difficulty: { type: FunctionDeclarationSchemaType.STRING }
                            }
                        }
                    }
                }
            });
    
            const prompt = `Give ${count} questions on ${props.topic} with four options and an integer correct option. Difficulty: ${difficultyLevel}`;
            const result = await model.generateContent(prompt);
    
            const responseText = await result.response.text();
            console.log('Raw Response:', responseText); // Log the raw response for debugging
    
            const parsedResponse = JSON.parse(responseText);
            console.log('Parsed Response:', parsedResponse); // Log the parsed response
    
            setQuestionData(prev => [...prev, ...parsedResponse]); // Append new questions
            setCorrectAnswer(parsedResponse[0].correctOption); // Set the correct answer for the first question
            setQuestionsFetched(prev => prev + count); // Update the count of total questions fetched
    
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again later.');
        }
    };
    

    useEffect(() => {
        if (questionsFetched === 0) {
            fetchQuestions(difficulty, 5); 
        }
    }, [difficulty, questionsFetched]);

    useEffect(() => {
        if (quizEnded) {
            console.log(`Quiz ended. Your final score: ${score}`);
        }
    }, [quizEnded, score]);

    const handleDivClick = (id) => {
        if (btnName === "Submit") {
            setSelectedOption(id);
        }
    };

    const handleResult = () => {
        if (btnName === "Submit") {
            const currentQuestion = questionData[currentQuestionIndex];
    
            // Add the current question details to the summary array
            setQuizSummary(prev => [
                ...prev,
                {
                    question: currentQuestion.question,
                    options: [currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4],
                    correctOption: currentQuestion.correctOption,
                    selectedOption: selectedOption
                }
            ]);
    
            if (selectedOption === correctAnswer) {
                setNotification('Hooray! You are correct!');
                setScore(prev => prev + 1); // Increment the score
                setCorrectAnswersCount(prev => prev + 1);
                setNoOfQuestions(prev => prev +1);
                console.log(`Question ${currentQuestionIndex + 1}: Correct!`);
            } else {
                setNoOfQuestions(prev => prev +1);
                setNotification('Oops! That\'s incorrect.');
                console.log(`Question ${currentQuestionIndex + 1}: Incorrect.`);
            }
            setQuestionsAnswered(prev => prev + 1); // Increment answered questions
            setBtnName("Next");
        } else if (btnName === "Next") {
            if (currentQuestionIndex < questionData.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setCorrectAnswer(questionData[currentQuestionIndex + 1].correctOption);
                setSelectedOption(null);
                setBtnName("Submit");
            } else {
                if (questionsFetched < 10) {
                    analyzePerformance();
                } else {
                    setQuizEnded(true);
                    setBtnName("Home");
                }
            }
        } else if (btnName === "Home"){
            navigate("/")
        }
    };
    

    const analyzePerformance = () => {
        const performanceRatio = correctAnswersCount / 5; // Ratio based on the 5 questions answered
        let newDifficulty = "medium";
        if (performanceRatio === 1) {
            newDifficulty = "advanced";
        } else if (performanceRatio >= 0.6) {
            newDifficulty = "intermediate";
        } else {
            newDifficulty = "basic";
        }

        setDifficulty(newDifficulty);

        setQuestionData([]); // Clear the current set of questions
        fetchQuestions(newDifficulty, 5);
        setCurrentQuestionIndex(0);
        setCorrectAnswersCount(0);
        setBtnName("Submit");
    };

    const printQuizSummary = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Quiz Summary</title></head><body>');
        printWindow.document.write(`<h1>Quiz Summary</h1>`);
        printWindow.document.write(`<p>Username: ${username}</p>`); // Replace 'USERNAME' with the actual username if available
        printWindow.document.write(`<p>Score: ${score}</p>`);
        printWindow.document.write('<ol>');
        
        quizSummary.forEach((q, index) => {
            printWindow.document.write(`<li><strong>Question ${index + 1}:</strong> ${q.question}</li>`);
            printWindow.document.write(`<ul>`);
            printWindow.document.write(`<li>1. ${q.options[0]}</li>`);
            printWindow.document.write(`<li>2. ${q.options[1]}</li>`);
            printWindow.document.write(`<li>3. ${q.options[2]}</li>`);
            printWindow.document.write(`<li>4. ${q.options[3]}</li>`);
            printWindow.document.write(`</ul>`);
            printWindow.document.write(`<p><strong>Correct Option:</strong> ${q.correctOption}</p>`);
            printWindow.document.write(`<p><strong>Your Answer:</strong> ${q.selectedOption}</p>`);
        });
    
        printWindow.document.write('</ol>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };
    
    

    const getDivStyle = (id) => {
        if (btnName === "Submit") {
            return {
                backgroundColor: selectedOption === id ? '#360bab' : '#fefbe9',
                color: selectedOption === id ? '#fff' : '#000',
            };
        } else {
            if (id === correctAnswer) {
                return {
                    backgroundColor: '#28a745', // Green for correct answer
                    color: '#fff',
                };
            } else if (id === selectedOption) {
                return {
                    backgroundColor: '#dc3545', // Red for incorrect answer
                    color: '#fff',
                };
            } else {
                return {
                    backgroundColor: '#fefbe9',
                    color: '#000',
                };
            }
        }
    };

    if (!questionData.length || !questionData[currentQuestionIndex]) {
        return <p>Loading...</p>;
    }

    return (
        <div className='AI_total'>
            {notification && (
                <div className='notification'>
                    {notification}
                </div>
            )}
            <div className='AI_BigDiv'>
                <div className='AI_BigDiv01'>
                    <div className='AI_BigDiv0101'>{questionData[currentQuestionIndex].question}</div>
                </div>

                <div className='AI_BigDiv02'>
                    <div 
                        className='AI_BigDiv0201' 
                        style={getDivStyle(1)} 
                        onClick={() => handleDivClick(1)}
                    >
                        {questionData[currentQuestionIndex].option1}
                    </div>
                    
                    <div 
                        className='AI_BigDiv0201' 
                        style={getDivStyle(2)} 
                        onClick={() => handleDivClick(2)}
                    >
                        {questionData[currentQuestionIndex].option2}
                    </div>
                    
                    <div 
                        className='AI_BigDiv0201' 
                        style={getDivStyle(3)} 
                        onClick={() => handleDivClick(3)}
                    >
                        {questionData[currentQuestionIndex].option3}
                    </div>
                    
                    <div 
                        className='AI_BigDiv0201' 
                        style={getDivStyle(4)} 
                        onClick={() => handleDivClick(4)}
                    >
                        {questionData[currentQuestionIndex].option4}
                    </div>
                </div>

                {noOfQuestions === 10 && (
                    <button 
                        className='quizai-button' 
                        onClick={printQuizSummary}
                        style={{ position: 'absolute', top: '10px', right: '10px' }}
                    >
                        Print
                    </button>
                )}
                
                <button className='button-27' onClick={handleResult}>{btnName}</button>
                
            </div>
        </div>
    );
};

export default QuizAI;
