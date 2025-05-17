import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function TutorialCard({ tutorial, userRole, onDelete, onEnroll, onUnenroll, isEnrolled }) {
  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(tutorial.id);
        Swal.fire('Deleted!', 'Tutorial has been deleted.', 'success');
      }
    });
  };

  const handleEnroll = () => {
    onEnroll(tutorial.id);
  };

  const handleUnenroll = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be unenrolled from this tutorial!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, unenroll!',
    }).then((result) => {
      if (result.isConfirmed) {
        onUnenroll(tutorial.id);
        Swal.fire('Unenrolled!', 'You have been unenrolled from the tutorial.', 'success');
      }
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
      <h3 className="text-xl font-semibold text-cyan-400">{tutorial.title}</h3>
      <p className="text-gray-300 mt-2">{tutorial.description || 'No description available'}</p>
      <div className="mt-4 flex space-x-3">
        {userRole === 'ADMIN' ? (
          <>
            <Link
              to={`/tutorials/edit/${tutorial.id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            <Link
              to={`/tutorials/manage-mcqs/${tutorial.id}`}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Manage MCQs
            </Link>
          </>
        ) : (
          <>
            {isEnrolled ? (
              <>
                <Link
                  to={`/tutorials/quiz/${tutorial.id}`}
                  className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                >
                  Take Quiz
                </Link>
                <button
                  onClick={handleUnenroll}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Unenroll
                </button>
              </>
            ) : (
              <button
                onClick={handleEnroll}
                className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
              >
                Enroll
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TutorialCard;