import { PencilLine, Trash } from 'lucide-react';
import { useAppStore } from '../store/app';
import { cn } from '../lib/utils';

type ChatSidebarProps = {
  open: boolean;
};

export default function ChatSidebar({ open }: ChatSidebarProps) {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    deleteConversation,
    addConversation,
  } = useAppStore();

  if (!open) {
    return null;
  }

  const handleNewChat = () => {
    const newId = Math.max(...conversations.map(c => c.id)) + 1;
    addConversation(`New Chat ${newId}`);
  };

  const isLastChat = conversations.length <= 1;

  return (
    <aside className="w-64 bg-muted border-r flex flex-col">
      <div className="px-3 py-2 border-b flex items-center">
        <button
          className="flex items-center gap-2 px-1 py-1 flex-grow text-base text-left font-normal hover:bg-accent rounded transition-colors"
          title="New chat"
          onClick={handleNewChat}
          type="button"
        >
          <PencilLine className="w-5 h-5" />
          <span>New chat</span>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {conversations.map(conv => (
          <div 
            key={conv.id} 
            className={cn(
              "flex items-center group relative",
              selectedConversation === conv.id 
                ? "bg-accent/50 border-l-2 border-primary" 
                : "hover:bg-accent/30"
            )}
          >
            <button
              className={cn(
                "flex-1 text-left px-4 py-2 focus:outline-none",
                selectedConversation === conv.id 
                  ? "font-medium text-foreground" 
                  : "text-muted-foreground"
              )}
              onClick={() => setSelectedConversation(conv.id)}
            >
              {conv.name}
            </button>
            <button
              className={cn(
                "p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100",
                selectedConversation === conv.id && "opacity-100",
                isLastChat && "opacity-50 cursor-not-allowed"
              )}
              title={isLastChat ? "Cannot delete the last chat" : "Delete chat"}
              onClick={() => !isLastChat && deleteConversation(conv.id)}
              disabled={isLastChat}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
} 