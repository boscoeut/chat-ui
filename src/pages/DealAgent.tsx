import { useRef, useEffect, useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { sendMessage } from '../lib/backend';
import { useAppStore } from '../store/app';

const initialConversations = [
  { id: 1, name: 'Chat with Alice' },
  { id: 2, name: 'Project X' },
  { id: 3, name: 'Support Inquiry' },
];

const initialMessages: { [id: number]: { id: number; sender: 'user' | 'agent'; text: string }[] } = {
  1: [
    { id: 1, sender: 'user', text: 'Hello, what is a bird?' },
    { id: 2, sender: 'agent', text: 'A bird is a warm-blooded, egg-laying animal that belongs to the class Aves.' },
  ],
  2: [],
  3: [],
};

export default function DealAgent() {
  const [conversations, setConversations] = useState(initialConversations);
  const [messagesByConversation, setMessagesByConversation] = useState(initialMessages);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0].id);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const toggleSidebar = useAppStore(s => s.toggleSidebar);

  const messages = messagesByConversation[selectedConversation] || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessagesByConversation(prev => {
      const msgs = prev[selectedConversation] || [];
      return {
        ...prev,
        [selectedConversation]: [
          ...msgs,
          { id: msgs.length + 1, sender: 'user' as 'user', text: input }
        ]
      };
    });
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
      setMessagesByConversation(prev => {
        const msgs = prev[selectedConversation] || [];
        return {
          ...prev,
          [selectedConversation]: [
            ...msgs,
            { id: msgs.length + 1, sender: 'agent' as 'agent', text: aiText }
          ]
        };
      });
    } catch (err) {
      setMessagesByConversation(prev => {
        const msgs = prev[selectedConversation] || [];
        return {
          ...prev,
          [selectedConversation]: [
            ...msgs,
            { id: msgs.length + 1, sender: 'agent' as 'agent', text: 'Error: Could not get response from OpenAI.' }
          ]
        };
      });
    } finally {
      setLoading(false);
    }
  };

  // Retry logic: resend the user message before the given agent message
  const handleRetry = async (agentMsgId: number) => {
    const msgs = messagesByConversation[selectedConversation] || [];
    const agentIdx = msgs.findIndex(m => m.id === agentMsgId && m.sender === 'agent');
    if (agentIdx <= 0) return;
    // Find the user message before this agent message
    const userMsg = msgs[agentIdx - 1];
    if (!userMsg || userMsg.sender !== 'user') return;
    setRetryingId(agentMsgId);
    setMessagesByConversation(prev => ({
      ...prev,
      [selectedConversation]: prev[selectedConversation].map(m =>
        m.id === agentMsgId ? { ...m, text: 'Regenerating...' } : m
      )
    }));
    setLoading(true);
    // Prepare messages up to and including the user message
    const openAIMessages = [
      ...msgs.slice(0, agentIdx).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: userMsg.text }
    ];
    try {
      const data = await sendMessage(openAIMessages);
      const aiText = data.choices[0].message.content;
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map(m =>
          m.id === agentMsgId ? { ...m, text: aiText } : m
        )
      }));
    } catch (err) {
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map(m =>
          m.id === agentMsgId ? { ...m, text: 'Error: Could not get response from OpenAI.' } : m
        )
      }));
    } finally {
      setRetryingId(null);
      setLoading(false);
    }
  };

  // Edit logic: update user message and regenerate following agent response
  const handleEditUserMessage = async (id: number, newText: string) => {
    setMessagesByConversation(prev => ({
      ...prev,
      [selectedConversation]: prev[selectedConversation].map(m =>
        m.id === id ? { ...m, text: newText } : m
      )
    }));
    const msgs = messagesByConversation[selectedConversation] || [];
    const userIdx = msgs.findIndex(m => m.id === id && m.sender === 'user');
    if (userIdx === -1 || userIdx === msgs.length - 1) return;
    const agentMsg = msgs[userIdx + 1];
    if (!agentMsg || agentMsg.sender !== 'agent') return;
    // Prepare messages up to and including the edited user message
    const openAIMessages = [
      ...msgs.slice(0, userIdx).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: newText }
    ];
    // Show regenerating...
    setMessagesByConversation(prev => ({
      ...prev,
      [selectedConversation]: prev[selectedConversation].map(m =>
        m.id === agentMsg.id ? { ...m, text: 'Regenerating...' } : m
      )
    }));
    try {
      const data = await sendMessage(openAIMessages);
      const aiText = data.choices[0].message.content;
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map(m =>
          m.id === agentMsg.id ? { ...m, text: aiText } : m
        )
      }));
    } catch (err) {
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map(m =>
          m.id === agentMsg.id ? { ...m, text: 'Error: Could not get response from OpenAI.' } : m
        )
      }));
    }
  };

  const handleNewChat = () => {
    const newId = Math.max(...conversations.map(c => c.id)) + 1;
    const newConv = { id: newId, name: `New Chat ${newId}` };
    setConversations([newConv, ...conversations]);
    setMessagesByConversation(prev => ({ ...prev, [newId]: [] }));
    setSelectedConversation(newId);
    setInput('');
  };

  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
    setInput('');
  };

  return (
    <div className="flex h-full min-h-0">
      <ChatSidebar
        open={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />
      <section className="flex-1 flex flex-col h-full">
        <ChatHistory
          messages={messages}
          chatEndRef={chatEndRef as React.RefObject<HTMLDivElement>}
          onRetry={handleRetry}
          onEditUserMessage={handleEditUserMessage}
        />
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
