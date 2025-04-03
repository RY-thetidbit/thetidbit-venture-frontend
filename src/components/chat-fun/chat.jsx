"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Send, Trash } from "lucide-react";
import axios from "axios";
import FlirtyFridaySEO from "./FlirtyFridaySEO";
import Script from "next/script";

export default function FlirtyFridayChat() {
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [mood, setMood] = useState("Playful");
  const [language, setLanguage] = useState(null);
  const [gender, setGender] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const loadAds = () => {
    if (window.adsbygoogle && typeof window.adsbygoogle.push === "function") {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  };

  const clearChatHistory = () => {
    setChatMessages([]);
    localStorage.removeItem("chatHistory");
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) setLanguage(storedLanguage);

    const storedGender = localStorage.getItem("gender");
    if (storedGender) setGender(storedGender);

    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setChatMessages(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatMessages));
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    setChatMessages((prev) => [...prev, { role: "User", content: userMessage }]);
    const currentMessage = userMessage;
    setUserMessage("");
    setIsTyping(true);
    try {
      const conversationHistory = chatMessages.map((msg) => ({
        role: msg.role.toLowerCase() === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      const moodInstructions = {
        Playful:
          language === "English"
            ? "You are a playful, flirty AI assistant in 'Flirty Friday'. Keep responses light, fun, and slightly flirtatious. Use playful emojis occasionally. Please respond in English."
            : language === "Hindi"
            ? "आप एक चुलबुला, फ्लर्टी एआई सहायक हैं जो 'फ्लर्टी फ्राइडे' में हिस्सा ले रहे हैं। प्रतिक्रियाएं हल्की, मजेदार, और थोड़ी सी फ्लर्टी होनी चाहिए। कभी-कभार चुलबुले इमोजीस का उपयोग करें। कृपया हिंदी में उत्तर दें।"
            : "तुम एक चिठ्ठीदार, फ्लर्टी ए.आई. असिस्टेंट आहेस जो 'फ्लर्टी फ्रायडे' मध्ये भाग घेत आहेस. तुमच्या उत्तरात हलके, मजेशीर आणि किंचित फ्लर्टीपणा असावा. कृपया मराठीत उत्तर द्या।",
        Romantic:
          language === "English"
            ? "You are a romantic AI assistant in 'Flirty Friday'. Be poetic, sweet, and romantic. Use occasional romantic emojis. Please respond in English."
            : language === "Hindi"
            ? "आप एक रोमांटिक एआई सहायक हैं जो 'फ्लर्टी फ्राइडे' में हिस्सा ले रहे हैं। काव्यात्मक, प्यारे, और रोमांटिक रहें। कृपया हिंदी में उत्तर दें।"
            : "तुम एक रोमँटिक ए.आई. असिस्टेंट आहेस. कृपया मराठीत उत्तर द्या।",
        Cheesy:
          language === "English"
            ? "You are a cheesy, flirty AI assistant in 'Flirty Friday'. Use lots of puns and cheesy pick-up lines. Be over-the-top flirtatious. Please respond in English."
            : language === "Hindi"
            ? "आप एक चिपचिपा, फ्लर्टी एआई सहायक हैं जो 'फ्लर्टी फ्राइडे' में हिस्सा ले रहे हैं। कृपया हिंदी में उत्तर दें।"
            : "तुम एक चिसी, फ्लर्टी ए.आई. असिस्टेंट आहेस. कृपया मराठीत उत्तर द्या।",
        Mysterious:
          language === "English"
            ? "You are a mysterious, intriguing AI assistant in 'Flirty Friday'. Be enigmatic and subtly flirtatious. Ask thoughtful questions. Please respond in English."
            : language === "Hindi"
            ? "आप एक रहस्यमय, दिलचस्प एआई सहायक हैं जो 'फ्लर्टी फ्राइडे' में हिस्सा ले रहे हैं। कृपया हिंदी में उत्तर दें।"
            : "तुम एक रहस्यमय, आकर्षक ए.आई. असिस्टेंट आहेस. कृपया मराठीत उत्तर द्या।",
      };

      const response = await axios.post("/api/gpt", {
        messages: [
          { role: "system", content: moodInstructions[mood] },
          ...conversationHistory,
          { role: "user", content: currentMessage },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const aiResponse = response.data.message.content;
      setChatMessages((prev) => [...prev, { role: "AI", content: aiResponse }]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { role: "AI", content: "Sorry, I'm having trouble responding right now." },
      ]);
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const changeSettings = () => {
    setLanguage(null);
    setGender(null);
    localStorage.removeItem("language");
    localStorage.removeItem("gender");
  };

  if (!language) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-8 col-lg-6">
            <div
              className="card shadow border-0 rounded-4 text-center p-4"
              style={{ background: "linear-gradient(to bottom right, #fce4ec, #f8bbd0)" }}
            >
              <h2 className="mb-4 fw-bold text-danger">Select Language</h2>
              <div className="d-flex flex-column gap-3">
                {["English", "Hindi", "Marathi"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      localStorage.setItem("language", lang);
                    }}
                    className="btn btn-outline-danger btn-lg"
                    style={{ borderRadius: "50px", padding: "0.75rem 1.5rem" }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9155008277126927"
          crossOrigin="anonymous"
          onLoad={() => {
            loadAds();
          }}
        />
        <div className="mt-65">
          <FlirtyFridaySEO />
        </div>
      </div>
    );
  }

  if (!gender) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-8 col-lg-6">
            <div
              className="card shadow border-0 rounded-4 text-center p-4"
              style={{ background: "linear-gradient(to bottom right, #e8f5e9, #c8e6c9)" }}
            >
              <h2 className="mb-4 fw-bold text-primary">Select Gender</h2>
              <div className="d-flex flex-column gap-3">
                {["Female", "Male"].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGender(g);
                      localStorage.setItem("gender", g);
                    }}
                    className="btn btn-outline-primary btn-lg"
                    style={{ borderRadius: "50px", padding: "0.75rem 1.5rem" }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9155008277126927"
          crossOrigin="anonymous"
          onLoad={() => {
            loadAds();
          }}
        />
        <div className="mt-65">
          <FlirtyFridaySEO />
        </div>
      </div>
    );
  }

  const chatCardStyle =
    gender === "Female"
      ? {
          background: "linear-gradient(to bottom right, #fff0f5, #ffeefb)",
          boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
          borderRadius: "20px",
        }
      : {
          background: "linear-gradient(to bottom right, #e0f7fa, #80deea)",
          boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
          borderRadius: "20px",
        };

  const headerTextColor = gender === "Female" ? "#d81b60" : "#01579b";
  const headerHeartStyle = gender === "Female" ? { color: "#e91e63", fill: "#e91e63" } : { color: "#039be5", fill: "#039be5" };
  const headerMessage =
    gender === "Female"
      ? "Welcome, lovely lady! Let's chat and have some fun."
      : "Welcome, suave gentleman! Ready to start an engaging chat?";

  let chatBackground;
  if (gender === "Female") {
    const femaleAvatars = [
      "https://res.cloudinary.com/thetidbit23024/image/upload/v1743674236/ttb/ChatGPT_Image_Apr_3_2025_03_26_24_PM_snxhb8.png"
    ];
    chatBackground = femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
  } else {
    const maleAvatars = [
      "https://res.cloudinary.com/thetidbit23024/image/upload/v1743673990/ttb/ChatGPT_Image_Apr_3_2025_03_22_24_PM_gkzkcm.png",
      "https://res.cloudinary.com/thetidbit23024/image/upload/v1743673223/ttb/ChatGPT_Image_Apr_3_2025_03_06_39_PM_bo7vju.png"
    ];
    chatBackground = maleAvatars[Math.floor(Math.random() * maleAvatars.length)];
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-lg-8">
          <div className="card shadow border-0 rounded-4" style={chatCardStyle}>
            <div className="card-body p-2">
              <div className="d-flex flex-column align-items-center">
                <motion.h1
                  className="text-center mb-2 fw-bold d-flex align-items-center justify-content-center"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", color: headerTextColor }}
                >
                  <Heart className="me-2" style={headerHeartStyle} />
                  {headerMessage}
                  <Heart className="ms-2" style={headerHeartStyle} />
                </motion.h1>
                <button
                  onClick={changeSettings}
                  className="btn btn-link text-decoration-none small"
                >
                  Change Settings
                </button>
              </div>

              <div
                ref={chatContainerRef}
                className="bg-white rounded-3 p-4 shadow-sm mb-4 overflow-auto"
                style={{
                  height: "50vh",
                  minHeight: "300px",
                  border: "1px solid #f8bbd0",
                  backgroundImage: `url(${chatBackground})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {chatMessages.length === 0 ? (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                    <Heart className="mb-2" style={{ width: "48px", height: "48px", color: "#f8bbd0" }} />
                    <p className="fst-italic">Send a message to start chatting...</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {chatMessages.map((msg, index) => (
                      <motion.div
                        key={index}
                        className={`d-flex ${msg.role === "User" ? "justify-content-end" : "justify-content-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`p-3 rounded-3 ${msg.role === "User" ? "bg-primary text-white" : "bg-light"}`}
                          style={{
                            maxWidth: "85%",
                            borderTopRightRadius: msg.role === "User" ? "0" : "12px",
                            borderTopLeftRadius: msg.role === "AI" ? "0" : "12px",
                            background:
                              msg.role === "User"
                                ? "linear-gradient(to right, #1976d2, #2196f3)"
                                : "linear-gradient(to right, #fff0f5, #ffeefb)",
                          }}
                        >
                          <p className="small fw-bold mb-1">
                            {msg.role === "User" ? "You" : `Flirty AI (${mood})`}
                          </p>
                          <p className="mb-0">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div className="d-flex justify-content-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="p-3 rounded-3" style={{ maxWidth: "85%", borderTopLeftRadius: 0, background: "#fff0f5" }}>
                          <div className="d-flex gap-1">
                            <motion.div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ec407a" }} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} />
                            <motion.div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ec407a" }} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }} />
                            <motion.div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ec407a" }} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.4 }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="form-control shadow-sm flex-grow-1"
                  placeholder="Type a flirty message..."
                  disabled={isTyping}
                  style={{ borderRadius: "12px", padding: "0.75rem" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={isTyping || !userMessage.trim()}
                  className={`btn btn-danger d-flex align-items-center gap-2 ${isTyping || !userMessage.trim() ? "disabled" : ""}`}
                  style={{ borderRadius: "12px", padding: "0.75rem 1.25rem", transition: "all 0.3s ease" }}
                >
                  <Send size={18} />
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex flex-wrap gap-2">
                  {["Playful", "Romantic", "Cheesy", "Mysterious"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setMood(mode)}
                      className={`btn btn-sm ${mood === mode ? "btn-danger" : "btn-outline-danger"}`}
                      style={{
                        borderRadius: "50px",
                        transform: mood === mode ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.3s ease",
                        padding: "0.5rem 1.5rem",
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <button onClick={clearChatHistory} className="btn btn-link text-danger p-0">
                  <Trash size={20} />
                </button>
              </div>

              <Script
                id="adsbygoogle-init"
                strategy="afterInteractive"
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9155008277126927"
                crossOrigin="anonymous"
                onLoad={() => {
                  loadAds();
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-65">
        <FlirtyFridaySEO />
      </div>
    </div>
  );
}