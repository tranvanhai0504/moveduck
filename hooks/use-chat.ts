import { Agent } from "@/types/agent";
import { QuizResult } from "@/types/result";
import useSWR from "swr";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Define types for our chat
interface Message {
  id: string;
  content: string;
  role: string;
  createdAt: Date;
  action?: string;
  params?: Params;
}

interface Params {
  questions: QuizResult[];
}

interface ChatState {
  history: Message[];
  isSending: boolean;
  addMessage: (message: Message) => void;
  addMessages: (messages: Message[]) => void;
  clearHistory: () => void;
  setIsSending: (isSending: boolean) => void;
}

// Create Zustand store for chat history with isSending
const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      history: [],
      isSending: false,
      addMessage: (message) =>
        set((state) => ({ history: [...state.history, message] })),
      addMessages: (messages) =>
        set((state) => ({ history: [...state.history, ...messages] })),
      clearHistory: () => set({ history: [] }),
      setIsSending: (isSending) => set({ isSending }),
    }),
    {
      name: "chat-storage",
    }
  )
);

const getAgentId = async () => {
  const res = await fetch(`${API_URL}/agents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { agents } = await res.json();
  return agents as Agent[];
};

// Function to send message to the agent
const sendMessage = async (agentId: string, message: string) => {
  const res = await fetch(`${API_URL}/${agentId}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: message }),
  });
  return await res.json();
};

export const useChat = () => {
  const {
    data: agents,
    error: agentsError,
    isLoading: agentsLoading,
  } = useSWR("agents", getAgentId);

  // Get all state and actions from the store
  const {
    history,
    isSending,
    addMessage,
    addMessages,
    clearHistory,
    setIsSending,
  } = useChatStore();

  const sendUserMessage = async (userInput: string) => {
    if (!agents || agents.length === 0) {
      throw new Error("No agents available");
    }

    // Set isSending to true at the start using Zustand store action
    setIsSending(true);

    try {
      // Use the first agent from the list (you can modify this logic if needed)
      const agentId = agents[0].id;

      // Add user message to history
      const userMessage: Message = {
        id: Date.now().toString(),
        content: userInput,
        role: "user",
        createdAt: new Date(),
      };
      addMessage(userMessage);

      // Send message to the agent
      const response: [
        { action: string; text: string; user: string; params?: any }
      ] = await sendMessage(agentId, userInput);

      const resMessage = response.findLast(() => {
        return true;
      });

      console.log(resMessage);

      if (resMessage) {
        const assistantMessage: Message = {
          id: Date.now().toString() + "-response",
          content: resMessage.text || "",
          role: resMessage.user,
          createdAt: new Date(),
          action: resMessage.action,
          params: resMessage.params,
        };
        addMessage(assistantMessage);
      }

      return history;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    } finally {
      // Set isSending back to false when done using Zustand store action
      setIsSending(false);
    }
  };

  return {
    agents,
    agentsLoading,
    agentsError,
    history,
    isSending,
    sendMessage: sendUserMessage,
    clearHistory,
  };
};
