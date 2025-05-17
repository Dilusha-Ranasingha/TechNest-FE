"use client"

import { useState } from "react"
import { createPost, updatePost } from "../../services/postService"

const PostForm = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title || "")
  const [description, setDescription] = useState(post?.description || "")
  const [mediaFiles, setMediaFiles] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileNames, setFileNames] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const postData = { title, description, mediaFiles }
    try {
      if (post) {
        await updatePost(post.id, postData)
      } else {
        await createPost(postData)
      }
      onSave()
      if (onCancel) onCancel()
    } catch (error) {
      console.error("Error saving post:", error)
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files) || null
    setMediaFiles(files)
    setFileNames(files ? files.map((file) => file.name) : [])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setMediaFiles(files)
    setFileNames(files.map((file) => file.name))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">{post ? "Edit Post" : "Create New Post"}</h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
          maxLength={100}
          required
        />
        <div className="text-right text-xs text-gray-400 mt-1">{title.length}/100</div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share more details..."
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
          rows={5}
          maxLength={1000}
          required
        />
        <div className="text-right text-xs text-gray-400 mt-1">{description.length}/1000</div>
      </div>

      <div
        className={`mb-6 border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-cyan-500 bg-cyan-500/10" : "border-gray-600 hover:border-gray-500"
        } transition-all duration-300`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mx-auto text-gray-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <label htmlFor="media-upload" className="block">
          <span className="text-gray-300 font-medium">Drag images here or click to upload</span>
          <input
            id="media-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </label>
        {fileNames.length > 0 && (
          <div className="mt-3 text-left">
            <p className="text-sm font-medium text-gray-300 mb-1">Selected files:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              {fileNames.map((name, index) => (
                <li key={index} className="truncate">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
        >
          {post ? "Update" : "Publish"} Post
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default PostForm