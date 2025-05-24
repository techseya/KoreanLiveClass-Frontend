// services/signalrService.ts
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const connectToChatHub = async (
  threadId: string,
  onReceiveMessage: (message: any) => void
) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`/chatHub?threadId=${threadId}`)
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessage", onReceiveMessage);

  try {
    await connection.start();
    console.log("Connected to SignalR Hub");
  } catch (err) {
    console.error("SignalR connection error:", err);
  }
};

export const sendMessage = async (threadId: string, message: string) => {
  if (!connection) return;
  try {
    await connection.invoke("SendMessage", threadId, message);
  } catch (err) {
    console.error("SendMessage failed:", err);
  }
};

export const disconnect = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
  }
};
