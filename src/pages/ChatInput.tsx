import { ArrowUp } from 'lucide-react';
import { useRef, useEffect } from 'react';

type ChatInputProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  disabled?: boolean;
};

export default function ChatInput({ input, onInputChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(e);
    }
  };

  return (
    <form onSubmit={onSend} className="border-t bg-background p-4 flex items-end gap-2">
      <textarea
        ref={textareaRef}
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring text-base resize-none min-h-[44px] max-h-[200px]"
        placeholder="Type your message..."
        value={input}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      <button
        type="submit"
        className="mb-0.5 w-9 h-9 flex items-center justify-center rounded-full bg-neutral-400 text-white hover:bg-neutral-600 disabled:opacity-50 transition-colors"
        disabled={disabled}
        aria-label="Send"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </form>
  );
} 