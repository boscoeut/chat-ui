import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAppStore } from '@/store/app'

// Sample deals data - replace with your actual data source
const deals = [
  {
    id: "1",
    name: "Acme Corp Acquisition",
    value: "$50M",
    status: "In Progress"
  },
  {
    id: "2",
    name: "TechStart Merger",
    value: "$75M",
    status: "Pending"
  },
  {
    id: "3",
    name: "Global Solutions Partnership",
    value: "$100M",
    status: "Completed"
  },
  {
    id: "4",
    name: "Innovation Labs Investment",
    value: "$25M",
    status: "In Progress"
  },
  {
    id: "5",
    name: "Future Systems Integration",
    value: "$150M",
    status: "Pending"
  }
]

export function DealSelector() {
  const [open, setOpen] = React.useState(false)
  // Use Zustand for selected deal
  const selectedDeal = useAppStore((s: any) => s.selectedDeal)
  const setSelectedDeal = useAppStore((s: any) => s.setSelectedDeal)

  // Alphabetize deals by name
  const sortedDeals = [...deals].sort((a, b) => a.name.localeCompare(b.name))

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
        <Command>
          <CommandInput placeholder="Search deals..." />
          <CommandEmpty>No deal found.</CommandEmpty>
          <CommandGroup>
            {sortedDeals.map((deal) => (
              <CommandItem
                key={deal.id}
                value={deal.name}
                onSelect={() => {
                  setSelectedDeal(deal.id === selectedDeal ? null : deal.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 pointer-events-none",
                    selectedDeal === deal.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{deal.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {deal.value} • {deal.status}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 