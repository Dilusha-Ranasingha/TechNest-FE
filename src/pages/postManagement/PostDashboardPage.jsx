"use client"

import { useState, useEffect } from "react"
import { getAllPosts } from "../../services/postService"
import PostCard from "../../components/common/PostCard"
import PostForm from "../../components/post/PostForm"
import { useNavigate } from "react-router-dom"
import "../../styles/postDashboardPageCss.css" // Import your CSS file

const PostDashboardPage = () => {
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getAllPosts()
      setPosts(data.content || data) // Adjust based on Page object structure
      setError(null)
    } catch (err) {
      setError("Failed to fetch posts. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    setShowForm(false)
    fetchPosts()
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-cyan-400 font-semibold">Loading posts...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
          <p className="text-red-400 text-center text-lg font-medium">{error}</p>
          <button
            onClick={fetchPosts}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Post Dashboard
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Post
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl shadow-xl border border-gray-700">
            <PostForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.length === 0 ? (
            <div className="col-span-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-10 text-center border border-gray-700 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-gray-400 text-xl font-medium">No posts available.</p>
              <p className="text-gray-500 mt-2">Create your first post to get started!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <PostCard post={post} onUpdate={fetchPosts} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDashboardPage