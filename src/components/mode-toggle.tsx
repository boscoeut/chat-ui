import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun, TreePalm, Droplet, Monitor } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  function ThemeIcon() {
    switch (theme) {
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem] text-blue-900 dark:text-blue-200" />
      case 'forest':
        return <TreePalm className="h-[1.2rem] w-[1.2rem] text-green-700" />
      case 'ocean':
        return <Droplet className="h-[1.2rem] w-[1.2rem] text-sky-500" />
      case 'system':
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem] text-gray-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          <ThemeIcon />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>
          <Sun className="w-4 h-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("dark")}>
          <Moon className="w-4 h-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("forest")}>
          <TreePalm className="w-4 h-4 mr-2" />
          Forest
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("ocean")}>
          <Droplet className="w-4 h-4 mr-2" />
          Ocean
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>
          <Monitor className="w-4 h-4 mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}