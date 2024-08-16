import React, { useEffect, useState, useContext } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import './CreateQuiz.css';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/Quizcontext';
import confetti from 'canvas-confetti';


const CreateQuizVoiceAssistance = ({
  sentence1,
  option1,
  option2,
  option3,
  option4,
  onCheckboxChange,
  resetCheckbox = () => {},
  quizTopic,
  quizName,
  correctOption,
  clearSelection,
  clearTranscript,
  setChoosed,
}) => {
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [listeningTimeout, setListeningTimeout] = useState(null);
  const {setMark} = useContext(QuizContext);

  const handleCheckboxChange = (id) => {
    if (id !== null) {
      setSelectedCheckbox(id);
      onCheckboxChange(id);
      setChoosed(id);
    }
  };

  
  const stopListeningAndSubmit = (id) => {
    clearTimeout(listeningTimeout); // Clear the listening timeout if a valid response is given
    SpeechRecognition.stopListening();
    submitAnswer(id);
  };

  const submitAnswer = (id) => {
    resetTranscript(); // Clear the transcript when an option is selected
  
    const correctOptionValue = [option1, option2, option3, option4][parseInt(correctOption) - 1];
    const isCorrect = parseInt(id) === parseInt(correctOption); // Ensure both are integers
    let feedback = isCorrect
      ? 'Hurray, the answer is correct'
      : `Oops, the answer is wrong. The correct option is ${correctOption} ${correctOptionValue}`;
  
    const feedbackSpeech = new SpeechSynthesisUtterance(`${feedback}. Moving to the next question.`);
    feedbackSpeech.lang = 'en-India'; // Set language to English - India
    feedbackSpeech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Mark - English (United States)');
    window.speechSynthesis.speak(feedbackSpeech);
  
    feedbackSpeech.onend = () => {
      if (isCorrect) {
        // Trigger confetti effect if the answer is correct
        confetti();
        setMark(prev=>prev+1);
      }
      resetCheckbox();
      setSelectedCheckbox(null);
    };
  };
  

  const startVoiceRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support voice recognition.');
      return;
    }

    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });

    const timeout = setTimeout(() => {
      SpeechRecognition.stopListening();

      if (!selectedCheckbox) {
        resetTranscript();
        const feedbackSpeech = new SpeechSynthesisUtterance('Recording stopped. You did not choose any option. Moving to the next question.');
        feedbackSpeech.lang = 'en-India';
        feedbackSpeech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Mark - English (United States)');
        window.speechSynthesis.speak(feedbackSpeech);

        feedbackSpeech.onend = () => {
          resetCheckbox();
          setSelectedCheckbox(null);
        };
      }
    }, 15000); // 15 seconds

    setListeningTimeout(timeout);
  };

  const handleTextToSpeech = () => {
    const speech = new SpeechSynthesisUtterance(sentence1);
    speech.lang = 'en-India'; 
    speech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Mark - English (United States)');
    window.speechSynthesis.speak(speech);

    speech.onend = () => {
      setTimeout(() => {
        const optionsSpeech = new SpeechSynthesisUtterance(`Option 1: ${option1}. Option 2: ${option2}. Option 3: ${option3}. Option 4: ${option4}.`);
        optionsSpeech.lang = 'en-India';
        optionsSpeech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Mark - English (United States)');
        window.speechSynthesis.speak(optionsSpeech);

        optionsSpeech.onend = () => {
          setTimeout(() => {
            setCountdown(2);
            const countdownInterval = setInterval(() => {
              setCountdown((prevCount) => {
                if (prevCount === 1) {
                  clearInterval(countdownInterval);
                  return null;
                }
                return prevCount - 1;
              });
            }, 1000);

            setTimeout(() => {
              const recordingSpeech = new SpeechSynthesisUtterance('Recording started.');
              recordingSpeech.lang = 'en-India';
              recordingSpeech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Mark - English (United States)');
              window.speechSynthesis.speak(recordingSpeech);

              recordingSpeech.onend = () => startVoiceRecognition();
            }, 2000); // 2 seconds after countdown ends, start recording
          }, 500); // 500ms delay before starting countdown
        };
      }, 500); // 500ms delay after question is spoken before options are spoken
    };
  };

  const handleIncorrectCommand = () => {
    clearTimeout(listeningTimeout); // Clear the current timeout
    SpeechRecognition.stopListening();

    const errorSpeech = new SpeechSynthesisUtterance('Your option did not match. Try again.');
    errorSpeech.lang = 'en-India';
    errorSpeech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Mark - English (United States)');
    window.speechSynthesis.speak(errorSpeech);

    errorSpeech.onend = () => {
      setTimeout(() => {
        handleTextToSpeech(); // Restart reading the question and options after error message
      }, 1000); // 1 second delay before restarting text to speech
    };
  };

  const commands = [
    {
      command: ['option 1','option1','option one','optionone'],
      callback: () => {
        handleCheckboxChange(1);
        stopListeningAndSubmit(1);
      },
    },
    {
      command: ['option 2','option2','option two','optiontwo', 'optionto', 'option to'],
      callback: () => {
        handleCheckboxChange(2);
        stopListeningAndSubmit(2);
      },
    },
    {
      command: ['option 3','option3','option three','optionthree'],
      callback: () => {
        handleCheckboxChange(3);
        stopListeningAndSubmit(3);
      },
    },
    {
      command: ['option 4','option4','option four','optionfour','option for', 'optionfor'],
      callback: () => {
        handleCheckboxChange(4);
        stopListeningAndSubmit(4);
      },
    },
    {
      command: 'again',
      callback: () => {
        clearTimeout(listeningTimeout); // Stop the timer
        SpeechRecognition.stopListening(); // Stop the current listening
        handleTextToSpeech(); // Restart reading the question and options
      },
    },
  ];

  const {
    listening,
    resetTranscript,
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    commands,
    onNoMatch: handleIncorrectCommand, // Callback for when no command matches the transcript
  });

  useEffect(() => {
    if (sentence1 && option1 && option2 && option3 && option4) {
      clearSelection();
      clearTranscript();
      handleTextToSpeech(); // Initiate the process when the question and options are available
    }

    return () => {
      clearTimeout(listeningTimeout); // Clean up the timeout when the component is unmounted or re-rendered
    };
  }, [sentence1, option1, option2, option3, option4]);

  return (
    <div className='total'>
      <h1 className='quiz-header'>{quizTopic}</h1>
      <h1 className='quiz-subheader'>{quizName}</h1>

      {countdown !== null && (
        <div className='voice-countdown'>
          {countdown}
        </div>
      )}

      <div className='BigDiv'>
        <div className='BigDiv01'>
          <div></div>
          <div className='BigDiv0101'>{sentence1}</div>
        </div>
        <div className='BigDiv02'>
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`BigDiv0201 ${selectedCheckbox === num ? 'selected' : ''}`}
              onClick={() => handleCheckboxChange(num)}
            >
              <div className='BigDiv020101'>{[option1, option2, option3, option4][num - 1]}</div>
            </div>
          ))}
        </div>
      </div>

      {listening && <div className="listening-indicator">Listening...</div>}
      <div className="transcript-log">Transcript: {transcript}</div>
    </div>
  );
};

const QuizWithQuestionList = () => {
  const [index, setIndex] = useState(0);
  const [questionList, setQuestionList] = useState([]);
  const [choosed, setChoosed] = useState(null);
  const [score, setScore] = useState(0);
  const { quizName, quizTopic, quizId ,mark,setMark} = useContext(QuizContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/quiz/getQuiz')
      .then(response => {
        const filteredQuiz = response.data.find(quiz => quiz.quizId === quizId);
        if (filteredQuiz) {
          setQuestionList(filteredQuiz.questions);
        }
      })
      .catch(error => console.error('Error:', error));
  }, [quizId]);

  
    const handleSelectedCheck = (id) => {
      setChoosed(id);
    };
  
    const handleNext = () => {
  
      if (choosed !== null && parseInt(choosed) === parseInt(questionList[index]?.correctOption)) {
        setScore(prevScore => {
          const newScore = prevScore + 1;
          console.log('New Score:', newScore); // Debugging the score update
          return newScore;
        });
      }
  
      setChoosed(null);
      SpeechRecognition.stopListening();
      
      if (index < questionList.length - 1) {
        setIndex(prevIndex => prevIndex + 1);
      } else {
        endQuiz();
      }
    };
  

  const endQuiz = () => {
    const completionSpeech = new SpeechSynthesisUtterance(`Congratulations, You have completed the quiz. Your score is ${mark} out of ${questionList.length}. Redirecting to the home page.`);
    completionSpeech.lang = 'en-India';
    setMark(0);
    completionSpeech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Mark - English (United States)');
    window.speechSynthesis.speak(completionSpeech);

    completionSpeech.onend = () => {
      navigate('/'); // Redirect to the home page
    };
  };

  return (
    <div>
      {questionList.length > 0 ? (
        <CreateQuizVoiceAssistance
          quizName={quizName}
          quizTopic={quizTopic}
          sentence1={questionList[index]?.question}
          option1={questionList[index]?.option1}
          option2={questionList[index]?.option2}
          option3={questionList[index]?.option3}
          option4={questionList[index]?.option4}
          onCheckboxChange={handleSelectedCheck}
          resetCheckbox={handleNext}
          clearSelection={() => setChoosed(null)}
          clearTranscript={SpeechRecognition.stopListening}
          correctOption={questionList[index]?.correctOption}
          setChoosed={setChoosed}
        />
      ) : (
        <div>Loading questions...</div>
      )}
    </div>
  );
};

export default QuizWithQuestionList;