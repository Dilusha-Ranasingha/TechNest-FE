import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

function Quiz() {
  const { tutorialId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]); // Store user answers and feedback

  useEffect(() => {
    if (!user || user.role !== 'USER') {
      navigate('/user/login');
      return;
    }

    const fetchTutorial = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/quizzes/tutorials/${tutorialId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTutorial(response.data);
      } catch (error) {
        Swal.fire({
          title: 'Failed to load tutorial',
          icon: 'error',
          draggable: true
        });
        navigate('/tutorials');
      }
    };

    fetchTutorial();
  }, [user, tutorialId, navigate]);

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) {
      Swal.fire({
        title: 'Please select an answer',
        icon: 'warning',
        draggable: true
      });
      return;
    }

    try {
      const mcq = tutorial.mcqs[currentQuestion];
      await axios.post(`http://localhost:8080/api/user/quizzes/mcqs/${mcq.id}/answer`, {
        mcqId: mcq.id,
        userAnswer: selectedAnswer
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      const isCorrect = selectedAnswer === mcq.correctAnswer;
      setAnswers(prev => [...prev, { question: mcq.question, selectedAnswer, isCorrect }]);

      if (currentQuestion + 1 < tutorial.mcqs.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
      } else {
        Swal.fire({
          title: 'Quiz Completed!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          draggable: true
        });
        navigate('/dashboard');
      }
    } catch (error) {
      Swal.fire({
        title: 'Failed to submit answer',
        icon: 'error',
        draggable: true
      });
    }
  };

  const handleSaveAndExit = async () => {
    try {
      // No need to send data explicitly; backend tracks via UserAnswer
      navigate('/dashboard');
      Swal.fire({
        title: 'Progress Saved!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        draggable: true
      });
    } catch (error) {
      Swal.fire({
        title: 'Failed to save progress',
        icon: 'error',
        draggable: true
      });
    }
  };

  if (!tutorial) {
    return <div className="container mx-auto p-8 text-gray-400">Loading...</div>;
  }

  const mcq = tutorial.mcqs[currentQuestion];

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">{tutorial.title} - Quiz</h2>
      <button
        onClick={handleSaveAndExit}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Save & Exit
      </button>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">
          Question {currentQuestion + 1} of {tutorial.mcqs.length}
        </h3>
        <p className="text-gray-300 mb-4">{mcq.question}</p>
        <div className="space-y-3">
          {mcq.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`option-${index}`}
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="mr-2"
              />
              <label htmlFor={`option-${index}`} className="text-gray-300">{option}</label>
            </div>
          ))}
        </div>
        <button
          onClick={handleAnswerSubmit}
          className="mt-6 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
        >
          Submit Answer
        </button>
      </div>
      {/* Display previous answers */}
      {answers.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">Your Answers</h3>
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300"><strong>Question:</strong> {answer.question}</p>
                <p className="text-gray-300"><strong>Your Answer:</strong> {answer.selectedAnswer}</p>
                <p className={`text-${answer.isCorrect ? 'green' : 'red'}-500`}>
                  {answer.isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;