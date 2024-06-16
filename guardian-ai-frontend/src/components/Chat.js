import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LinearProgress, TextField, Button, Box, Typography } from '@mui/material';

const TypingAnimationText = ({ text, triggerAnimation }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (text.length > 0 && triggerAnimation) {
            let index = 0;
            const interval = setInterval(() => {
                index++;
                setDisplayedText(text.substring(0, index));
                if (index === text.length) {
                    clearInterval(interval);
                }
            }, 10);
            return () => clearInterval(interval);
        } else {
            setDisplayedText(text);
        }
    }, [text, triggerAnimation]);

    return <span>{displayedText}</span>;
};

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastApiMessageId, setLastApiMessageId] = useState(null);

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages'));
        if (savedMessages) {
            setMessages(savedMessages);
            const lastApiMessage = savedMessages.slice().reverse().find(m => m.type === 'api');
            if (lastApiMessage) setLastApiMessageId(lastApiMessage.id);
        } else {
            const defaultMessage = {
                type: 'api',
                text: "This chat provides updates on the humanitarian situation in Gaza based on the latest information available on the web, Telegram, Twitter, and YouTube.\nYou can ask questions like:\n1. What is the situation of the water in the Gaza Strip?\n2. How many trucks entered yesterday?\n3. What is the situation of starvation in Rafah?",
                id: Date.now()
            };
            setMessages([defaultMessage]);
            setLastApiMessageId(defaultMessage.id);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    const handleClearChat = () => {
        // Define the specific message to keep
        const defaultMessage = {
            type: 'api',
            text: "This chat provides updates on the humanitarian situation in Gaza based on the latest information available on the web, Telegram, Twitter, and YouTube.\nYou can ask questions like:\n1. What is the situation of the water in the Gaza Strip?\n2. How many trucks entered yesterday?\n3. What is the situation of starvation in Rafah?",
            id: Date.now() // Note: This gives a new ID to the message; consider if this is acceptable or if you need to preserve the original ID
        };
        // Reset messages to only include the defaultMessage
        setMessages([defaultMessage]);
    };

    const formatMessageText = (text) => {
        return text.split('\n').map((line, index) => {
            const markdownUrlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
            let match;
            const parts = [];
            let lastEnd = 0;
            while ((match = markdownUrlRegex.exec(line)) !== null) {
                parts.push(line.substring(lastEnd, match.index));
                parts.push(<a href={match[2]} target="_blank" rel="noopener noreferrer" key={index + match[1]}>{match[1]}</a>);
                lastEnd = match.index + match[0].length;
            }
            parts.push(line.substring(lastEnd));
            return <div key={index} style={{ padding: '8px 0' }}>{parts}</div>;
        });
    };


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            const tempId = Date.now();
            const userMessage = { type: 'user', text: newMessage, id: tempId };
            setMessages(prevMessages => [...prevMessages, userMessage]);
            setNewMessage('');

            setLoading(true);
            try {
                const headers = {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                };
                const response = await axios.post(`${process.env.REACT_APP_CHAT_APP}/chat`, { message: newMessage }, { headers });
                const answer = response.data.response; // Assuming the API returns a string response
                const formattedAnswer = { type: 'api', text: answer, id: Date.now() }; // Keep API response as is
                setMessages(prevMessages => [...prevMessages, formattedAnswer]);
                setLastApiMessageId(formattedAnswer.id);
            } catch (error) {
                console.error("Error sending message to the API: ", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh', margin: 'auto', maxWidth: 500 }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', padding: 3 }}>
                {messages.map((message, index) => (
                    <Box key={index} sx={{
                        background: message.type === 'user' ? 'blue' : 'white',
                        color: message.type === 'user' ? 'white' : 'black',
                        textAlign: 'left',
                        padding: '10px',
                        margin: '10px 0',
                        borderRadius: '10px',
                        boxShadow: 3,
                        maxWidth: '80%',
                        marginLeft: message.type === 'user' ? 'auto' : undefined,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                    }}>
                        {message.type === 'api' ? formatMessageText(message.text) : message.text}
                    </Box>
                ))}
                {loading && <LinearProgress />}
            </Box>
            <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 2, padding: 2 }}>
                <TextField
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={4}
                    variant="outlined"
                    label="Ask something..."
                    value={newMessage}
                    onKeyPress={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            handleSendMessage(e);
                        }
                    }
                    }
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="contained" color="primary" type="submit">
                    Send
                </Button>
                <Button variant="contained" color="secondary" onClick={handleClearChat}>
                    Clear Chat
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;
