import { create } from 'zustand';

type Conversation = { id: number; name: string };
type Message = { id: number; sender: 'user' | 'agent'; text: string };

type AppState = {
  // Sidebar state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Chat state
  conversations: Conversation[];
  messagesByConversation: { [id: number]: Message[] };
  selectedConversation: number;
  setSelectedConversation: (id: number) => void;
  addConversation: (name: string) => void;
  deleteConversation: (id: number) => void;
  addMessage: (conversationId: number, message: Message) => void;
  updateMessage: (conversationId: number, messageId: number, text: string) => void;
  updateConversationName: (id: number, name: string) => void;

  // Deal state
  selectedDeal: string | null;
  setSelectedDeal: (dealId: string | null) => void;
};

const initialConversations = [
  { id: 1, name: 'New Chat' },
];

const initialMessages: { [id: number]: Message[] } = {
  1: [],
};

export const useAppStore = create<AppState>((set) => ({
  // Sidebar state
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Chat state
  conversations: initialConversations,
  messagesByConversation: initialMessages,
  selectedConversation: initialConversations[0].id,
  setSelectedConversation: (id) => set({ selectedConversation: id }),
  addConversation: (name) => set((state) => {
    const newId = Math.max(...state.conversations.map(c => c.id)) + 1;
    return {
      conversations: [{ id: newId, name }, ...state.conversations],
      messagesByConversation: { ...state.messagesByConversation, [newId]: [] },
      selectedConversation: newId,
    };
  }),
  deleteConversation: (id) => set((state) => {
    // Don't delete if it's the last conversation
    if (state.conversations.length <= 1) {
      return state;
    }

    const newConversations = state.conversations.filter(c => c.id !== id);
    const newMessages = { ...state.messagesByConversation };
    delete newMessages[id];
    
    // If we deleted the selected conversation, select the first available one
    const newSelected = state.selectedConversation === id 
      ? (newConversations[0]?.id || 0)
      : state.selectedConversation;

    return {
      conversations: newConversations,
      messagesByConversation: newMessages,
      selectedConversation: newSelected,
    };
  }),
  addMessage: (conversationId, message) => set((state) => ({
    messagesByConversation: {
      ...state.messagesByConversation,
      [conversationId]: [...(state.messagesByConversation[conversationId] || []), message],
    },
  })),
  updateMessage: (conversationId, messageId, text) => set((state) => ({
    messagesByConversation: {
      ...state.messagesByConversation,
      [conversationId]: state.messagesByConversation[conversationId].map(m =>
        m.id === messageId ? { ...m, text } : m
      ),
    },
  })),
  updateConversationName: (id, name) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === id ? { ...conv, name } : conv
    ),
  })),

  // Deal state
  selectedDeal: null,
  setSelectedDeal: (dealId) => set({ selectedDeal: dealId }),
})); 