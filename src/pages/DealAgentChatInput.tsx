type DealAgentChatInputProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  disabled?: boolean;
};

export default function DealAgentChatInput({ input, onInputChange, onSend, disabled }: DealAgentChatInputProps) {
  return (
    <form onSubmit={onSend} className="border-t bg-background p-4 flex gap-2">
      <input
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={e => onInputChange(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
        disabled={disabled}
      >
        Send
      </button>
    </form>
  );
} 