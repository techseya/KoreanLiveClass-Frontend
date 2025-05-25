import React, { useEffect, useRef, useState } from "react";
import "../../Common/styles/chat.css";
import { getMessages, initChat, postChatMessage, readChatMessage } from "src/Services/SignalR/chat_api";
import { connectToChatHub, sendMessage as signalRSendMessage, disconnect } from "../../Services/SignalR/signalrService";
import userIcon from "../../Assets/Images/man.png";
import InsIcon from "../../Assets/Images/ins.jpg";

interface Message {
  chatId?: string;
  senderRole: number;
  messageText: string;
  sentAt?: string;
  isRead: boolean;
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
        await fetchMessages(actualThreadId);
        connectToHub(actualThreadId);
      }
    } catch (err) {
      console.error("Failed to initialize chat", err);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      const res = await getMessages(id);
      setMessages(res.data.filter((msg: Message) => msg.messageText !== "init"));
    } catch (error: any) {
      if (error.response?.data?.status === 400) {
        handleInitChat();
      } else {
        console.error(error.response?.data?.status);
      }
    }
  };

  const connectToHub = async (id: string) => {
    await connectToChatHub(id, (newMessage: Message) => {
      if (newMessage.messageText !== "init") {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
  };

  useEffect(() => {
    const storedThreadId = sessionStorage.getItem("threadId");

    if (storedThreadId && storedThreadId !== "00000000-0000-0000-0000-000000000000") {
      setThreadId(storedThreadId);
      fetchMessages(storedThreadId);
      connectToHub(storedThreadId);
    } else {
      handleInitChat();
    }

    return () => {
      disconnect();
    };
  }, []);

  const handleChatClick = async () => {
    if (!threadId) return;

    const updatedMessages = [...messages];

    for (const msg of updatedMessages) {
      if (
        msg.senderRole === 2 &&
        !msg.isRead &&
        msg.messageText !== "init" &&
        msg.chatId
      ) {
        await readChatMessage(msg.chatId);
      }
    }

    fetchMessages(threadId)
  };


  const sendMessage = async () => {
    if (!messageText.trim() || !threadId) return;

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

  // Determine where to insert the "unread" separator
  const renderMessagesWithUnreadSeparator = () => {
    const indexOfFirstUnread = messages.findIndex((msg) => !msg.isRead && msg.senderRole === 2);

    return messages.map((msg, index) => {
      const showSeparator = index === indexOfFirstUnread;

      return (
        <React.Fragment key={index}>
          {showSeparator && (
            <div className="unread-separator"><div>unread</div></div>
          )}
          <div className={`chat-message ${msg.senderRole === 1 ? "right" : "left"}`}>
            {msg.senderRole !== 1 && <img src={InsIcon} alt="instructor" className="avatar" />}
            <div
              className={`message-bubble ${msg.senderRole === 1 ? "message-right" : "message-left"
                }`}
            >
              {msg.messageText}
            </div>
            {msg.senderRole === 1 && <img src={userIcon} alt="user" className="avatar" />}
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="chat-container" onClick={handleChatClick}>
      <div className="chat-messages" ref={containerRef}>
        {renderMessagesWithUnreadSeparator()}
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
