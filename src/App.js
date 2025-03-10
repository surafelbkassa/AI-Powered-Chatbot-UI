import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const apiKey = process.env.REACT_APP_OPENAI_KEY;

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setIsLoading] = useState(false);
    const chatWindowRef = useRef(null);

    const handleChange = async () => {
        if (input.trim() === "") return;
        setIsLoading(true);

        setMessages((prevMessages) => [
            ...prevMessages,
            { text: input, sender: "user" }
        ]);
        console.log("API Key:", apiKey);


        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: input }]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    }
                }
            );

            const botResponse = response.data.choices[0].message.content;

            setMessages((prevMessages) => [
                ...prevMessages,
                { text: botResponse, sender: "bot" }
            ]);
        } catch (error) {
            console.error("Error fetching bot response:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "It's you, not us!", sender: "bot" }
            ]);
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
            {loading && <p>Loading...</p>}
            <div className="messaging">
                {messages.map((message, index) => (
                    <div key={index} className={message.sender}>
                        {message.text}
                    </div>
                ))}
                <div ref={chatWindowRef}></div>
            </div>
        </div>
    );
}

export default App;
