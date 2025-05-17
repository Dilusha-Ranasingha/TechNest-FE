"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { getUserPosts, updatePost, deletePost } from "../../services/communityService"

const ManageCommunityPostsPage = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [editingPostId, setEditingPostId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const response = await getUserPosts(0, 10)
    setPosts(response.content)
  }

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId)
      setPosts(posts.filter((post) => post.id !== postId))
    }
  }

  const handleEditClick = (post) => {
    setEditingPostId(post.id)
    setEditTitle(post.title)
    setEditDescription(post.description)
  }

  const handleUpdatePost = async (postId) => {
  const trimmedTitle = editTitle.trim()
  const trimmedDescription = editDescription.trim()

  if (trimmedTitle.length < 5 || trimmedTitle.length > 100) {
    alert("Title must be between 5 and 100 characters.")
    return
  }

  if (trimmedDescription.length < 10) {
    alert("Description must be at least 10 characters.")
    return
  }

  await updatePost(postId, {
    title: trimmedTitle,
    description: trimmedDescription,
  })

  setEditingPostId(null)
  fetchPosts()
}

  const handleCancelEdit = () => {
    setEditingPostId(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100 border-b border-gray-700 pb-4">Manage My Community Posts</h1>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
              <div className="p-5">
                {editingPostId === post.id ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                        rows={6}
                        className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => handleUpdatePost(post.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200 flex items-center"
                      >
                        Update
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-100 mb-2">{post.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none mt-3">
                      <p className="text-gray-300">{post.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-700 flex items-center text-sm text-gray-400">
                      <span className="inline-flex items-center">
                        <span className="font-medium mr-1">Posted by:</span> {post.username}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <p className="text-gray-400 text-lg">You haven't created any posts yet.</p>
          <p className="text-gray-500 mt-2">Posts you create will appear here.</p>
        </div>
      )}
    </div>
  )
}

export default ManageCommunityPostsPage