import CommanLayout from "src/Layout/CommanLayout";
import "../../../Common/styles/chat.css";
import { useEffect, useRef, useState } from "react";
import { getChatList, getMessages, postChatMessage, readChatMessage } from "src/Services/SignalR/chat_api";
import userIcon from "../../../Assets/Images/man.png"
import InsIcon from "../../../Assets/Images/ins.jpg"
import { connectToChatHub } from "src/Services/SignalR/signalrService";
import React from "react";
import { debounce } from "lodash";

export default function InstructorChat() {
    const [chatList, setChatList] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState("");
    const [threadId, setThreadId] = useState<any>()
    const [userId, setUserId] = useState<any>()
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [connectedThreadIds, setConnectedThreadIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyUnread, setShowOnlyUnread] = useState(false);

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
        if (!connectedThreadIds.has(id)) {
            await connectToChatHub(id, (newMessage: any) => {
                setMessages((prev) => [...prev, newMessage]);
            });
            setConnectedThreadIds((prev) => new Set(prev).add(id));
        }
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
        handleGetList();
        try {
            const res = await getMessages(threadId);
            const fetchedMessages = res.data;
            setMessages(fetchedMessages);
            for (const msg of fetchedMessages) {
                if (msg.senderRole === 1 && !msg.isRead && msg.messageText !== "init") {
                    await readChatMessage(msg.chatId);
                }
            }

            await connectToHub(threadId); // ensure connected

        } catch (error: any) {
            console.error(error);
        }
    };

    const handleChatClick = async () => {
        if (!threadId) return;

        for (const msg of messages) {
            if (
                msg.senderRole === 2 &&
                !msg.isRead &&
                msg.messageText !== "init" &&
                msg.chatId
            ) {
                await readChatMessage(msg.chatId);
            }
        }

        handleGetList()
    };

    const sendMessage = async () => {
        if (!messageText.trim()) return;

        const body = {
            threadId,
            userId,
            instructorId,
            senderRole: 2,
            messageText
        };

        try {
            await postChatMessage(body);
            setMessageText("");
            await connectToHub(threadId); // just in case it's not connected
            handleGetMessages(threadId);
        } catch (err: any) {
            alert(err.response.message);
        }
    };

    const debouncedGetUnread = React.useMemo(
        () => debounce(() => handleChatClick(), 2000), // 2 seconds debounce
        []
      );
    
      React.useEffect(() => {
        const handleUserActivity = () => {
          debouncedGetUnread();
        };
    
        window.addEventListener("mousemove", handleUserActivity);
        window.addEventListener("keydown", handleUserActivity);
        window.addEventListener("click", handleUserActivity);
    
        return () => {
          window.removeEventListener("mousemove", handleUserActivity);
          window.removeEventListener("keydown", handleUserActivity);
          window.removeEventListener("click", handleUserActivity);
          debouncedGetUnread.cancel(); // Cleanup debounce
        };
      }, [debouncedGetUnread]);


    return (
        <CommanLayout name="Messages" path="messages">
            <div className="i-chat-outer">
                <div className="i-chat-inner">
                    <div className="chat-search-container">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="chat-search-bar"
                        />
                        {searchTerm && (
                            <span className="clear-icon" onClick={() => setSearchTerm("")}>
                                &times;
                            </span>
                        )}
                    </div>


                        <label style={{ marginRight: "5px", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "end" }}>
                            <input
                                type="checkbox"
                                checked={showOnlyUnread}
                                onChange={(e) => setShowOnlyUnread(e.target.checked)}
                                style={{ marginRight: "5px" }}
                            />
                            Unread
                        </label>

                    {chatList
                        .filter(chat =>
                            chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
                        ).filter(chat => !showOnlyUnread || chat.unreadCount > 0).map((chat, index) => (
                            <div
                                key={index}
                                className={`chat-list-item ${selectedThreadId === chat.threadId ? "selected" : ""}`}
                                onClick={() => {
                                    setThreadId(chat.threadId);
                                    setUserId(chat.userId);
                                    setSelectedThreadId(chat.threadId);
                                    handleGetMessages(chat.threadId);
                                    connectToHub(chat.threadId)
                                    handleChatClick()
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
                                .filter((msg) => msg.messageText !== "init" && msg.userId === userId)
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
