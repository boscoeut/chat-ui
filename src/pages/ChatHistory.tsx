import { Copy, RotateCcw } from 'lucide-react';
import { useState } from 'react';

type Message = { id: number; sender: 'user' | 'agent'; text: string };

type ChatHistoryProps = {
  messages: Message[];
  chatEndRef?: React.RefObject<HTMLDivElement>;
  onRetry?: (agentMsgId: number) => void;
};

export default function ChatHistory({ messages, chatEndRef, onRetry }: ChatHistoryProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-background">
      {messages.map(msg => (
        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
          <div className={`relative rounded-lg px-4 py-2 max-w-[70%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {msg.text}
          </div>
          {msg.sender === 'agent' && (
            <div className="flex gap-2 mt-2 ml-1">
              <button
                className="p-1 rounded hover:bg-accent"
                title="Copy"
                onClick={() => handleCopy(msg.text, msg.id)}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded hover:bg-accent"
                title="Retry"
                onClick={() => onRetry && onRetry(msg.id)}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {copiedId === msg.id && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded shadow ml-2">Copied!</span>
              )}
            </div>
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
} 