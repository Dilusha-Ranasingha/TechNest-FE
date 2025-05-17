"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import {
  getAllPosts,
  createPost,
  addComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "../../services/communityService"

const CommunityPage = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [commentPostId, setCommentPostId] = useState(null)
  const [commentContent, setCommentContent] = useState("")
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentContent, setEditingCommentContent] = useState("")

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line
  }, [])

  const fetchPosts = async () => {
    const response = await getAllPosts(0, 10)
    const postsWithComments = await Promise.all(
      response.content.map(async (post) => {
        const comments = await getCommentsByPostId(post.id)
        // Map userId and username robustly for every comment
        const mappedComments = comments.map((c) => ({
          ...c,
          userId: c.userId ?? c.userid ?? c.user_id ?? c.authorId ?? "", // fallback for various backend keys
          username: c.username ?? c.userEmail ?? c.email ?? c.authorEmail ?? "",
        }))
        return { ...post, comments: mappedComments }
      }),
    )
    setPosts(postsWithComments)
  }

  const handleCreatePost = async (e) => {
  e.preventDefault()

  if (title.trim().length < 5 || title.trim().length > 100) {
    alert("Title must be between 5 and 100 characters")
    return
  }

  if (description.trim().length < 10) {
    alert("Description must be at least 10 characters long")
    return
  }

  await createPost({ title, description })
  setTitle("")
  setDescription("")
  setShowForm(false)
  fetchPosts()
}

  const handleAddComment = async (postId) => {
    if (!commentContent.trim()) return
    try {
      const response = await addComment(postId, { content: commentContent })
      const newComment = {
        ...response,
        userId: user.id,
        username: user.email,
      }
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post)),
      )
      setCommentContent("")
      setCommentPostId(null)
    } catch (err) {
      console.error("Failed to add comment:", err)
    }
  }

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId)
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c.id !== commentId),
              }
            : post,
        ),
      )
    } catch (err) {
      console.error("Failed to delete comment:", err)
    }
  }

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId)
    setEditingCommentContent(content)
  }

  const handleUpdateComment = async (commentId, postId) => {
    if (!editingCommentContent.trim()) return
    try {
      await updateComment(commentId, { content: editingCommentContent })
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((c) => (c.id === commentId ? { ...c, content: editingCommentContent } : c)),
              }
            : post,
        ),
      )
      setEditingCommentId(null)
      setEditingCommentContent("")
    } catch (err) {
      console.error("Failed to update comment:", err)
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingCommentContent("")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-100">Community Q&A</h1>
        {user && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition duration-200"
          >
            Ask Question
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-4 bg-gray-750 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100">Ask a Question</h2>
          </div>
          <form onSubmit={handleCreatePost} className="p-5">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question? Be specific."
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details and any context that might help others understand your question"
                rows={6}
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition duration-200"
              >
                Post Your Question
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-100 mb-3">{post.title}</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">{post.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-700 flex items-center text-sm text-gray-400">
                <span className="inline-flex items-center">
                  <span className="font-medium mr-1">Asked by:</span> {post.username}
                </span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-gray-750 p-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-200">
                  {post.comments?.length || 0} {post.comments?.length === 1 ? "Answer" : "Answers"}
                </h4>
                {user && commentPostId !== post.id && (
                  <button
                    onClick={() => setCommentPostId(post.id)}
                    className="text-blue-400 hover:text-blue-300 transition text-sm font-medium"
                  >
                    Add Answer
                  </button>
                )}
              </div>

              {post.comments?.length > 0 ? (
                <div className="space-y-4">
                  {post.comments.map((comment) => {
                    // Always use String() for comparison to avoid type mismatch
                    const isOwnComment = user && String(comment.userId) === String(user.id)
                    return (
                      <div key={comment.id} className="bg-gray-800 rounded-md p-4 border border-gray-700">
                        {editingCommentId === comment.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editingCommentContent}
                              onChange={(e) => setEditingCommentContent(e.target.value)}
                              className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              rows={4}
                            />
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleUpdateComment(comment.id, post.id)}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition duration-200"
                              >
                                Update
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition duration-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="prose prose-invert max-w-none">
                              <p>{comment.content}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-gray-700 flex justify-between items-center text-sm">
                              <div className="text-gray-400">
                                <span className="inline-flex items-center">
                                  <span className="font-medium mr-1">Answered by:</span> {comment.username}
                                </span>
                                <span className="mx-2">•</span>
                                <span>{new Date(comment.createdAt).toLocaleString()}</span>
                              </div>

                              {isOwnComment && (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => handleEditComment(comment.id, comment.content)}
                                    className="text-blue-400 hover:text-blue-300 transition text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment.id, post.id)}
                                    className="text-red-400 hover:text-red-300 transition text-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-md p-4 text-center border border-gray-700">
                  <p className="text-gray-400">No answers yet. Be the first to answer!</p>
                </div>
              )}

              {commentPostId === post.id && (
                <div className="mt-4 bg-gray-800 rounded-md p-4 border border-gray-700">
                  <h5 className="font-medium text-gray-200 mb-2">Your Answer</h5>
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Share your knowledge or experience..."
                    rows={4}
                    className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition mb-3"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
                    >
                      Post Answer
                    </button>
                    <button
                      onClick={() => setCommentPostId(null)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400 text-lg">No questions have been asked yet.</p>
            <p className="text-gray-500 mt-2">Be the first to ask a question!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityPage