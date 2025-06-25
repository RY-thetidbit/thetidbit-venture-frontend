"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Share2, Bookmark, Clock } from 'lucide-react';
import HamsterLoader from "../../shared/HamsterLoader";

const PROXY_URL = "https://api.allorigins.win/get?url=";
const NEWS_API_URL_ENGLISH = `${PROXY_URL}${("https://timesofindia.indiatimes.com/rssfeeds/2886704.cms")}`;
const NEWS_API_URL_HINDI = `${PROXY_URL}${encodeURIComponent("https://newsapi.org/v2/everything?q=महिला+OR+फैशन+OR+स्वास्थ्य+OR+भोजन&language=hi&apiKey=dee373b831964dfdb34259a56efbf20b")}`;

const NewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      try {
        const apiUrl = language === 'hindi' ? NEWS_API_URL_HINDI : NEWS_API_URL_ENGLISH;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        const parsedData = language === 'hindi' ? JSON.parse(data.contents) : data.contents;

        const items = Array.isArray(parsedData.articles)
          ? parsedData.articles.map((article) => ({
              title: article.title || "No Title",
              description: article.description || "No Description",
              urlToImage: article.urlToImage || "https://via.placeholder.com/600x400",
              link: article.url || "#",
              source: { name: article.source.name || "Unknown Source" },
              publishedAt: article.publishedAt || new Date().toISOString(),
            }))
          : Array.from(new DOMParser().parseFromString(parsedData, "application/xml").querySelectorAll("item")).map((item) => {
              const rawDescription = item.querySelector("description")?.textContent || "No Description";
              const cleanedDescription = rawDescription.replace(/<img[^>]*>/g, "").trim(); // Remove <img> tags
              return {
                title: item.querySelector("title")?.textContent || "No Title",
                description: cleanedDescription,
                urlToImage: item.querySelector("enclosure")?.getAttribute("url") || "https://via.placeholder.com/600x400",
                link: item.querySelector("link")?.textContent || "#",
                source: { name: "Times of India" },
                publishedAt: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
              };
            });

        setArticles(items || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setArticles([]); // Ensure articles is always an array
      } finally {
        setLoading(false);
      }
    };

    if (language) {
      fetchNews();
    }
  }, [language]);

  useEffect(() => {
    const userLanguage = localStorage.getItem('preferred_language');
    if (userLanguage) {
      setLanguage(userLanguage);
    } else {
      const selectedLanguage = window.confirm('Would you like to see news in English? Click "Cancel" for Hindi.')
        ? 'english'
        : 'hindi';
      setLanguage(selectedLanguage);
      localStorage.setItem('preferred_language', selectedLanguage);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-purple-200 flex flex-col items-center">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md w-full rounded-b-lg">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "1.2rem",
              fontWeight: "700",
              backgroundImage: "linear-gradient(to right, #ec4899, #f43f5e, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "1.5px",
              textShadow: "2px 2px 4px rgba(255, 105, 180, 0.8)",
              textAlign: "center",
              margin: "8px 0",
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 240, 245, 0.3)",
            }}
          >
            ✨ Empowering Women: Fashion, Health & Lifestyle ✨
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        {loading ? (
          <div className="text-center">
            <HamsterLoader className="mx-auto mb-4" />
            <p className="text-rose-600 font-medium">Fetching the latest stories for you...</p>
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
              className="w-full h-64 object-cover rounded-t-xl"
              style={{ height: "16rem", objectFit: "cover", width: "-webkit-fill-available" }}
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-rose-50/90 backdrop-blur-md rounded-b-xl">
              <h3 className="text-sm font-bold text-rose-800 mb-2">{articles[currentArticleIndex]?.title || 'No Title'}</h3>
              <p className="text-sm text-rose-600 mb-4">{articles[currentArticleIndex]?.description || 'No Description'}</p>
              <div className="flex items-center justify-between text-xs text-rose-500">
                <span>{articles[currentArticleIndex]?.source?.name || 'Unknown Source'}</span>
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
                <button className="flex items-center space-x-1 text-gray-400 hover:text-rose-500 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-purple-500 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-rose-600 font-medium">No stories available</p>
          </div>
        )}
      </main>

      {/* Swipe Navigation */}
      <footer className="flex items-center justify-between w-full max-w-md px-4 py-4">
        <button
          onClick={() => handleSwipe('right')}
          disabled={currentArticleIndex === 0}
          className={`px-4 py-2 rounded-full bg-rose-200 hover:bg-rose-300 transition ${
            currentArticleIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => handleSwipe('left')}
          disabled={currentArticleIndex === articles.length - 1}
          className={`px-4 py-2 rounded-full bg-rose-200 hover:bg-rose-300 transition ${
            currentArticleIndex === articles.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default NewsApp;