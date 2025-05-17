"use client"

import { useState, useEffect } from "react"
import { getUserPosts, deletePost } from "../../services/postService"
import PostCard from "../../components/common/PostCard"
import PostForm from "../../components/post/PostForm"
import "../../styles/userPostPageCss.css" // Import your CSS file

const UserPostsPage = () => {
  const [posts, setPosts] = useState([])
  const [editingPost, setEditingPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getUserPosts()
      setPosts(data.content || data) // Adjust based on Page object structure
      setError(null)
    } catch (err) {
      setError("Failed to fetch your posts. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    setEditingPost(null)
    fetchPosts()
  }

  const handleDelete = async (id) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure do you want to delete this post?")) {
      try {
        // Optimistically remove the post from the state
        setPosts(posts.filter((post) => post.id !== id))
        await deletePost(id)
        fetchPosts() // Sync with backend to ensure consistency
      } catch (error) {
        console.error("Failed to delete post:", error)
        // Restore the post if deletion fails
        fetchPosts()
        alert(`Failed to delete the post (ID: ${id}). Please try again. Server error: ${error.message}`)
      }
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-cyan-400 font-semibold">Loading your posts...</p>
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
            My Posts
          </h1>
          <div className="text-gray-400 text-sm">
            {posts.length} {posts.length === 1 ? "post" : "posts"} found
          </div>
        </div>

        {editingPost && (
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl shadow-xl border border-gray-700">
            <PostForm post={editingPost} onSave={handleSave} onCancel={() => setEditingPost(null)} />
          </div>
        )}

        {posts.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-10 text-center border border-gray-700 shadow-lg">
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
            <p className="text-gray-400 text-xl font-medium">You haven't created any posts yet.</p>
            <p className="text-gray-500 mt-2">Your posts will appear here once you create them.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                <PostCard post={post} onUpdate={fetchPosts} />
                <div className="p-4 bg-gray-750 border-t border-gray-700 flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPostsPage