import CommanLayout from "src/Layout/CommanLayout";
import "../../../Common/styles/chat.css";
import { useEffect, useRef, useState } from "react";
import { getChatList, getMessages, postChatMessage, readChatMessage } from "src/Services/SignalR/chat_api";
import userIcon from "../../../Assets/Images/man.png"
import InsIcon from "../../../Assets/Images/ins.jpg"
import { connectToChatHub } from "src/Services/SignalR/signalrService";

export default function InstructorChat() {
    const [chatList, setChatList] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState("");
    const [threadId, setThreadId] = useState<any>()
    const [userId, setUserId] = useState<any>()
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const instructorId = 1;

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);


    useEffect(() => {
        handleGetList();
    }, []);

    const connectToHub = async (id: string) => {
        await connectToChatHub(id, (newMessage: any) => {
            // Append new message received via SignalR to state
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
    };

    const handleGetList = async () => {
        try {
            const response = await getChatList(instructorId);
            const chats = response.data;
            setChatList(chats);
        } catch (error) {
            console.error(error);
        }
    };


    const handleGetMessages = async (threadId: any) => {
        try {
            const res = await getMessages(threadId);
            const fetchedMessages = res.data;

            setMessages(fetchedMessages);

            for (const msg of fetchedMessages) {
                if (
                    msg.senderRole === 1 && // User message
                    !msg.isRead &&
                    msg.messageText !== "init"
                ) {
                    await readChatMessage(msg.chatId);
                }
            }

            handleGetList();
        } catch (error: any) {
            console.error(error);
        }
    }

    const sendMessage = async () => {
        if (!messageText.trim()) return;

        const body = {
            threadId: threadId,
            userId,
            instructorId,
            senderRole: 2,
            messageText
        };

        try {
            await postChatMessage(body);
            setMessageText("");
            handleGetMessages(threadId);
        } catch (err: any) {
            alert(err.response.message);
        }
    };

    return (
        <CommanLayout name="Messages" path="messages">
            <div className="i-chat-outer">
                <div className="i-chat-inner">
                    {chatList.map((chat, index) => (
                        <div
                            key={index}
                            className={`chat-list-item ${selectedThreadId === chat.threadId ? "selected" : ""}`}
                            onClick={() => {
                                setThreadId(chat.threadId);
                                setUserId(chat.userId);
                                setSelectedThreadId(chat.threadId);
                                handleGetMessages(chat.threadId);
                                connectToHub(chat.threadId)
                            }}
                        >
                            <div className="chat-user-info">
                                <div className="chat-name">{chat.name}</div>
                                <div className="chat-last-msg">
                                    {chat.lastMessage !== "init" ? chat.lastMessage : "New chat started"}
                                </div>
                            </div>
                            <div className="chat-meta">
                                {chat.unreadCount > 0 && (
                                    <div className="chat-unread">{chat.unreadCount}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="i-chat-inner1">
                    <div className="chat-container">
                        <div className="chat-messages" ref={containerRef}>
                            {messages
                                .filter((msg) => msg.messageText !== "init")
                                .map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`chat-message ${msg.senderRole === 1 ? "left" : "right"}`}
                                    >
                                        {msg.senderRole === 1 && (
                                            <img src={userIcon} alt="user" className="avatar" />
                                        )}
                                        <div
                                            className={`message-bubble ${msg.senderRole === 1 ? "message-right1" : "message-left1"
                                                }`}
                                        >
                                            {msg.messageText}
                                        </div>
                                        {msg.senderRole !== 1 && (
                                            <img src={InsIcon} alt="instructor" className="avatar" />
                                        )}

                                    </div>
                                ))}
                            <div ref={messagesEndRef} />
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
                </div>
            </div>
        </CommanLayout>
    );
}
