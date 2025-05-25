type Message = { id: number; sender: 'user' | 'agent'; text: string };

type ChatHistoryProps = {
  messages: Message[];
};

export default function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-background">
      {messages.map(msg => (
        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`rounded-lg px-4 py-2 max-w-[70%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
} 