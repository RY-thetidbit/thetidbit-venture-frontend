"use client";

import { useState, useRef, useEffect } from "react";
import { Wand2, Download, Share2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";

export default function GhibliImageGenerator() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "Welcome to the Ghibli Image Generator! Describe the image you'd like to create in Studio Ghibli style."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // API key (ideally, this should be stored securely on a backend)
  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    // Add thinking message
    setMessages(prev => [...prev, { role: "assistant", content: "Generating your Ghibli-style image...", isLoading: true }]);

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

      // Uncomment this for actual API integration
   
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
    
      
      // Mock response for testing
      // const response = {};
      // response.data = {
      //   "created": 1743352377,
      //   "data": [
      //       {
      //           "revised_prompt": "A mesmerizing fantasy panorama exemplifying lush green hills, elevated islands suspended in the sky, all steeped in a magical aura. Infuse the image with the characteristics often found in pre-1912 Japanese art: a dreamy atmosphere, subtle lighting, and aesthetic qualities that suggest an anime illustration, but without copying any specific modern style. The finesse should resemble the delicacy found in traditional Japanese brushwork using watercolors.",
      //           "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-irxYipLQ2BB6dCjQxM21XnmK/user-yVhg46v6gYgH9EnEW9kCg7rR/img-JGL6uf1k3r6WncZH6wgFwlp6.png?st=2025-03-30T15%3A32%3A57Z&se=2025-03-30T17%3A32%3A57Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-03-29T17%3A28%3A08Z&ske=2025-03-30T17%3A28%3A08Z&sks=b&skv=2024-08-04&sig=cyR0dLtrVhnkLjNGVhgv7JhjjarvQJjDHsiIxLvL3U4%3D"
      //       }
      //   ]
      // };
      
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

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow">
            {/* Header */}
            <div className="card-header bg-primary bg-gradient text-white">
              <h2 className="h4 mb-0">Ghibli Image Generator</h2>
              <p className="small mb-0 opacity-75">Describe the Studio Ghibli-style image you want to create</p>
            </div>
            
            {/* Messages Area */}
            <div className="card-body bg-light p-3" style={{ height: "70vh", overflowY: "auto" }}>
              <div className="d-flex flex-column gap-3">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`d-flex ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div 
                      className={`p-3 rounded ${
                        message.role === 'user' 
                          ? 'bg-primary text-white rounded-top-end-0' 
                          : 'bg-white border rounded-top-start-0'
                      }`}
                      style={{ maxWidth: "80%" }}
                    >
                      {message.isLoading ? (
                        <div className="d-flex align-items-center gap-2">
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span>{message.content}</span>
                        </div>
                      ) : (
                        <>
                          <p className={message.role === 'user' ? 'text-white' : 'text-dark mb-0'}>
                            {message.content}
                          </p>
                          {message.imageUrl && (
                            <div className="mt-2">
                              <div className="position-relative" style={{ minHeight: "200px" }}>
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
                                <p className="small text-muted mt-1 fst-italic">
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
                                  <span>Download</span>
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
                                  <span>Share</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Input Area */}
            <div className="card-footer bg-white">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Describe your Ghibli-style image..."
                      className="form-control"
                      disabled={loading}
                    />
                    {/* remove */}
                    <button
                      type="submit"
                      disabled={loading || !inputValue.trim()}
                      className="btn btn-primary d-flex align-items-center gap-2"
                    >
                      {loading && (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      )}
                      {!loading && <Wand2 size={18} />}
                      <span>{loading ? "Creating..." : "Generate"}</span>
                    </button>
                  </div>
                </div>
                
                {/* Prompt suggestions */}
                <div className="mt-3">
                  <p className="small text-muted fw-bold mb-2">Prompt Suggestions:</p>
                  
                  {/* Team Members Section */}
                  {/* <div className="mb-2">
                    <span className="badge bg-primary mb-2">Team Members</span>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setInputValue("A young male software developer with short dark hair and glasses, sitting at a computer")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Male Developer
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A professional-looking businessman in his 30s with neat brown hair and a friendly smile, wearing a casual blazer")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Businessman
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A creative director with stylish haircut and fashionable clothes, looking confident and approachable")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Creative Director
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A thoughtful male data scientist with curly hair and subtle beard, looking at charts")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Data Scientist
                      </button>
                    </div>
                  </div> */}
                  
                  {/* Landscapes Section */}
                  {/* <div className="mb-2">
                    <span className="badge bg-success mb-2">Landscapes</span>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setInputValue("A beautiful fantasy landscape with lush green hills, floating islands, and a magical atmosphere")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Fantasy Landscape
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A peaceful countryside with rice fields and a small village at sunset, mountains in the distance")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Countryside
                      </button>
                    </div>
                  </div> */}
                  
                  {/* Good Night Kiss Section */}
                  <div className="mb-2">
                    <span className="badge bg-danger mb-2">Romantic Scenes</span>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setInputValue("A tender good night kiss between a young couple under a starry sky, soft moonlight illuminating their silhouettes")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Goodnight Kiss
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A romantic scene of a couple in a garden with fireflies, about to share a gentle kiss in the moonlight")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Garden Romance
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A couple sharing a sweet kiss on a balcony overlooking a magical night cityscape with twinkling lights")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        City Romance
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("Two lovers saying goodnight with a gentle kiss under a cherry blossom tree, petals falling around them")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
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
                        onClick={() => setInputValue("A cute anime girl with big expressive eyes blowing a heart-shaped flying kiss, pink heart floating in the air")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Heart Kiss
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A cheerful girl with flowing hair sending flying kisses with sparkling hearts, standing in a flower meadow")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Meadow Kiss
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A cute girl with pigtails sending a flying kiss with multiple colorful heart shapes, starry background")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Starry Hearts
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A sweet girl in a summer dress blowing heart-shaped bubbles that float as flying kisses, sunset beach setting")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Beach Hearts
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputValue("A cute girl with cat ears and a playful smile sending heart-shaped flying kisses with magical sparkles")}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                      >
                        Cat Girl Kiss
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}