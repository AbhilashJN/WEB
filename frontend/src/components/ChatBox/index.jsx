const ChatBox = ({ onChatInput, onChatSubmit, chatInputValue, chatLog, isLoading }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat with AI</h3>
            <div id="chat-box" className="h-48 overflow-y-auto bg-gray-50 p-3 rounded mb-4">
                {
                    chatLog.map((chatMsg,idx) => {
                        let className = chatMsg.role === "ai" ? "text-gray-600 mb-4" : 'text-gray-800 text-end mb-2';
                        const role = chatMsg.role==="ai" ? "AI" : "You";
                        if (chatMsg.isError) {
                            className = "text-red-600";
                        }
                        return <p className={className} key={idx}>{`${role}: ${chatMsg.msg}`}</p>
                    })
                }
                {
                    !isLoading
                    ? <></>
                    : <p className="text-gray-600 mb-4" key="ld">AI is thinking...</p>
                }
            </div>
            <form id="chat-form">
                <input
                    id="chat-input" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" type="text" placeholder="Type your message..."
                    value={chatInputValue}
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