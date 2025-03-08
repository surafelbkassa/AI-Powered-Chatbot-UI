import React,{useState} from "react";
import "./App.css";
function App() {
    const [message,setMessage]=useState([]);
    const [input,setInput]=useState("");
    const handleChange =()=>{
        setMessage((prevmessage) => [
            ...prevmessage,
        {text :input, sender:"user"}
        ]);
        setMessage((prevmessage) => [
        ...prevmessage,
        {text: "I am a bot", sender:"bot"}
        ]);
        setInput("");
    };
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            handleChange();
        }
    };
    return(
        <div>
        <h2>ChatBot</h2>
        <div className="input-area">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="Talk to your personal AI" />
                
            <button  onClick={handleChange}>Send</button>
        </div>
            <div className="messaging">
                {message.map((message,index) =>(
                    <div key={index} className={message.sender}>
                        {message.text}
                    </div>
                ))};
            </div>
        </div>
        
    );
}

export default App;