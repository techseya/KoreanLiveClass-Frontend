import React, { useEffect, useState } from "react";
import "../../Common/styles/chat.css";
import { getMessages, initChat, postChatMessage } from "src/Services/SignalR/chat_api";
import userIcon from "../../Assets/Images/man.png"
import InsIcon from "../../Assets/Images/ins.jpg"

interface Message {
    senderRole: number;
    messageText: string;
    sentAt: string;
}

export default function UserChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState("");
    const [threadId, setThreadId] = useState<any>()

    let userId = Number(sessionStorage.getItem("id"));
    const instructorId = 1;
    let tId = sessionStorage.getItem("threadId");

    const handleInitChat = async () => {
        const body = {
            threadId: "00000000-0000-0000-0000-000000000000",
            userId,
            instructorId,
            senderRole: 1,
            messageText: "init"
        };
    
        try {
            const res = await initChat(body);
            const actualThreadId = res.data?.data?.threadId;
            sessionStorage.setItem("threadId", actualThreadId);
            setThreadId(actualThreadId);
            fetchMessages(actualThreadId); // <== Fetch immediately after init
        } catch (err) {
            console.error("Failed to initialize chat", err);
        }
    };
    

    const fetchMessages = async (id:any) => {
        try {
            const res = await getMessages(id);
            setMessages(res.data);
        } catch (error: any) {
            if (error.response?.data?.status === 400) {
                handleInitChat();
            }
            console.error(error.response?.data?.status);
        }
    };

    useEffect(() => {
        const storedThreadId = sessionStorage.getItem("threadId");
        const storedUserId = Number(sessionStorage.getItem("id"));
        userId = storedUserId;
    
        if (storedThreadId && storedThreadId !== "00000000-0000-0000-0000-000000000000") {
            setThreadId(storedThreadId);
            fetchMessages(storedThreadId);
        } else {
            handleInitChat();
        }
    }, []);
    

    useEffect(() => {
        fetchMessages(threadId);
    }, [threadId]);

    const sendMessage = async () => {
        if (!messageText.trim()) return;

        const body = {
            threadId: threadId,
            userId,
            instructorId,
            senderRole: 1,
            messageText
        };

        try {
            await postChatMessage(body);
            setMessageText("");
            fetchMessages(threadId);
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages
                    .filter((msg) => msg.messageText !== "init")
                    .map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.senderRole === 1 ? "right" : "left"}`}
                        >
                            {msg.senderRole !== 1 && (
                                <img src={InsIcon} alt="instructor" className="avatar" />
                            )}
                            <div
                                className={`message-bubble ${msg.senderRole === 1 ? "message-right" : "message-left"
                                    }`}
                            >
                                {msg.messageText}
                            </div>
                            {msg.senderRole === 1 && (
                                <img src={userIcon} alt="user" className="avatar" />
                            )}
                        </div>
                    ))}
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
