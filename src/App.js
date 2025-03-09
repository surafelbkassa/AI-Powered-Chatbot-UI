import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

// Add the correct integrity attribute for Bootstrap CSS
const bootstrapCSS = document.createElement("link");
bootstrapCSS.rel = "stylesheet";
bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
bootstrapCSS.integrity = "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH";
bootstrapCSS.crossOrigin = "anonymous";
document.head.appendChild(bootstrapCSS);

function App() {
    const [message, setMessage] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setIsLoading] = useState(false);

    const chatWindowRef = useRef(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [message]);

    const handleChange = async () => {
        if (input.trim() === "") {
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/engines/davinci-codex/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: input }]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer YOUR_OPENAI_API_KEY"
                    }
                }
            );
            const botResponse = response.data.choices[0].message.content;
            setMessage((prevMessage) => [
                ...prevMessage,
                { text: input, sender: "user" }
            ]);
            setMessage((prevMessage) => [
                ...prevMessage,
                { text: botResponse, sender: "bot" }
            ]);
        } catch (error) {
            console.error("Error fetching bot response:", error);
        } finally {
            setIsLoading(false);
        }
        setInput("");
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            handleChange();
        }
    };

    return (
        <div className="container">
            <h2>ChatBot</h2>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleEnter}
                    placeholder="Talk to your personal AI"
                />
                <button onClick={handleChange} className="btn btn-primary btn-sm">Send</button>
            </div>
            <div className="messaging" ref={chatWindowRef}>
                {message.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;