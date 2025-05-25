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
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAppStore } from '@/store/app'

// Deals data: Apple, Microsoft, NVIDIA
const deals = [
  { id: "Apple", name: "Apple" },
  { id: "Microsoft", name: "Microsoft" },
  { id: "NVIDIA", name: "NVIDIA" },
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
          <CommandList>
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
                      "mr-2 h-4 w-4",
                      selectedDeal === deal.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {deal.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 