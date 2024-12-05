import React, { useState } from 'react';
import './Chat.css';

const ChatComponent = ({ handleClose }) => {
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);

    const handleSendMessage = async () => {
        const message = { Message: userMessage };
        setMessages((prevMessages) => [...prevMessages, { text: userMessage, sender: 'user' }]);

        setUserMessage('');
        setIsBotTyping(true);

        // Simulate bot typing (dots animation)
        setTimeout(async () => {
            setIsBotTyping(false);
            // Simulate bot response
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: 'Thank you for your message! How can I assist you further?', sender: 'bot' },
            ]);
        }, 2000);

        // Send the message to the backend API
        const response = await fetch('https://localhost:7003/api/chat/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: 'bot' }]);
    };

    return (
        <div className="chat-box">
            <div className="chat-header">
                <span>Chat with Us!</span>
                <button className="close-btn" onClick={handleClose}>×</button>
            </div>
            <div className="chat-body">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                {isBotTyping && (
                    <div className="message bot typing">
                        <p>...</p>
                    </div>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Ask a question..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

const Chat = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleClose = () => {
        setIsChatOpen(false);
    };

    return (
        <>
            {/* Chat button that toggles the chat box visibility */}
            <div
                className={`chat-button ${isChatOpen ? 'open-chat' : ''}`}
                onClick={toggleChat}
            >
                {isChatOpen ? '−' : '💬'}  {/* Change from 💬 to − (minus) when chat is open */}
            </div>

            {/* Show the chat component when isChatOpen is true */}
            {isChatOpen && <ChatComponent handleClose={handleClose} />}
        </>
    );
};

export default Chat;
