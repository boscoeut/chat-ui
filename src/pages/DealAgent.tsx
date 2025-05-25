import { useRef, useEffect, useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { sendMessage } from '../lib/backend';

const mockConversations = [
  { id: 1, name: 'Chat with Alice' },
  { id: 2, name: 'Project X' },
  { id: 3, name: 'Support Inquiry' },
];

export default function DealAgent() {
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user' as 'user', text: 'Hello, what is a bird?' },
    { id: 2, sender: 'agent' as 'agent', text: 'A bird is a warm-blooded, egg-laying animal that belongs to the class Aves.' },
  ]);
  const [input, setInput] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(conversations[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { id: messages.length + 1, sender: 'user' as 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    // Prepare messages for OpenAI
    const openAIMessages = [
      ...messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: input }
    ];

    try {
      const data = await sendMessage(openAIMessages);
      const aiText = data.choices[0].message.content;
      setMessages(msgs => [
        ...msgs,
        { id: msgs.length + 1, sender: 'agent' as 'agent', text: aiText }
      ]);
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { id: msgs.length + 1, sender: 'agent' as 'agent', text: 'Error: Could not get response from OpenAI.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Retry logic: resend the user message before the given agent message
  const handleRetry = async (agentMsgId: number) => {
    const agentIdx = messages.findIndex(m => m.id === agentMsgId && m.sender === 'agent');
    if (agentIdx <= 0) return;
    // Find the user message before this agent message
    const userMsg = messages[agentIdx - 1];
    if (!userMsg || userMsg.sender !== 'user') return;
    setRetryingId(agentMsgId);
    setMessages(msgs =>
      msgs.map(m =>
        m.id === agentMsgId
          ? { ...m, text: 'Regenerating...' }
          : m
      )
    );
    setLoading(true);
    // Prepare messages up to and including the user message
    const openAIMessages = [
      ...messages.slice(0, agentIdx).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: userMsg.text }
    ];
    try {
      const data = await sendMessage(openAIMessages);
      const aiText = data.choices[0].message.content;
      setMessages(msgs =>
        msgs.map(m =>
          m.id === agentMsgId
            ? { ...m, text: aiText }
            : m
        )
      );
    } catch (err) {
      setMessages(msgs =>
        msgs.map(m =>
          m.id === agentMsgId
            ? { ...m, text: 'Error: Could not get response from OpenAI.' }
            : m
        )
      );
    } finally {
      setRetryingId(null);
      setLoading(false);
    }
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
        <ChatHistory messages={messages} chatEndRef={chatEndRef} onRetry={handleRetry} />
        {loading && (
          <div className="text-center text-sm text-muted-foreground py-2">
            Waiting for response...
          </div>
        )}
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          disabled={!input.trim() || loading}
        />
      </section>
    </div>
  );
}
