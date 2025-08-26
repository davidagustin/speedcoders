"use client";

import React, { useState, useEffect } from "react";
import { UserGroupIcon, ChatBubbleLeftRightIcon, ShareIcon, HeartIcon, BookmarkIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

interface Post {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export default function SocialHub() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/social/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        // Mock data for demonstration
        setPosts([
          {
            id: "1",
            userId: "user1",
            username: "CodeMaster",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            content: "Just solved a challenging dynamic programming problem! The key insight was recognizing the optimal substructure. Anyone else working on DP problems?",
            likes: 24,
            comments: 8,
            shares: 3,
            timestamp: "2 hours ago",
            isLiked: false,
            isBookmarked: false
          },
          {
            id: "2",
            userId: "user2",
            username: "AlgoWizard",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            content: "Tips for mastering graph algorithms: 1) Always draw the graph first 2) Consider edge cases 3) Think about time complexity before coding. What's your favorite graph algorithm?",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop",
            likes: 42,
            comments: 15,
            shares: 7,
            timestamp: "5 hours ago",
            isLiked: true,
            isBookmarked: true
          },
          {
            id: "3",
            userId: "user3",
            username: "DataStructPro",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
            content: "Completed the advanced data structures course! Binary trees, heaps, and tries are now my best friends. Ready to tackle more complex problems! 🚀",
            likes: 18,
            comments: 5,
            shares: 2,
            timestamp: "1 day ago",
            isLiked: false,
            isBookmarked: false
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: "POST",
      });
      
      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
            : post
        ));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/bookmark`, {
        method: "POST",
      });
      
      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, isBookmarked: !post.isBookmarked }
            : post
        ));
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/share`, {
        method: "POST",
      });
      
      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, shares: post.shares + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await fetch("/api/social/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newPost }),
      });

      if (response.ok) {
        const newPostData = await response.json();
        setPosts(prev => [newPostData.post, ...prev]);
        setNewPost("");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="ml-3">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Social Hub</h1>
          </div>
          <p className="text-gray-600">Connect with fellow coders and share your learning journey</p>
        </div>

        {/* Create Post */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-start space-x-4">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Your avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your coding journey, ask questions, or discuss algorithms..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <ShareIcon className="h-4 w-4" />
                    <span>Add Image</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    <span>Add Code</span>
                  </button>
                </div>
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow">
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.avatar}
                      alt={post.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.username}</h3>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <p className="text-gray-900 mb-4">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full rounded-lg mb-4"
                  />
                )}
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 ${
                        post.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <HeartIcon className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-600"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      <span>{post.comments}</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-600"
                    >
                      <ShareIcon className="h-5 w-5" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`p-2 rounded-full ${
                      post.isBookmarked 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <BookmarkIcon className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {selectedPost === post.id && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                        alt="Your avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    {/* Sample Comments */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                          alt="User avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">AlgoWizard</p>
                            <p className="text-sm text-gray-700">Great insight! I've been working on similar problems. The key is definitely recognizing the pattern.</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <button className="hover:text-blue-600">Like</button>
                            <button className="hover:text-blue-600">Reply</button>
                            <span>2 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to share your coding journey!</p>
          </div>
        )}
      </div>
    </div>
  );
}
