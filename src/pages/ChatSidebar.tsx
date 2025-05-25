import { PencilLine, Trash } from 'lucide-react';

type Conversation = { id: number; name: string };

type ChatSidebarProps = {
  conversations: Conversation[];
  selectedConversation: number;
  onSelectConversation: (id: number) => void;
  onNewChat: () => void;
  open: boolean;
  onToggleSidebar: () => void;
};

export default function ChatSidebar({ conversations, selectedConversation, onSelectConversation, onNewChat, open }: ChatSidebarProps) {
  if (!open) {
    return null;
  }

  return (
    <aside className="w-64 bg-muted border-r flex flex-col">
      <div className="px-3 py-2 border-b flex items-center">
        <button
          className="flex items-center gap-2 px-1 py-1 flex-grow text-base text-left font-normal hover:bg-accent rounded transition-colors"
          title="New chat"
          onClick={onNewChat}
          type="button"
        >
          <PencilLine className="w-5 h-5" />
          <span>New chat</span>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {conversations.map(conv => (
          <div key={conv.id} className={`flex items-center group hover:bg-accent ${selectedConversation === conv.id ? 'bg-accent font-medium' : ''}`}>
            <button
              className={`flex-1 text-left px-4 py-2 focus:outline-none ${selectedConversation === conv.id ? 'font-medium' : ''}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              {conv.name}
            </button>
            <button
              className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Delete chat"
              // onClick={() => handleDelete(conv.id)}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
} 