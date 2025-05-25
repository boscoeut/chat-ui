import { Copy, RotateCcw, Pencil, Check, X } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Message = { id: number; sender: 'user' | 'agent'; text: string };

type ChatHistoryProps = {
  messages: Message[];
  chatEndRef?: React.RefObject<HTMLDivElement>;
  onRetry?: (agentMsgId: number) => void;
  onEditUserMessage?: (id: number, newText: string) => void;
};

export default function ChatHistory({ messages, chatEndRef, onRetry, onEditUserMessage }: ChatHistoryProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCopy = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  };

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = (id: number) => {
    if (onEditUserMessage) onEditUserMessage(id, editValue);
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-background">
      {messages.map(msg => (
        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
          <div className={`relative rounded-lg px-4 py-2 max-w-[70%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {msg.sender === 'agent' ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : editingId === msg.id ? (
              <div className="flex flex-col gap-2">
                <input
                  className="border rounded px-2 py-1 bg-white text-black"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button className="p-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700" title="Save" onClick={() => saveEdit(msg.id)}>
                    <Check className="w-4 h-4" />
                  </button>
                  <button className="p-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700" title="Cancel" onClick={cancelEdit}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              msg.text
            )}
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
          {msg.sender === 'user' && editingId !== msg.id && (
            <div className="flex gap-2 mt-2 mr-1 justify-end">
              <button
                className="p-1 rounded hover:bg-accent"
                title="Edit"
                onClick={() => startEdit(msg.id, msg.text)}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded hover:bg-accent"
                title="Copy"
                onClick={() => handleCopy(msg.text, msg.id)}
              >
                <Copy className="w-4 h-4" />
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