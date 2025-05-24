import React, { useEffect, useRef, useState } from "react";
import "../../Common/styles/chat.css";
import { getMessages, initChat, postChatMessage } from "src/Services/SignalR/chat_api";
import { connectToChatHub, sendMessage as signalRSendMessage, disconnect } from "../../Services/SignalR/signalrService";
import userIcon from "../../Assets/Images/man.png";
import InsIcon from "../../Assets/Images/ins.jpg";

interface Message {
  senderRole: number;
  messageText: string;
  sentAt: string;
}

export default function UserChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const userId = Number(sessionStorage.getItem("id"));
  const instructorId = 1;

  // Scroll chat to bottom whenever messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize chat thread (from API or create new)
  const handleInitChat = async () => {
    try {
      const body = {
        threadId: "00000000-0000-0000-0000-000000000000",
        userId,
        instructorId,
        senderRole: 1,
        messageText: "init",
      };

      const res = await initChat(body);
      const actualThreadId = res.data?.data?.threadId;

      if (actualThreadId) {
        sessionStorage.setItem("threadId", actualThreadId);
        setThreadId(actualThreadId);
        // Fetch messages after init
        await fetchMessages(actualThreadId);
        // Connect to SignalR after threadId is ready
        connectToHub(actualThreadId);
      }
    } catch (err) {
      console.error("Failed to initialize chat", err);
    }
  };

  // Fetch messages from API
  const fetchMessages = async (id: string) => {
    try {
      const res = await getMessages(id);
      setMessages(res.data);
    } catch (error: any) {
      if (error.response?.data?.status === 400) {
        handleInitChat();
      } else {
        console.error(error.response?.data?.status);
      }
    }
  };

  // Connect to SignalR Hub and handle incoming messages
  const connectToHub = async (id: string) => {
    await connectToChatHub(id, (newMessage: Message) => {
      // Append new message received via SignalR to state
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  };

  // On mount, check for existing threadId or init new chat
  useEffect(() => {
    const storedThreadId = sessionStorage.getItem("threadId");

    if (storedThreadId && storedThreadId !== "00000000-0000-0000-0000-000000000000") {
      setThreadId(storedThreadId);
      fetchMessages(storedThreadId);
      connectToHub(storedThreadId);
    } else {
      handleInitChat();
    }

    // Cleanup SignalR connection on unmount
    return () => {
      disconnect();
    };
  }, []);

  // Send message using SignalR (preferred) and fallback to API post
  const sendMessage = async () => {
    if (!messageText.trim() || !threadId) return;

      // fallback to postChatMessage API if SignalR fails
      try {
        const body = {
          threadId,
          userId,
          instructorId,
          senderRole: 1,
          messageText,
        };
        await postChatMessage(body);
        setMessageText("");
        fetchMessages(threadId);
      } catch (apiErr: any) {
        alert(apiErr.response?.message || "Failed to send message");
      }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={containerRef}>
        {messages
          .filter((msg) => msg.messageText !== "init")
          .map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.senderRole === 1 ? "right" : "left"}`}
            >
              {msg.senderRole !== 1 && <img src={InsIcon} alt="instructor" className="avatar" />}
              <div
                className={`message-bubble ${
                  msg.senderRole === 1 ? "message-right" : "message-left"
                }`}
              >
                {msg.messageText}
              </div>
              {msg.senderRole === 1 && <img src={userIcon} alt="user" className="avatar" />}
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
