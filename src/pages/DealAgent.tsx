import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

const mockConversations = [
  { id: 1, name: 'Chat with Alice' },
  { id: 2, name: 'Project X' },
  { id: 3, name: 'Support Inquiry' },
];

const mockMessages = [
  { id: 1, sender: 'user' as 'user', text: 'Hello, what is a bird?' },
  { id: 2, sender: 'agent' as 'agent', text: 'A bird is a warm-blooded, egg-laying animal that belongs to the class Aves.' },
];

export default function DealAgent() {
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(conversations[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: messages.length + 1, sender: 'user' as 'user', text: input }]);
    setInput('');
  };

  const handleNewChat = () => {
    const newId = conversations.length + 1;
    const newConv = { id: newId, name: `New Chat ${newId}` };
    setConversations([newConv, ...conversations]);
    setSelectedConversation(newId);
    setMessages([]);
  };

  return (
    <div className="flex h-full min-h-0">
      <ChatSidebar
        open={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        onNewChat={handleNewChat}
      />
      <section className="flex-1 flex flex-col h-full">
        <ChatHistory messages={messages} />
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          disabled={!input.trim()}
        />
      </section>
    </div>
  );
}
