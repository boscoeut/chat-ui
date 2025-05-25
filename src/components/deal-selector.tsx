import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAppStore } from '@/store/app'
import { Input } from "@/components/ui/input"

// Deals data: Apple, Microsoft, NVIDIA
const deals = [
  { id: "Apple", name: "Apple" },
  { id: "Microsoft", name: "Microsoft" },
  { id: "NVIDIA", name: "NVIDIA" },
]

export function DealSelector() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const selectedDeal = useAppStore((s: any) => s.selectedDeal)
  const setSelectedDeal = useAppStore((s: any) => s.setSelectedDeal)

  // Set initial deal from URL param, always taking precedence over persisted state
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dealParam = params.get('deal')
    if (dealParam && deals.some(d => d.id === dealParam)) {
      setSelectedDeal(dealParam)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Alphabetize deals by name and filter by search
  const filteredDeals = React.useMemo(() => {
    return [...deals]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(deal => 
        deal.name.toLowerCase().includes(search.toLowerCase())
      )
  }, [search])

  // Reset selected index when search changes or popover opens/closes
  React.useEffect(() => {
    setSelectedIndex(-1)
  }, [search, open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(i => 
          i < filteredDeals.length - 1 ? i + 1 : i
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(i => i > 0 ? i - 1 : i)
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredDeals.length) {
          const deal = filteredDeals[selectedIndex]
          setSelectedDeal(deal.id === selectedDeal ? null : deal.id)
          setOpen(false)
          setSearch("")
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        break
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedDeal
            ? deals.find((deal) => deal.id === selectedDeal)?.name
            : "Select deal..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="flex flex-col" onKeyDown={handleKeyDown}>
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search deals..."
              className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filteredDeals.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No deals found.
            </div>
          ) : (
            filteredDeals.map((deal, index) => (
              <button
                key={deal.id}
                className={cn(
                  "flex items-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  (selectedDeal === deal.id || selectedIndex === index) && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  setSelectedDeal(deal.id === selectedDeal ? null : deal.id)
                  setOpen(false)
                  setSearch("")
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedDeal === deal.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {deal.name}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
} 