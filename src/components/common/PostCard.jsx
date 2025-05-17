"use client"

import { useState, useEffect } from "react"
import {
  likePost,
  unlikePost,
  hasUserLikedPost,
  commentPost,
  sharePost,
  getPostComments,
} from "../../services/postService"

const PostCard = ({ post, onUpdate, onDelete }) => {
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)

  useEffect(() => {
    fetchComments()
    checkIfLiked()
  }, [post.id])

  const fetchComments = async () => {
    try {
      const data = await getPostComments(post.id)
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const checkIfLiked = async () => {
    try {
      const liked = await hasUserLikedPost(post.id)
      setHasLiked(liked)
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  const handleLikeToggle = async () => {
    try {
      if (!hasLiked) {
        setIsLikeAnimating(true)
        setTimeout(() => setIsLikeAnimating(false), 1000)
      }

      if (hasLiked) {
        await unlikePost(post.id)
      } else {
        await likePost(post.id)
      }
      setHasLiked(!hasLiked) // Optimistically update the like status
      onUpdate() // Refresh the post list to sync with backend
    } catch (error) {
      console.error("Error toggling like:", error)
      checkIfLiked() // Revert to actual status if the request fails
      onUpdate()
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (comment.trim()) {
      await commentPost(post.id, comment)
      setComment("")
      onUpdate()
      fetchComments()
    }
  }

  const handleShare = async () => {
    await sharePost(post.id)
    onUpdate()
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {post.username ? post.username.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-white">{post.username}</h3>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-cyan-400 mb-2">{post.title}</h2>
        <p className="text-gray-300">{post.description}</p>
      </div>

      {/* Post Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative">
          {post.mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url || "/placeholder.svg"}
              alt="Post media"
              className="w-full object-cover max-h-96"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            {/* YouTube-style Like Button */}
            <button onClick={handleLikeToggle} className="group flex items-center space-x-2 focus:outline-none">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={hasLiked ? "currentColor" : "none"}
                  stroke={hasLiked ? "none" : "currentColor"}
                  className={`w-6 h-6 ${hasLiked ? "text-cyan-500" : "text-gray-400 group-hover:text-gray-300"} transition-colors duration-200`}
                  strokeWidth={hasLiked ? 0 : 1.5}
                >
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
                {isLikeAnimating && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
                  </span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${hasLiked ? "text-cyan-500" : "text-gray-400 group-hover:text-gray-300"} transition-colors duration-200`}
              >
                {post.likeCount || 0}
              </span>
            </button>

            {/* Comment Button */}
            <button onClick={toggleComments} className="group flex items-center space-x-2 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6 text-gray-400 group-hover:text-gray-300 transition-colors duration-200"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                {comments.length || 0}
              </span>
            </button>

            {/* Share Button */}
            <button onClick={handleShare} className="group flex items-center space-x-2 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6 text-gray-400 group-hover:text-gray-300 transition-colors duration-200"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                {post.shareCount || 0}
              </span>
            </button>
          </div>

          {isEditing && onUpdate && (
            <button
              onClick={() => setIsEditing(false)}
              className="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm font-medium"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="flex items-center space-x-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm"
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Post
          </button>
        </form>
      </div>

      {/* Comments Section */}
      {showComments && comments.length > 0 && (
        <div className="p-4 bg-gray-750 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Comments ({comments.length})</h4>
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <p className="text-gray-300 text-sm">{comment.content}</p>
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  <span className="font-medium">{comment.username || "Anonymous"}</span>
                  {comment.createdAt && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard