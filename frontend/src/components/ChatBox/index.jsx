import { useState } from "react";
import { serverUrl } from "../../constants";



const ChatBox = ({chatEndpoint, initialMessage}) => {
    const initialChatLog = { role: 'ai', msg: initialMessage };
    const [isAILoading, setIsAILoading] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatLog, setChatLog] = useState([initialChatLog]);
    const token = localStorage.getItem('token');

    const onChatInput = (e) => {
        setChatInput(e.target.value);
    }

    const onChatSubmit = async () => {
        const message = chatInput.trim();
        if (!message) return;

        // Add user's message
        const userMsg = { role: 'user', msg: message };
        setChatLog(prevLog => [...prevLog, userMsg]);
        setIsAILoading(true);
        // Send message to backend AI route
        try {
            const url = serverUrl + chatEndpoint;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            if (response.status === 401) {
                const aiResponse = { role: 'ai', msg: 'Token expired, redirecting to login page' };
                setChatLog(prevLog => [...prevLog, aiResponse]);
                setTimeout(() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }, 1500);
            }
            const data = await response.json();
            const aiResponse = { role: 'ai', msg: data.reply };
            setIsAILoading(false);
            setChatLog(prevLog => [...prevLog, aiResponse]);
        } catch (err) {
            console.error('AI Error:', err);
            const aiResponse = { role: 'ai', msg: "Something went wrong", isError: true };
            setIsAILoading(false);
            setChatLog(prevLog => [...prevLog, aiResponse]);
        }
        setChatInput('');
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat with AI</h3>
            <div id="chat-box" className="h-64 overflow-y-auto bg-gray-50 p-3 rounded mb-4">
                {
                    chatLog.map((chatMsg, idx) => {
                        let className = chatMsg.role === "ai" ? "text-gray-600 mb-4" : 'text-gray-800 text-end mb-2';
                        const role = chatMsg.role === "ai" ? "AI" : "You";
                        if (chatMsg.isError) {
                            className = "text-red-600";
                        }
                        return <p className={className} key={idx}>{`${role}: ${chatMsg.msg}`}</p>
                    })
                }
                {
                    !isAILoading
                        ? <></>
                        : <p className="text-gray-600 mb-4" key="ld">AI is thinking...</p>
                }
            </div>
            <form id="chat-form">
                <input
                    id="chat-input" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" type="text" placeholder="Type your message..."
                    value={chatInput}
                    onChange={onChatInput}
                />
                <button
                    type="button" className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
                    onClick={onChatSubmit}
                >
                    Send
                </button>
            </form>
        </div>
    )

}


export default ChatBox;