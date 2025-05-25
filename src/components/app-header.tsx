import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { mainMenu } from '@/config/menu'
import { cn } from '@/lib/utils'
import { ChevronDown, PanelLeftOpen, PanelLeftClose } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AppLogo } from './app-logo'
import { AppSidebar } from './app-sidebar'
import { ModeToggle } from './mode-toggle'
import { useAppStore } from '@/store/app'

export function AppHeader() {
    const location = useLocation()
    const sidebarOpen = useAppStore(s => s.sidebarOpen)
    const toggleSidebar = useAppStore(s => s.toggleSidebar)

    return (
        <header className="bg-background sticky top-0 z-50 border-b">
            <div className="w-full ~max-w-7xl mx-auto flex items-center gap-2 h-14 px-4 md:px-8">
                <button
                    className="p-2 rounded hover:bg-accent mr-2"
                    title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    onClick={toggleSidebar}
                    type="button"
                >
                    {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                </button>
                <div className='flex items-center gap-2 md:gap-0'>
                    <AppSidebar />
                    <Link to="/">
                        <AppLogo />
                    </Link>
                </div>

                <div className='ml-4 flex-1 flex items-center justify-between'>
                    <div className='flex-1'>
                        <nav className="hidden md:flex gap-1">
                            {mainMenu.map((item, index) => (
                                item.items && item.items.length > 0 ? (
                                    <DropdownMenu key={index}>
                                        <DropdownMenuTrigger className='focus-visible:outline-none'>
                                            <NavLink
                                                key={index}
                                                to={item.url}
                                                className={({ isActive }) => cn(
                                                    "flex items-center gap-2 overflow-hidden rounded-md p-2.5 text-left text-sm outline-none transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:size-4",
                                                    "h-8 text-sm hover:bg-accent hover:text-accent-foreground",
                                                    isActive ? "text-foreground bg-accent" : "text-foreground/70"
                                                )}>
                                                {item.icon && <item.icon />}
                                                <span className='font-medium'>{item.title}</span>
                                                <ChevronDown className='!size-3 -ml-1' />
                                            </NavLink>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='start' className='min-w-56'>
                                            {item.items.map((subItem, index) => (
                                                <DropdownMenuItem key={index} asChild>
                                                    <NavLink
                                                        to={subItem.url}
                                                        className={cn(
                                                            'cursor-pointer',
                                                            subItem.url === location.pathname && 'bg-muted'
                                                        )}>
                                                        {subItem.title}
                                                    </NavLink>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <NavLink
                                        key={index}
                                        to={item.url}
                                        className={({ isActive }) => cn(
                                            "flex items-center gap-2 overflow-hidden rounded-md p-2.5 text-left text-sm outline-none transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:size-4",
                                            "h-8 text-sm hover:bg-accent hover:text-accent-foreground",
                                            isActive ? "text-foreground bg-accent" : "text-foreground/70"
                                        )}>
                                        {item.icon && <item.icon />}
                                        <span className='font-medium'>{item.title}</span>
                                    </NavLink>
                                )
                            ))}
                        </nav>
                    </div>
                    <nav className="flex gap-1">
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}