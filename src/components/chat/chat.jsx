"use client";

import { useState, useRef, useEffect } from "react";
import { Wand2, Download, Share2, ChevronDown, ChevronUp, MessageSquare, Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import GhibliInfoSection from "./GhibliInfoSection";
import HamsterLoader from "../shared/HamsterLoader";
import Head from "next/head";
import Script from "next/script";
import ImageSlider from "../shared/ImageSlider";

export default function ChatAndImageGenerator() {
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
  const [uploadDisabled, setUploadDisabled] = useState(false); // New state to disable upload
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Add this ref for the file input

  // API keys (ideally, these should be stored securely on a backend)
  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const CLOUDINARY_CLOUD_NAME = "thetidbit23024"; // Replace with your cloud name
  const CLOUDINARY_UPLOAD_PRESET = "thetidbit_preset"; // Replace with your upload preset

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const togglePrompts = () => {
    setShowPrompts(!showPrompts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploadMode) return; // Prevent handleSubmit in Upload mode
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    if (isImageMode) {
      // Image generation mode
      handleImageGeneration();
    } else {
      // Text chat mode
      handleTextChat();
    }
  };

  const handleTextChat = async () => {
    // Add thinking message
    setMessages(prev => [...prev, { role: "assistant", content: "Thinking...", isLoading: true }]);

    try {
      // Text chat API call
      const chatMessages = messages.filter(msg => msg.role !== 'system');

      // Ensure there's at least one message (the user message)
      if (chatMessages.length === 0) {
        console.error("No user message found for chat.");
        setMessages(prev => prev.slice(0, -1).concat({
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again."
        }));
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            ...chatMessages.map(msg => ({ role: msg.role, content: msg.content }))
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.choices && response.data.choices[0].message) {
        const textResponse = response.data.choices[0].message.content;

        // Replace the thinking message with the actual response
        setMessages(prev => prev.slice(0, -1).concat({
          role: "assistant",
          content: textResponse
        }));
      }
    } catch (error) {
      console.error("Error getting text response:", error);

      // Replace the thinking message with error message
      setMessages(prev => prev.slice(0, -1).concat({
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again."
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleImageGeneration = async () => {
    // Add thinking message
    setMessages(prev => [...prev, {
      role: "assistant",
      content: "Generating your Ghibli-style image...",
      isLoading: true
    }]);

    try {
      // Prepare the prompt for DALL-E
      const basePrompt = "Studio Ghibli art style, magical atmosphere, soft lighting, anime aesthetics";
      const fullPrompt = `${inputValue}. ${basePrompt}`;

      const data = JSON.stringify({
        "model": "dall-e-3",
        "prompt": fullPrompt,
        "n": 1,
        "size": "1024x1024"
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.openai.com/v1/images/generations',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = await axios.request(config);

      console.log("API Response:", JSON.stringify(response.data));

      if (response.data && response.data.data && response.data.data[0].url) {
        const imageUrl = response.data.data[0].url;
        const revisedPrompt = response.data.data[0].revised_prompt || fullPrompt;

        // Replace the thinking message with success message and image
        setMessages(prev => prev.slice(0, -1).concat({
          role: "assistant",
          content: "Here's your Ghibli-style image:",
          imageUrl,
          revisedPrompt
        }));
      }
    } catch (error) {
      console.error("Error generating image:", error);

      // Replace the thinking message with error message
      setMessages(prev => prev.slice(0, -1).concat({
        role: "assistant",
        content: "Sorry, I couldn't generate the image. Please try again with a different description."
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAndGhibliFy = async (imageUrl) => {
    if (!imageUrl) {
      alert("Please upload an image first.");
      setLoading(false);
      return;
    }
    setLoading(true); // Start Ghibli-fy loader

    // Add thinking message
    setMessages(prev => [...prev, {
      role: "assistant",
      content: "Analyzing image and generating Ghibli-style image...",
      isLoading: true
    }]);

    try {
      // Get prompt from GPT-4 based on the uploaded image
      const promptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: [
            {
              "role": "system",
              "content": "You are an AI assistant that can analyze images and text."
            },
            {
              "role": "user",
              "content": [
                { "type": "text", "text": "suggest a prompt to create an anime avatar like uploaded image" },
                {
                  "type": "image_url",
                  "image_url": {
                    "url": imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );

      const prompt = promptResponse.data.choices[0].message.content;

      // Generate Ghibli-style image based on the generated prompt
      const basePrompt = "Studio Ghibli art style, magical atmosphere, soft lighting, anime aesthetics";
      const fullPrompt = `${prompt}. ${basePrompt}`;

      const data = JSON.stringify({
        "model": "dall-e-3",
        "prompt": fullPrompt,
        "n": 1,
        "size": "1024x1024"
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.openai.com/v1/images/generations',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        data: data
      };

      const imageResponse = await axios.request(config);

      if (imageResponse.data && imageResponse.data.data && imageResponse.data.data[0].url) {
        const ghibliImageUrl = imageResponse.data.data[0].url;
        const revisedPrompt = imageResponse.data.data[0].revised_prompt || fullPrompt;

        // Replace the thinking message with success message and image
        setMessages(prev => prev.slice(0, -1).concat({
          role: "assistant",
          content: "Here's your Ghibli-style image based on the uploaded image:",
          imageUrl: ghibliImageUrl,
          revisedPrompt
        }));
        
        // Clear uploaded image and file input after successful generation
        setUploadDisabled(false); // Re-enable upload after image generation
        setUploadedImageUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);

      // Replace the thinking message with error message
      setMessages(prev => prev.slice(0, -1).concat({
        role: "assistant",
        content: "Sorry, I couldn't generate the image. Please try again with a different image."
      }));
      setUploadDisabled(false); // Re-enable upload in case of error
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (mode) => {
    setIsUploadMode(mode === 'upload');
    setIsImageMode(mode === 'image');
    setUploadedImageUrl(""); // Clear uploaded image URL
    setUploadDisabled(false); // Enable upload when mode changes
    // Clear previous context and set new system message
    let systemMessage = "";
    if (mode === 'upload') {
      systemMessage = "I'm now in Upload & Ghibli-fy mode. Upload an image to get started!";
    } else if (mode === 'image') {
      systemMessage = "I'm now in Ghibli image generation mode. Describe the image you'd like to create!";
    } else {
      systemMessage = "I'm now in text chat mode. Ask me anything!";
    }
    setMessages([
      {
        role: "system",
        content: systemMessage
      }
    ]);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true); // Start upload loader
    setUploadedImageUrl(""); // Clear previous image
    setUploadDisabled(true); // Disable upload after image is selected
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

      // Add the uploaded image to the messages
      setMessages(prev => [...prev, {
        role: "user",
        content: "Uploaded image:",
        imageUrl: imageUrl
      }]);

      setUploading(false); // Stop upload loader
      
      // Reset the file input immediately after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      handleUploadAndGhibliFy(imageUrl); // Directly start Ghibli-fy process
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
      setUploading(false); // Stop upload loader in case of error
      setLoading(false); // Ensure loading is false in case of error
      setUploadDisabled(false); // Re-enable upload in case of error
      
      // Reset the file input in case of error too
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (isUploadMode) {
      toggleMode('upload');
    }
  }, [isUploadMode]);

  // Add this function to initialize ads when they should be displayed
  const loadAds = () => {
    if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  };

  // Call loadAds when component mounts and when messages change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadAds();
    }
  }, [messages]);

  return (
    <div className="container-fluid px-0 px-sm-2 my-2 my-sm-4">
      {/* Add Next.js Script component for AdSense */}
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9155008277126927"
        crossOrigin="anonymous"
        onLoad={() => {
          loadAds();
        }}
      />

      <div className="row justify-content-center mx-0">
        <div className="col-12 col-md-10 col-lg-8 px-0 px-sm-2">
          <div className="card shadow border-0 rounded-0 rounded-sm-3">
            {/* Header with Mode Toggle */}
            <div className="card-header bg-primary bg-gradient text-white py-2 py-sm-3">
              <h2 className="h5 h4-sm mb-2">
                {isImageMode ? "Ghibli Image Generator" : isUploadMode ? "Upload & Ghibli-fy" : "AI Chat Assistant"}
              </h2>
              <p className="small mb-0 opacity-75 d-none d-sm-block">
                {isImageMode
                  ? "Describe the Studio Ghibli-style image you want to create"
                  : isUploadMode
                    ? "Upload an image to generate a Ghibli-style version"
                    : "Chat with the AI assistant - ask questions or have a conversation"}
              </p>
              <div className="d-flex justify-content-center align-items-center gap-2">
                <button
                  onClick={() => toggleMode('upload')}
                  className={`btn btn-sm btn-outline-light d-flex align-items-center gap-1 ${isUploadMode ? 'active' : ''}`}
                >
                  <Upload size={16} />
                  <span className="d-none d-sm-inline">Upload</span>
                </button>
                <button
                  onClick={() => toggleMode('image')}
                  className={`btn btn-sm btn-outline-light d-flex align-items-center gap-1 ${isImageMode ? 'active' : ''}`}
                >
                  <ImageIcon size={16} />
                  <span className="d-none d-sm-inline">Image</span>
                </button>
                <button
                  onClick={() => toggleMode('chat')}
                  className={`btn btn-sm btn-outline-light d-flex align-items-center gap-1 ${!isImageMode && !isUploadMode ? 'active' : ''}`}
                >
                  <MessageSquare size={16} />
                  <span className="d-none d-sm-inline">Chat</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="card-body bg-light p-2 p-sm-3" style={{ height: "60vh", overflowY: "auto" }}>
              <div className="d-flex flex-column gap-3">
                {/* Add an ad unit at the top of messages */}
                <div className="ad-container w-100 text-center my-2">
                  <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-9155008277126927"
                    data-ad-slot="1234567890" // Replace with your actual ad slot ID
                    data-ad-format="auto"
                    data-full-width-responsive="true">
                  </ins>
                </div>

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`d-flex ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div
                      className={`p-2 p-sm-3 rounded ${message.role === 'user'
                        ? 'bg-primary text-white rounded-top-end-0'
                        : 'bg-white border rounded-top-start-0'}`}
                      style={{ maxWidth: "90%" }}
                    >
                      {message.isLoading ? (
                        <div className="message-loader">
                          <HamsterLoader />
                          <span>{message.content}</span>
                        </div>
                      ) : (
                        <>
                          <p className={message.role === 'user' ? 'text-white' : 'text-dark mb-0'}>
                            {message.content}
                          </p>
                          {message.imageUrl && (
                            <div className="mt-2">
                              <div className="position-relative" style={{ minHeight: "150px" }}>
                                <Image
                                  src={message.imageUrl}
                                  alt="Generated Ghibli image"
                                  width={400}
                                  height={400}
                                  className="img-fluid rounded"
                                  placeholder="blur"
                                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
                                  unoptimized={true}
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
                                  download="ghibli-image.png"
                                  className="btn btn-success btn-sm d-flex align-items-center gap-1"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download size={16} />
                                  <span className="d-none d-sm-inline">Download</span>
                                </a>
                                <button
                                  onClick={() => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: "My Ghibli-Style Image",
                                        text: "Check out this Ghibli-style image I created!",
                                        url: message.imageUrl,
                                      });
                                    } else {
                                      navigator.clipboard.writeText(message.imageUrl);
                                      alert("Image URL copied to clipboard!");
                                    }
                                  }}
                                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                                >
                                  <Share2 size={16} />
                                  <span className="d-none d-sm-inline">Share</span>
                                </button>
                              </div>
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
                    <ins className="adsbygoogle"
                      style={{ display: 'block' }}
                      data-ad-client="ca-pub-9155008277126927"
                      data-ad-slot="9876543210" // Replace with your actual ad slot ID
                      data-ad-format="auto"
                      data-full-width-responsive="true">
                    </ins>
                  </div>
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
                          className="form-control"
                          disabled={uploadDisabled || uploading || loading}
                          ref={fileInputRef}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                            setUploadedImageUrl("");
                          }}
                          disabled={uploadDisabled || uploading || loading}
                        >
                          <X size={16} /> Clear
                        </button>
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
                        <span>Analyzing image and generating Ghibli-style image...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-2 mb-sm-3">
                    <div className="input-group">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={isImageMode ? "Describe your Ghibli image..." : "Type your message..."}
                        className="form-control py-2"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading || (!inputValue.trim() && !isUploadMode)}
                        className="btn btn-primary d-flex align-items-center gap-1"
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
                            {isImageMode ? <Wand2 size={18} /> : <MessageSquare size={18} />}
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
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 w-100 mb-2"
                    >
                      <span>{showPrompts ? "Hide" : "Show"} Prompt Suggestions</span>
                      {showPrompts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {showPrompts && (
                      <div className="mt-2 prompt-suggestions">
                        {/* Romantic Scenes Section */}
                        <div className="mb-2">
                          <span className="badge bg-danger mb-2">Romantic Scenes</span>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue("A tender good night kiss between a young couple under a starry sky, soft moonlight illuminating their silhouettes");
                                setShowPrompts(false);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill text-truncate"
                            >
                              Goodnight Kiss
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue("A romantic scene of a couple in a garden with fireflies, about to share a gentle kiss in the moonlight");
                                setShowPrompts(false);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill text-truncate"
                            >
                              Garden Romance
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue("A couple sharing a sweet kiss on a balcony overlooking a magical night cityscape with twinkling lights");
                                setShowPrompts(false);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill text-truncate"
                            >
                              City Romance
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue("Two lovers saying goodnight with a gentle kiss under a cherry blossom tree, petals falling around them");
                                setShowPrompts(false);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill text-truncate"
                            >
                              Cherry Blossom Kiss
                            </button>
                          </div>
                        </div>

                        {/* Cute Girl & Flying Kiss Section */}
                        <div className="mb-2">
                          <span className="badge bg-info mb-2">Cute Girl & Flying Kiss</span>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue("A cute anime girl with big expressive eyes blowing a heart-shaped flying kiss, pink heart floating in the air");
                                setShowPrompts(false);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill text-truncate"
                            >
                              Heart Kiss
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue("A cheerful girl with flowing hair sending flying kisses with sparkling hearts, standing in a flower meadow");
                                setShowPrompts(false);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill text-truncate"
                            >
                              Meadow Kiss
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue("A cute girl with pigtails sending a flying kiss with multiple colorful heart shapes, starry background");
                                setShowPrompts(false);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill text-truncate"
                            >
                              Starry Hearts
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue("A sweet girl in a summer dress blowing heart-shaped bubbles that float as flying kisses, sunset beach setting");
                                setShowPrompts(false);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill text-truncate"
                            >
                              Beach Hearts
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputValue("A cute girl with cat ears and a playful smile sending heart-shaped flying kisses with magical sparkles");
                                setShowPrompts(false);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill text-truncate"
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
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9155008277126927"
          data-ad-slot="5432109876"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      </div>
      
      {/* Add the Image Slider Component */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <ImageSlider images={[
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
            ]} />
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <GhibliInfoSection />
      </div>
    </div>
  );
}