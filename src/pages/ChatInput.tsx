import { ArrowUp } from 'lucide-react';

type ChatInputProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  disabled?: boolean;
};

export default function ChatInput({ input, onInputChange, onSend, disabled }: ChatInputProps) {
  return (
    <form onSubmit={onSend} className="border-t bg-background p-4 flex items-center gap-2">
      <input
        className="flex-1 border rounded-full px-4 h-11 focus:outline-none focus:ring text-base"
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={e => onInputChange(e.target.value)}
      />
      <button
        type="submit"
        className="ml-2 w-11 h-11 flex items-center justify-center rounded-full bg-neutral-400 text-white hover:bg-neutral-600 disabled:opacity-50 transition-colors"
        disabled={disabled}
        aria-label="Send"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </form>
  );
} 