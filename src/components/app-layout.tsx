import { Outlet } from 'react-router'
import { AppHeader } from './app-header'

export function AppLayout() {
    return (
        <div className="h-screen flex flex-col w-full ~bg-muted/50">
            <AppHeader />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}