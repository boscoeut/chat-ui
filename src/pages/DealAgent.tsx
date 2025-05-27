import { useEffect, useRef, useState } from 'react';
import { sendMessageStream, sendMessage } from '../lib/backend';
import { useAppStore } from '../store/app';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';

type DealAgentProps = {
  streaming?: boolean;
};

export default function DealAgent({ streaming = true }: DealAgentProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const {
    conversations,
    selectedConversation,
    messagesByConversation,
    addMessage,
    updateMessage,
    updateConversationName,
  } = useAppStore();

  const messages = messagesByConversation[selectedConversation] || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: messages.length + 1, sender: 'user' as const, text: input };
    addMessage(selectedConversation, userMessage);

    // If this is the first message in the conversation, use it to name the chat
    if (messages.length === 0) {
      // Truncate the message to a reasonable length for the title
      const chatName = input.length > 30 ? input.slice(0, 30) + '...' : input;
      updateConversationName(selectedConversation, chatName);
    }

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

    // Add placeholder agent message
    const agentId = messages.length + 2;
    addMessage(selectedConversation, {
      id: agentId,
      sender: 'agent',
      text: ''
    });

    try {
      if (streaming) {
        await sendMessageStream(openAIMessages, (partialText) => {
          updateMessage(selectedConversation, agentId, partialText);
        });
      } else {
        const data = await sendMessage(openAIMessages);
        const aiText = data.choices[0].message.content;
        updateMessage(selectedConversation, agentId, aiText);
      }
    } catch (err) {
      updateMessage(selectedConversation, agentId, 'Error: Could not get response from OpenAI.');
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
    updateMessage(selectedConversation, agentMsgId, '');
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
      if (streaming) {
        await sendMessageStream(openAIMessages, (partialText) => {
          updateMessage(selectedConversation, agentMsgId, partialText);
        });
      } else {
        const data = await sendMessage(openAIMessages);
        const aiText = data.choices[0].message.content;
        updateMessage(selectedConversation, agentMsgId, aiText);
      }
    } catch (err) {
      updateMessage(selectedConversation, agentMsgId, 'Error: Could not get response from OpenAI.');
    } finally {
      setRetryingId(null);
      setLoading(false);
    }
  };

  // Edit logic: update user message and regenerate following agent response
  const handleEditUserMessage = async (id: number, newText: string) => {
    updateMessage(selectedConversation, id, newText);
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
    updateMessage(selectedConversation, agentMsg.id, '');

    try {
      if (streaming) {
        await sendMessageStream(openAIMessages, (partialText) => {
          updateMessage(selectedConversation, agentMsg.id, partialText);
        });
      } else {
        const data = await sendMessage(openAIMessages);
        const aiText = data.choices[0].message.content;
        updateMessage(selectedConversation, agentMsg.id, aiText);
      }
    } catch (err) {
      updateMessage(selectedConversation, agentMsg.id, 'Error: Could not get response from OpenAI.');
    }
  };

  return (
    <div className="flex h-full min-h-0">
      <ChatSidebar open={sidebarOpen} />
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
          showAttachment={false}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          disabled={!input.trim() || loading}
        />
      </section>
    </div>
  );
}
