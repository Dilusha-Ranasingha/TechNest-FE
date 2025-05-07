import { useNavigate } from 'react-router-dom';

function MyLibrary({ progressData }) {
  const navigate = useNavigate();

  const handleContinueQuiz = (tutorialId) => {
    navigate(`/tutorials/quiz/${tutorialId}`);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4">My Library</h3>
      {progressData.length > 0 ? (
        <div className="grid gap-4">
          {progressData.map((item) => (
            <div key={item.tutorialId} className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-xl font-semibold text-cyan-400">{item.title}</h4>
              <p className="text-gray-300">Total Questions: {item.totalQuestions}</p>
              <p className="text-gray-300">Correct Answers: {item.correctAnswers}</p>
              <div className="mt-2">
                <p className="text-gray-300 mb-1">Progress: {item.score}%</p>
                <div className="w-full bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-cyan-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => handleContinueQuiz(item.tutorialId)}
                className="mt-3 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
              >
                Continue Quiz
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">
          You haven't enrolled in any tutorials yet. Go to the{' '}
          <a href="/tutorials" className="text-cyan-400 hover:underline">Tutorials page</a> to enroll!
        </p>
      )}
    </div>
  );
}

export default MyLibrary;