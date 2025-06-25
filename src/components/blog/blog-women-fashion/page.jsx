"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Share2, Bookmark, Clock } from 'lucide-react';

const RSS_FEED_URL = "https://timesofindia.indiatimes.com/rssfeedstopstories.cms";

const NewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      setLoading(true);

      try {
        const response = await fetch(RSS_FEED_URL);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

        const items = Array.from(xml.querySelectorAll("item")).map((item) => ({
          title: item.querySelector("title")?.textContent || "No Title",
          description: item.querySelector("description")?.textContent.replace("<![CDATA[", "").replace("]]>", "") || "No Description",
          urlToImage: item.querySelector("enclosure")?.getAttribute("url") || "https://via.placeholder.com/600x400",
          link: item.querySelector("link")?.textContent || "#",
          source: { name: "Times of India" },
          publishedAt: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
        }));

        setArticles(items || []);
      } catch (error) {
        console.error("Error fetching RSS feed:", error);
        setArticles([]); // Ensure articles is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchRSSFeed();
  }, []);

  const handleSwipe = (direction) => {
    if (direction === 'left' && currentArticleIndex < articles.length - 1) {
      setCurrentArticleIndex(currentArticleIndex + 1);
    } else if (direction === 'right' && currentArticleIndex > 0) {
      setCurrentArticleIndex(currentArticleIndex - 1);
    }
  };

  const formatTime = (dateString) => {
    const now = new Date();
    const publishTime = new Date(dateString);
    const diffHours = Math.floor((now - publishTime) / (1000 * 60 * 60));
    return diffHours < 1 ? 'Just now' : `${diffHours}h ago`;
  };

  const handleTouchStart = (e) => {
    e.target.dataset.startX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const startX = parseFloat(e.target.dataset.startX);
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (diffX > 50) {
      handleSwipe('right');
    } else if (diffX < -50) {
      handleSwipe('left');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md w-full">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Women&apos;s Fashion & Health News
          </h1>
          <p className="text-xs text-gray-500">Swipe to explore stories</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        {loading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading stories...</p>
          </div>
        ) : articles.length > 0 ? (
          <div
            className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <img
              src={articles[currentArticleIndex]?.urlToImage || 'https://via.placeholder.com/600x400'}
              alt={articles[currentArticleIndex]?.title || 'No Image'}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur-md rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-800 mb-2">{articles[currentArticleIndex]?.title || 'No Title'}</h2>
              <p className="text-sm text-gray-600 mb-4">{articles[currentArticleIndex]?.description || 'No Description'}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{articles[currentArticleIndex]?.source?.name || 'RSS Feed'}</span>
                <span>
                  <Clock className="w-3 h-3 inline-block mr-1" />
                  {formatTime(articles[currentArticleIndex]?.publishedAt || new Date())}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button className="flex items-center space-x-1 text-gray-400 hover:text-pink-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-purple-500 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">No stories available</p>
          </div>
        )}
      </main>

      {/* Swipe Navigation */}
      <footer className="flex items-center justify-between w-full max-w-md px-4 py-4">
        <button
          onClick={() => handleSwipe('right')}
          disabled={currentArticleIndex === 0}
          className={`px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition ${
            currentArticleIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => handleSwipe('left')}
          disabled={currentArticleIndex === articles.length - 1}
          className={`px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition ${
            currentArticleIndex === articles.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </footer>

      <style jsx>{`
        @media (max-width: 768px) {
          header {
            font-size: 14px;
          }
          h1 {
            font-size: 18px;
          }
          main {
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsApp;