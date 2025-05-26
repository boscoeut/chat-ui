import { ArrowUp, Paperclip, X } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

type ChatInputProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  disabled?: boolean;
  onFileChange?: (file: File | null) => void;
};

export default function ChatInput({ input, onInputChange, onSend, disabled, onFileChange }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (onFileChange) onFileChange(file);
  };

  return (
    <div className="border-t bg-background p-4">
      {selectedFile && (
        <div className="flex items-center mb-2 max-w-xs rounded-xl border border-muted bg-muted px-3 py-2 relative shadow-sm">
          {selectedFile.type.startsWith('image') && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt={selectedFile.name}
              className="w-10 h-10 object-cover rounded-lg mr-2"
            />
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate max-w-[120px]">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              {selectedFile.type.startsWith('image') ? 'Image' : selectedFile.type || 'File'}
            </span>
          </div>
          <button
            type="button"
            className="absolute top-1 right-1 p-1 rounded-full hover:bg-accent"
            onClick={() => {
              setSelectedFile(null);
              if (onFileChange) onFileChange(null);
            }}
            aria-label="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <form onSubmit={onSend} className="flex items-end gap-2">
        <button
          type="button"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-800 text-muted-foreground"
          onClick={handleAttachmentClick}
          tabIndex={-1}
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
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
    </div>
  );
} 