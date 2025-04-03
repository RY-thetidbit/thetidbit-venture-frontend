"use client";
import "./chat.css";

import { useState, useRef, useEffect } from "react";
import {
  Wand2,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Image as ImageIcon,
  Upload,
  X,
  Trash2,
  Copy,
  RefreshCw
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";
import GhibliInfoSection from "./GhibliInfoSection";
import HamsterLoader from "../shared/HamsterLoader";
import Script from "next/script";
import ImageSlider from "../shared/ImageSlider";
import { getChatCompletion, generateImageWithDalle, getGpt4Prompt } from "../../api/openaiApi";
import { shareImageToWhatsApp } from "./whatsAppShare";

// Local storage functions for chat history
const STORAGE_KEY = "ghibliChatHistory";

const saveMessagesToLocalStorage = (messages) => {
  try {
    const history = JSON.stringify(messages);
    localStorage.setItem(STORAGE_KEY, history);
  } catch (error) {
    console.error("Error saving chat history to localStorage:", error);
  }
};

const loadMessagesFromLocalStorage = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history
      ? JSON.parse(history)
      : [
          {
            role: "system",
            content: "Welcome! Choose a mode: Chat, Ghibli Image, or Upload & Ghibli-fy."
          }
        ];
  } catch (error) {
    console.error("Error loading chat history from localStorage:", error);
    return [
      {
        role: "system",
        content: "Welcome! Choose a mode: Chat, Ghibli Image, or Upload & Ghibli-fy."
      }
    ];
  }
};

export default function ChatAndImageGenerator() {
  // States for managing the chat component
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "Welcome! Choose a mode: Chat, Ghibli Image, or Upload & Ghibli-fy."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isUploadMode, setIsUploadMode] = useState(true); // Set default to upload
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(false); // State to disable upload
  const [initialLoading, setInitialLoading] = useState(true); // New state for initial loading
  const [copiedIndex, setCopiedIndex] = useState(null); // Track which message was copied
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for the file input
  const inputRef = useRef(null); // Ref for the input field

  // API keys (ideally, these should be stored securely on a backend)
  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const CLOUDINARY_CLOUD_NAME = "thetidbit23024";
  const CLOUDINARY_UPLOAD_PRESET = "thetidbit_preset";

  // Add this function to handle image load completion
  const handleImageLoad = () => {
    // Scroll to bottom once the image is loaded
    setTimeout(scrollToBottom, 100);
  };

  // New share function to allow sharing the app
  const handleShareApp = async () => {
    const shareData = {
      title: "Ghibli Chat App",
      text: "Check out this cool Ghibli Chat App!",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  // Load chat history on component mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = loadMessagesFromLocalStorage();
        if (savedMessages && savedMessages.length > 0) {
          setMessages(savedMessages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadMessages();
  }, []);

  // Save messages before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveMessagesToLocalStorage(messages);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messages]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use a small timeout to ensure the DOM has updated
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end"
        });
      }, 100);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const togglePrompts = () => {
    setShowPrompts(!showPrompts);
  };

  // Update messages and save to localStorage
  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    saveMessagesToLocalStorage(newMessages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploadMode) return; // Prevent handleSubmit in Upload mode
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    updateMessages([...messages, userMessage]);
    setInputValue("");
    setLoading(true);

    if (isImageMode) {
      // Image generation mode
      handleImageGeneration();
    } else {
      // Text chat mode
      handleTextChat();
    }

    // Focus back on the input field
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  };

  const handleTextChat = async (retryCount = 0) => {
    updateMessages([
      ...messages,
      {
        role: "assistant",
        content: retryCount > 0 ? `Retrying (attempt ${retryCount + 1})...` : "Thinking...",
        isLoading: true
      }
    ]);

    try {
      const chatMessages = messages.filter((msg) => msg.role !== "system");
      if (chatMessages.length === 0) {
        console.error("No user message found for chat.");
        updateMessages(
          messages.slice(0, -1).concat({
            role: "assistant",
            content: "Sorry, I couldn't process your request. Please try again.",
            timestamp: new Date().toISOString()
          })
        );
        setLoading(false);
        return;
      }

      const response = await getChatCompletion(chatMessages, OPENAI_API_KEY);
      if (response.data && response.data.choices && response.data.choices[0].message) {
        const textResponse = response.data.choices[0].message.content;
        updateMessages(
          messages.slice(0, -1).concat({
            role: "assistant",
            content: textResponse,
            timestamp: new Date().toISOString()
          })
        );
      }
    } catch (error) {
      console.error("Error getting text response:", error);
      if (
        (error.message?.includes("network") || error.code === "ECONNABORTED") &&
        retryCount < 2
      ) {
        updateMessages(
          messages.slice(0, -1).concat({
            role: "assistant",
            content: "Connection issue. Retrying...",
            isLoading: true
          })
        );
        setTimeout(() => {
          handleTextChat(retryCount + 1);
        }, 3000);
        return;
      }
      updateMessages(
        messages.slice(0, -1).concat({
          role: "assistant",
          content: `Sorry, I couldn't process your request: ${
            error.message || "Unknown error"
          }. Please try again.`,
          isError: true,
          timestamp: new Date().toISOString()
        })
      );
    } finally {
      setLoading(false);
    }
  };

  // Save images from URLs to Cloudinary
  const saveImageToCloudinary = async (imageUrl) => {
    try {
      // Create form data for the Cloudinary upload
      const formData = new FormData();
      formData.append("file", imageUrl);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Add timestamp and folder
      formData.append("folder", "ghibli_generated");
      formData.append("timestamp", Math.floor(Date.now() / 1000));

      // Upload to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return response.data;
    } catch (error) {
      console.error("Error saving to Cloudinary:", error);
      // Fall back to original URL if Cloudinary upload fails
      return { secure_url: imageUrl };
    }
  };

  const handleImageGeneration = async (retryCount = 0) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content:
          retryCount > 0
            ? `Retrying generation (attempt ${retryCount + 1})...`
            : "Generating your Ghibli-style image...",
        isLoading: true,
        timestamp: new Date().toISOString()
      }
    ]);

    try {
      const basePrompt =
        "Studio Ghibli art style, magical atmosphere, soft lighting, anime aesthetics";
      const fullPrompt = `${inputValue}. ${basePrompt}`;

      const response = await generateImageWithDalle(fullPrompt, OPENAI_API_KEY);
      console.log("API Response:", JSON.stringify(response));
      if (response.data && response.data.data && response.data.data[0].url) {
        const imageUrl = response.data.data[0].url;
        const revisedPrompt = response.data.data[0].revised_prompt || fullPrompt;
        // Save the generated image to Cloudinary (the call remains unchanged)
        const cloudinaryResponse = await saveImageToCloudinary(imageUrl);
        const cloudinaryUrl = cloudinaryResponse.secure_url;

        updateMessages(
          messages.slice(0, -1).concat({
            role: "assistant",
            content: "Here's your Ghibli-style image:",
            imageUrl: cloudinaryUrl,
            originalUrl: imageUrl,
            revisedPrompt,
            timestamp: new Date().toISOString()
          })
        );
      }
    } catch (error) {
      console.error("Error generating image:", error);
      if (
        (error.message?.includes("network") || error.code === "ECONNABORTED") &&
        retryCount < 2
      ) {
        updateMessages(
          messages.slice(0, -1).concat({
            role: "assistant",
            content: "Connection issue. Retrying image generation...",
            isLoading: true
          })
        );
        setTimeout(() => {
          handleImageGeneration(retryCount + 1);
        }, 3000);
        return;
      }
      updateMessages(
        messages.slice(0, -1).concat({
          role: "assistant",
          content: `Sorry, I couldn't generate the image: ${
            error.message || "Unknown error"
          }. Please try again with a different description.`,
          isError: true,
          timestamp: new Date().toISOString()
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Image too large. Please select an image under ${MAX_SIZE_MB}MB.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, or WEBP).");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploading(true); // Start upload loader
    setUploadedImageUrl(""); // Clear previous image
    setUploadDisabled(true); // Disable upload after image is selected

    // Add an upload started message
    updateMessages([
      ...messages,
      {
        role: "system",
        content: "Uploading your image...",
        isLoading: true,
        timestamp: new Date().toISOString()
      }
    ]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url;
      setUploadedImageUrl(imageUrl);

      // Replace the uploading message with the uploaded image
      const currentMessages = messages.filter((msg) => !msg.isLoading);

      // After a successful upload...
      updateMessages([
        ...currentMessages,
        {
          role: "user",
          content: "Uploaded image:",
          imageUrl: imageUrl, // This displays the uploaded image in the chat
          timestamp: new Date().toISOString()
        }
      ]);

      // Now scroll to make sure the new message is visible
      setTimeout(() => {
        scrollToBottom();
      }, 200);

      // Reset the file input immediately after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      handleUploadAndGhibliFy(imageUrl); // Directly start Ghibli-fy process
    } catch (error) {
      console.error("Error uploading image:", error);

      // Replace uploading message with error
      const currentMessages = messages.filter((msg) => !msg.isLoading);
      updateMessages([
        ...currentMessages,
        {
          role: "system",
          content: `Error uploading image: ${error.message || "Unknown error"}. Please try again.`,
          isError: true,
          timestamp: new Date().toISOString()
        }
      ]);

      setUploadDisabled(false); // Re-enable upload in case of error

      // Reset the file input in case of error too
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false); // Stop upload loader
    }
  };

  const handleUploadAndGhibliFy = async (imageUrl, retryCount = 0) => {
    if (!imageUrl) {
      alert("Please upload an image first.");
      setLoading(false);
      return;
    }
    setLoading(true);
    // Append an "analyzing" message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content:
          retryCount > 0
            ? `Retrying analysis (attempt ${retryCount + 1})...`
            : "Analyzing image and generating Ghibli-style image...",
        isLoading: true,
        timestamp: new Date().toISOString()
      }
    ]);

    try {
      // Get the prompt from GPT-4 (mock or real)
      const promptResponse = await getGpt4Prompt(imageUrl, OPENAI_API_KEY);
      const prompt = promptResponse.choices[0].message.content;
      // Build a full prompt for image generation
      const basePrompt =
        "Studio Ghibli art style, magical atmosphere, soft lighting, anime aesthetics";
      const fullPrompt = `${prompt}. ${basePrompt}`;

      // Call the image generation API
      const response = await generateImageWithDalle(fullPrompt, OPENAI_API_KEY);
      console.log("API Response:", JSON.stringify(response));
      if (response.data && response.data.data && response.data.data[0].url) {
        const ghibliImageUrl = response.data.data[0].url;
        const revisedPrompt = response.data.data[0].revised_prompt || fullPrompt;

        // Save the generated image to Cloudinary for permanent storage
        const cloudinaryResponse = await saveImageToCloudinary(ghibliImageUrl);
        const storedImageUrl = cloudinaryResponse.secure_url;

        // Remove any temporary "analyzing" messages and then append the final generated image message (without removing the user-uploaded image)
        setMessages((prevMessages) => {
          // Filter out messages that are still in-progress (isLoading true)
          const filtered = prevMessages.filter((msg) => !msg.isLoading);
          return [
            ...filtered,
            {
              role: "assistant",
              content:
                "Here's your Ghibli-style image based on the uploaded image:",
              imageUrl: storedImageUrl, // Using Cloudinary URL to display the image
              originalUrl: ghibliImageUrl, // For reference/download
              revisedPrompt,
              timestamp: new Date().toISOString()
            }
          ];
        });

        // Reset the file input and uploaded image state
        setUploadDisabled(false);
        setUploadedImageUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      if (
        (error.message?.includes("network") || error.code === "ECONNABORTED") &&
        retryCount < 2
      ) {
        setMessages((prevMessages) => {
          // Replace any "analyzing" messages with a retry message
          const filtered = prevMessages.filter((msg) => !msg.isLoading);
          return [
            ...filtered,
            {
              role: "assistant",
              content: "Connection issue. Retrying image generation...",
              isLoading: true,
              timestamp: new Date().toISOString()
            }
          ];
        });
        setTimeout(() => {
          handleUploadAndGhibliFy(imageUrl, retryCount + 1);
        }, 3000);
        return;
      }
      setMessages((prevMessages) => {
        const filtered = prevMessages.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            role: "assistant",
            content: `Sorry, I couldn't generate the image: ${
              error.message || "Unknown error"
            }. Please try again with a different image.`,
            isError: true,
            timestamp: new Date().toISOString()
          }
        ];
      });
      setUploadDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (mode) => {
    setIsUploadMode(mode === "upload");
    setIsImageMode(mode === "image");
    setUploadedImageUrl(""); // Clear uploaded image URL
    setUploadDisabled(false); // Enable upload when mode changes

    // Add a mode change message instead of clearing history
    let systemMessage = "";
    if (mode === "upload") {
      systemMessage =
        "I'm now in Upload & Ghibli-fy mode. Upload an image to get started!";
    } else if (mode === "image") {
      systemMessage =
        "I'm now in Ghibli image generation mode. Describe the image you'd like to create!";
    } else {
      systemMessage =
        "I'm now in text chat mode. Ask me anything!";
    }

    // Add mode change message to existing messages
    updateMessages([
      ...messages,
      {
        role: "system",
        content: systemMessage,
        timestamp: new Date().toISOString()
      }
    ]);

    // Focus on input if switching to chat or image mode
    if (!isUploadMode && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  };

  // Add this function to initialize ads when they should be displayed
  const loadAds = () => {
    if (window.adsbygoogle && typeof window.adsbygoogle.push === "function") {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  };

  // Call loadAds when component mounts and when messages change
  useEffect(() => {
    if (typeof window !== "undefined") {
      loadAds();
    }
  }, [messages]);

  const clearChatHistory = () => {
    const initialMessage = {
      role: "system",
      content: isUploadMode
        ? "I'm now in Upload & Ghibli-fy mode. Upload an image to get started!"
        : isImageMode
        ? "I'm now in Ghibli image generation mode. Describe the image you'd like to create!"
        : "I'm now in text chat mode. Ask me anything!",
      timestamp: new Date().toISOString()
    };

    updateMessages([initialMessage]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Function to retry failed requests
  const retryRequest = (index) => {
    const message = messages[index];
    if (!message || message.role !== "assistant" || !message.isError) return;

    // Find the last user message before this error
    let userMessageIndex = -1;
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        userMessageIndex = i;
        break;
      }
    }

    if (userMessageIndex === -1) return;

    // Get the user's message content
    const userMessage = messages[userMessageIndex];

    // Remove the error message
    const newMessages = messages.filter((_, i) => i !== index);
    updateMessages(newMessages);

    // Retry the request
    setLoading(true);
    if (isImageMode) {
      setInputValue(userMessage.content);
      handleImageGeneration();
    } else {
      setInputValue(userMessage.content);
      handleTextChat();
    }
  };

  return (
    <div className="container-fluid px-0 px-sm-2 my-2 my-sm-4">
      {/* Add Next.js Script component for AdSense */}
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9155008277126927"
        crossOrigin="anonymous"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.adsbygoogle) {
            try {
              window.adsbygoogle.push({});
            } catch (e) {
              console.error('AdSense error:', e);
            }
          }
        }}
      />

      <div className="row justify-content-center mx-0">
        <div className="col-12 col-md-10 col-lg-8 px-0 px-sm-2">
          <div className="card shadow border-0 rounded-0 rounded-sm-3 chat-container">
            {/* Header with Mode Toggle and Share App Button */}
            <div className="card-header chat-header">
              <h2 className="h5 h4-sm mb-2">
                {isImageMode
                  ? "Ghibli Image Generator"
                  : isUploadMode
                  ? "Upload & Ghibli-fy"
                  : "AI Chat Assistant"}
              </h2>
              <p className="small mb-0 opacity-75 d-none d-sm-block">
                {isImageMode
                  ? "Describe the Studio Ghibli-style image you want to create"
                  : isUploadMode
                  ? "Upload an image to generate a Ghibli-style version"
                  : "Chat with the AI assistant - ask questions or have a conversation"}
              </p>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <button
                    onClick={() => toggleMode("upload")}
                    className={`btn btn-sm btn-modern d-flex align-items-center gap-1 ${
                      isUploadMode ? "active" : ""
                    }`}
                  >
                    <Upload size={16} />
                    <span className="d-none d-sm-inline">Upload</span>
                  </button>
                  <button
                    onClick={() => toggleMode("image")}
                    className={`btn btn-sm btn-modern d-flex align-items-center gap-1 ${
                      isImageMode ? "active" : ""
                    }`}
                  >
                    <ImageIcon size={16} />
                    <span className="d-none d-sm-inline">Image</span>
                  </button>
                  <button
                    onClick={() => toggleMode("chat")}
                    className={`btn btn-sm btn-modern d-flex align-items-center gap-1 ${
                      !isImageMode && !isUploadMode ? "active" : ""
                    }`}
                  >
                    <MessageSquare size={16} />
                    <span className="d-none d-sm-inline">Chat</span>
                  </button>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={clearChatHistory}
                    className="btn btn-sm btn-modern d-flex align-items-center gap-1"
                    title="Clear chat history"
                  >
                    <Trash2 size={16} />
                    <span className="d-none d-sm-inline">Clear History</span>
                  </button>
                  <button
                    onClick={handleShareApp}
                    className="btn btn-sm btn-modern d-flex align-items-center gap-1"
                    title="Share this app"
                  >
                    <Share2 size={16} />
                    <span className="d-none d-sm-inline">Share App</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="card-body chat-body">
              <div className="d-flex flex-column gap-3">
                {/* Empty state for new chats */}
                {messages.length <= 1 && !initialLoading && (
                  <div className="text-center my-4">
                    {isImageMode ? (
                      <div className="empty-state">
                        <ImageIcon
                          size={48}
                          className="text-primary opacity-50 mb-3"
                        />
                        <h3 className="h5">Describe an image to generate</h3>
                        <p className="text-muted">
                          I&apos;ll create a Studio Ghibli style image based on
                          your description!
                        </p>
                      </div>
                    ) : isUploadMode ? (
                      <div className="empty-state">
                        <Upload
                          size={48}
                          className="text-primary opacity-50 mb-3"
                        />
                        <h3 className="h5">Upload an image to Ghibli-fy</h3>
                        <p className="text-muted">
                          Upload your photo and I&apos;ll transform it into
                          Studio Ghibli style!
                        </p>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <MessageSquare
                          size={48}
                          className="text-primary opacity-50 mb-3"
                        />
                        <h3 className="h5">Start a conversation</h3>
                        <p className="text-muted">
                          Ask me anything or just say hello!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Initial loading indicator */}
                {initialLoading && (
                  <div className="text-center my-4">
                    <HamsterLoader />
                    <p>Loading messages...</p>
                  </div>
                )}

                {/* Ad container and messages */}
                {!initialLoading && (
                  <>
                    {/* Add an ad unit at the top of messages */}
                    <div className="ad-container w-100 text-center my-2">
                      <ins
                        className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client="ca-pub-9155008277126927"
                        data-ad-slot="1234567890" // Replace with your actual ad slot ID
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                      ></ins>
                    </div>

                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`d-flex ${
                          message.role === "user"
                            ? "justify-content-end"
                            : "justify-content-start"
                        } message`}
                      >
                        <div
                          className={`p-2 p-sm-3 rounded ${
                            message.role === "user"
                              ? "bg-primary text-white"
                              : "bg-white text-dark"
                          } `}
                        >
                          {message.isLoading ? (
                            <div className="message-loader">
                              <HamsterLoader />
                              <span>{message.content}</span>
                            </div>
                          ) : (
                            <>
                              <p
                                className={
                                  message.role === "user"
                                    ? "text-white"
                                    : message.isError
                                    ? "text-danger mb-0"
                                    : "text-dark mb-0"
                                }
                              >
                                {message.content}
                              </p>

                              {/* Show timestamp if available */}
                              {message.timestamp && (
                                <div className="text-end mt-1">
                                  <small
                                    className={`opacity-75 ${
                                      message.role === "user"
                                        ? "text-white"
                                        : "text-muted"
                                    }`}
                                  >
                                    {new Date(
                                      message.timestamp
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })}
                                  </small>
                                </div>
                              )}

                              {message.imageUrl ? (
                                <div className="mt-2">
                                  <div
                                    className="position-relative"
                                    style={{ minHeight: "200px" }}
                                  >
                                    <Image
                                      src={message.imageUrl}
                                      alt={message.role === "user" ? "Uploaded image" : "Generated Ghibli image"}
                                      width={400}
                                      height={400}
                                      className="img-fluid rounded"
                                      placeholder="blur"
                                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
                                      style={{
                                        maxHeight: "400px",
                                        objectFit: "contain"
                                      }}
                                      unoptimized={true}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          "https://placehold.co/400x400?text=Image+Load+Error";
                                      }}
                                      onLoad={handleImageLoad}
                                    />
                                  </div>
                                  {message.revisedPrompt && (
                                    <p className="small text-muted mt-1 fst-italic d-none d-sm-block">
                                      {message.revisedPrompt}
                                    </p>
                                  )}
                                  <div className="d-flex justify-content-end gap-2 mt-2">
                                    <a
                                      href={message.imageUrl}
                                      download={
                                        message.role === "user"
                                          ? "uploaded-image.jpg"
                                          : "ghibli-image.jpg"
                                      }
                                      className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Download size={16} />
                                      <span className="d-none d-sm-inline">
                                        Download
                                      </span>
                                    </a>
                                    <button
                                      onClick={() =>
                                        shareImageToWhatsApp(
                                          message.imageUrl,
                                          message.role
                                        )
                                      }
                                      className="btn btn-whatsapp btn-sm d-flex align-items-center gap-1"
                                    >
                                      <FaWhatsapp size={16} />
                                      <span className="d-none d-sm-inline">
                                        Share
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              ) : message.role === "user" &&
                                message.content.includes("Uploaded image") ? (
                                <div className="mt-2 text-danger">
                                  <p>
                                    Image URL missing! Please try uploading
                                    again.
                                  </p>
                                </div>
                              ) : null}

                              {/* Add copy button for text responses */}
                              {!message.isLoading &&
                                message.role === "assistant" &&
                                !message.imageUrl && (
                                  <div className="d-flex justify-content-end mt-2 gap-2">
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          message.content
                                        );
                                        setCopiedIndex(index);
                                        setTimeout(
                                          () => setCopiedIndex(null),
                                          2000
                                        );
                                      }}
                                      className="btn btn-sm btn-modern"
                                    >
                                      {copiedIndex === index ? (
                                        "Copied!"
                                      ) : (
                                        <>
                                          <Copy size={14} />{" "}
                                          <span className="ms-1 d-none d-sm-inline">
                                            Copy
                                          </span>
                                        </>
                                      )}
                                    </button>

                                    {/* Add retry button for error messages */}
                                    {message.isError && (
                                      <button
                                        onClick={() => retryRequest(index)}
                                        className="btn btn-sm btn-modern"
                                      >
                                        <RefreshCw size={14} />{" "}
                                        <span className="ms-1 d-none d-sm-inline">
                                          Retry
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add another ad unit after a certain number of messages */}
                    {messages.length > 3 && (
                      <div className="ad-container w-100 text-center my-2">
                        <ins
                          className="adsbygoogle"
                          style={{ display: "block" }}
                          data-ad-client="ca-pub-9155008277126927"
                          data-ad-slot="9876543210" // Replace with your actual ad slot ID
                          data-ad-format="auto"
                          data-full-width-responsive="true"
                        ></ins>
                      </div>
                    )}
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="card-footer bg-white p-2 p-sm-3">
              <form onSubmit={handleSubmit}>
                {isUploadMode ? (
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="input-group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="form-control chat-input"
                          disabled={uploadDisabled || uploading || loading}
                          ref={fileInputRef}
                        />
                      </div>
                    </div>
                    {uploading && (
                      <div className="upload-loader mb-2">
                        <HamsterLoader />
                        <span>Uploading image...</span>
                      </div>
                    )}
                    {loading && (
                      <div className="upload-loader mb-2">
                        <HamsterLoader />
                        <span>
                          Analyzing image and generating Ghibli-style image...
                        </span>
                      </div>
                    )}
                    {/* Display file size and format restrictions */}
                    <div className="text-muted small mt-2">
                      <p className="mb-0">
                        Maximum file size: 5MB. Supported formats: JPEG, PNG,
                        GIF, WEBP.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-2 mb-sm-3">
                    <div className="input-group">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={isImageMode ? "Describe your Ghibli image..." : "Type your message..."}
                        className="form-control py-2 chat-input"
                        disabled={loading}
                        ref={inputRef}
                      />
                      <button
                        type="submit"
                        disabled={loading || (!inputValue.trim() && !isUploadMode)}
                        className="btn btn-modern d-flex align-items-center gap-1"
                      >
                        {loading ? (
                          <>
                            <HamsterLoader className="button-loader" />
                            <span className="d-none d-sm-inline">
                              {isImageMode ? "Creating..." : "Sending..."}
                            </span>
                          </>
                        ) : (
                          <>
                            {isImageMode ? (
                              <Wand2 size={18} />
                            ) : (
                              <MessageSquare size={18} />
                            )}
                            <span className="d-none d-sm-inline">
                              {isImageMode ? "Generate" : "Send"}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Collapsible Prompt Suggestions - only show in image mode */}
                {isImageMode && (
                  <div>
                    <button
                      type="button"
                      onClick={togglePrompts}
                      className="btn btn-sm btn-modern d-flex align-items-center gap-1 w-100 mb-2"
                    >
                      <span>
                        {showPrompts ? "Hide" : "Show"} Prompt Suggestions
                      </span>
                      {showPrompts ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    {showPrompts && (
                      <div className="mt-2 prompt-suggestions">
                        {/* Romantic Scenes Section */}
                        <div className="mb-2">
                          <span className="badge bg-danger mb-2">
                            Romantic Scenes
                          </span>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue(
                                  "A tender good night kiss between a young couple under a starry sky, soft moonlight illuminating their silhouettes"
                                );
                                setShowPrompts(false);
                              }}
                              className="btn btn-modern btn-sm rounded-pill text-truncate"
                            >
                              Goodnight Kiss
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue(
                                  "A romantic scene of a couple in a garden with fireflies, about to share a gentle kiss in the moonlight"
                                );
                                setShowPrompts(false);
                              }}
                              className="btn btn-modern btn-sm rounded-pill text-truncate"
                            >
                              Garden Romance
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue(
                                  "A couple sharing a sweet kiss on a balcony overlooking a magical night cityscape with twinkling lights"
                                );
                                setShowPrompts(false);
                              }}
                              className="btn btn-modern btn-sm rounded-pill text-truncate"
                            >
                              City Romance
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue(
                                  "Two lovers saying goodnight with a gentle kiss under a cherry blossom tree, petals falling around them"
                                );
                                setShowPrompts(false);
                              }}
                              className="btn btn-modern btn-sm rounded-pill text-truncate"
                            >
                              Cherry Blossom Kiss
                            </button>
                          </div>
                        </div>

                        {/* Cute Girl & Flying Kiss Section */}
                        <div className="mb-2">
                          <span className="badge bg-info mb-2">
                            Cute Girl & Flying Kiss
                          </span>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue(
                                  "A cute anime girl with big expressive eyes blowing a heart-shaped flying kiss, pink heart floating in the air"
                                );
                                setShowPrompts(false);
                              }}
                              className="btn btn-modern btn-sm rounded-pill text-truncate"
                            >
                              Heart Kiss
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue(
                                  "A cheerful girl with flowing hair sending flying kisses with sparkling hearts, standing in a flower meadow"
                                );
                                setShowPrompts(false);
                              }}
                              className="btn btn-modern btn-sm rounded-pill text-truncate"
                            >
                              Meadow Kiss
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue(
                                  "A cute girl with pigtails sending a flying kiss with multiple colorful heart shapes, starry background"
                                );
                                setShowPrompts(false);
                              }}
                              className="btn btn-modern btn-sm rounded-pill text-truncate"
                            >
                              Starry Hearts
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue(
                                  "A sweet girl in a summer dress blowing heart-shaped bubbles that float as flying kisses, sunset beach setting"
                                );
                                setShowPrompts(false);
                              }}
                              className="btn btn-modern btn-sm rounded-pill text-truncate"
                            >
                              Beach Hearts
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue(
                                  "A cute girl with cat ears and a playful smile sending heart-shaped flying kisses with magical sparkles"
                                );
                                setShowPrompts(false);
                              }}
                              className="btn btn-modern btn-sm rounded-pill text-truncate"
                            >
                              Cat Girl Kiss
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Add an ad unit before the slider */}
      <div className="ad-container w-100 text-center my-3">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-9155008277126927"
          data-ad-slot="5432109876"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>

      {/* Add the Image Slider Component */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <ImageSlider
              images={[
                {
                  url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535955/1_cuhzns.png",
                  alt: "Ghibli-style image example 1"
                },
                {
                  url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535965/2_ex8ooh.png",
                  alt: "Ghibli-style image example 2"
                },
                {
                  url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535966/3_jxo701.png",
                  alt: "Ghibli-style image example 3"
                },
                {
                  url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535958/4_ue87s6.png",
                  alt: "Ghibli-style image example 4"
                },
                {
                  url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535957/5_web7qo.png",
                  alt: "Ghibli-style image example 5"
                }
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <GhibliInfoSection />
      </div>
    </div>
  );
}