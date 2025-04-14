import React, { useEffect, useState } from 'react';

const quizData = [
    {
        question: 'What does HTML stand for?',
        options: [
          'Hyper Trainer Marking Language',
          'Hyper Text Marketing Language',
          'Hyper Text Markup Language',
          'Hyper Transfer Markup Language'
        ],
        answer: 3,
      },
      {
        question: 'Which data structure uses the FIFO (First In, First Out) principle?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        answer: 2,
      },
      {
        question: 'Which language is primarily used for styling web pages?',
        options: ['HTML', 'Python', 'CSS', 'Java'],
        answer: 3,
      },
      {
        question: 'What is the default port number for HTTP?',
        options: ['21', '80', '443', '22'],
        answer: 2,
      },
      {
        question: 'Which of the following is not a programming language?',
        options: ['Python', 'HTML', 'Java', 'C++'],
        answer: 2,
      },
      {
        question: 'What does SQL stand for?',
        options: [
          'Structured Question Language',
          'Strong Query Language',
          'Structured Query Language',
          'Simple Query List'
        ],
        answer: 3,
      },
];

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

const AudioQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Start quiz only once when the component is mounted
    startQuiz();
  }, []); // Empty dependency array to ensure this runs only once when the component mounts

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!quizStarted || quizEnded || showAnswer) return;
      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const selected = parseInt(key);
        const correct = quizData[currentQuestion].answer;
        setSelectedOption(selected);
        setShowAnswer(true);

        if (selected === correct) {
          setScore((prev) => prev + 1);
          speak('Correct answer.');
        } else {
          speak('Wrong answer.');
        }

        setTimeout(() => {
          if (currentQuestion + 1 < quizData.length) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedOption(null);
            setShowAnswer(false);
          } else {
            setQuizEnded(true);
            speak(`Quiz ended. Your final score is ${score + (selected === correct ? 1 : 0)} out of ${quizData.length}`);
          }
        }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quizStarted, currentQuestion, quizEnded, showAnswer, score]);

  useEffect(() => {
    if (quizStarted && !quizEnded) {
      const question = quizData[currentQuestion];
      const textToSpeak = `Question ${currentQuestion + 1}. ${question.question}. Options are: 1. ${question.options[0]}, 2. ${question.options[1]}, 3. ${question.options[2]}, 4. ${question.options[3]}. Press the number key for your answer.`;
      speak(textToSpeak);
    }
  }, [currentQuestion, quizStarted, quizEnded]);

  const startQuiz = () => {
    setQuizStarted(true);
    const intro = `Welcome to the audio quiz. You will hear a question and four options. To answer, press 1 for the first option, 2 for second, and so on. Let's begin.`;
    speak(intro);
    setTimeout(() => {
      const question = quizData[0];
      const textToSpeak = `Question 1. ${question.question}. Options are: 1. ${question.options[0]}, 2. ${question.options[1]}, 3. ${question.options[2]}, 4. ${question.options[3]}. Press the number key for your answer.`;
      speak(textToSpeak);
    }, 9000);
  };

  const current = quizData[currentQuestion];
  const isCorrect = selectedOption === current?.answer;

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(to bottom, #4e00c2, #000000)',
      color: 'white',
      padding: '20px',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      {!quizStarted ? (
        <button onClick={startQuiz} style={{
          backgroundColor: 'orange',
          border: 'none',
          padding: '10px 20px',
          fontSize: '1.2rem',
          borderRadius: '12px',
          color: 'white',
          cursor: 'pointer'
        }}>
          Start Quiz
        </button>
      ) : quizEnded ? (
        <div>
          <h2>Quiz Completed</h2>
          <p>Your Score: {score} / {quizData.length}</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '20px',
          borderRadius: '20px',
          maxWidth: '500px',
          margin: 'auto'
        }}>
          <div style={{ marginBottom: '10px' }}>Question {currentQuestion + 1} of {quizData.length}</div>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '4px solid orange',
            margin: '10px auto',
            lineHeight: '60px',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>20</div>
          <h2 style={{ color: 'orange' }}>Question {currentQuestion + 1}</h2>
          <p style={{ color: '#aaaaaa' }}>General Quiz</p>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>"{current.question}"</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {current.options.map((opt, idx) => {
              const index = idx + 1;
              let backgroundColor = '#2c2c2c';
              if (showAnswer) {
                if (index === selectedOption) {
                  backgroundColor = index === current.answer ? 'green' : 'orange';
                } else if (index === current.answer) {
                  backgroundColor = 'green';
                }
              }
              return (
                <div key={idx} style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor,
                  color: 'white',
                  cursor: 'default',
                  border: showAnswer && index === selectedOption && index !== current.answer ? '2px solid red' : 'none'
                }}>
                  {opt}
                </div>
              );
            })}
          </div>
          {showAnswer && currentQuestion + 1 < quizData.length && (
            <button onClick={() => {
              setCurrentQuestion(currentQuestion + 1);
              setShowAnswer(false);
              setSelectedOption(null);
            }} style={{
              backgroundColor: 'orange',
              border: 'none',
              padding: '10px 20px',
              marginTop: '20px',
              fontSize: '1.2rem',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer'
            }}>Next</button>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioQuiz;
