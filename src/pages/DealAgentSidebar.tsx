type Conversation = { id: number; name: string };

type DealAgentSidebarProps = {
  conversations: Conversation[];
  selectedConversation: number;
  onSelectConversation: (id: number) => void;
  onNewChat: () => void;
};

export default function DealAgentSidebar({ conversations, selectedConversation, onSelectConversation, onNewChat }: DealAgentSidebarProps) {
  return (
    <aside className="w-64 bg-muted border-r flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <span className="font-semibold text-lg">DealAgent</span>
        <button
          className="ml-2 px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/80 text-sm"
          title="New chat"
          onClick={onNewChat}
        >
          +
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {conversations.map(conv => (
          <button
            key={conv.id}
            className={`w-full text-left px-4 py-2 hover:bg-accent ${selectedConversation === conv.id ? 'bg-accent font-medium' : ''}`}
            onClick={() => onSelectConversation(conv.id)}
          >
            {conv.name}
          </button>
        ))}
      </nav>
    </aside>
  );
} 